import {
  getPairKeyValue,
  getYAMLScalarValue,
  getYAMLSequenceEntryIndicators,
  isYAMLMapping,
  isYAMLScalar,
  isYAMLSequence,
} from '../utils/ast'
import { createESLintRule } from '../utils/createRule'
import { hasExpression } from '../utils/expression'
import { visitWorkflow } from '../utils/workflow'
import type { YAMLAst } from '../types/yaml'

export const RULE_NAME = 'valid-job-needs'
export type MessageIds =
  | 'invalidNeeds'
  | 'unexpectedExpression'
  | 'unknownJob'
  | 'selfDependency'
  | 'circularDependency'
export type Options = []

type ReportNode = Exclude<YAMLAst.YAMLNode, YAMLAst.YAMLProgram>

interface Job {
  id: string
  pair: YAMLAst.YAMLPair
  dependencies: Map<Job, ReportNode>
  order: number
  index: number
  lowlink: number
  stackIndex: number
  onStack: boolean
}

/**
 * Finds strongly connected components with Tarjan's algorithm. Self references
 * are validated separately and never enter the graph.
 * @param jobs - Jobs in declaration order, with validated dependency edges.
 * @returns Components containing at least two jobs, in declaration order.
 */
function findCycles(jobs: Map<string, Job>): Job[][] {
  const stack: Job[] = []
  const frames: { job: Job; dependencies: MapIterator<Job> }[] = []
  const cycles: Job[][] = []
  let index = 0

  function enter(job: Job) {
    job.index = index
    job.lowlink = index++
    job.stackIndex = stack.length
    job.onStack = true
    stack.push(job)
    frames.push({ job, dependencies: job.dependencies.keys() })
  }

  for (const root of jobs.values()) {
    if (root.index !== -1) {
      continue
    }
    enter(root)
    // Keep DFS frames on the heap so dependency depth cannot exhaust the call stack.
    while (frames.length) {
      const { job, dependencies } = frames[frames.length - 1]
      const next = dependencies.next()
      if (!next.done) {
        const dependency = next.value
        if (dependency.index === -1) {
          enter(dependency)
        } else if (dependency.onStack) {
          job.lowlink = Math.min(job.lowlink, dependency.index)
        }
        continue
      }

      frames.pop()
      if (frames.length) {
        const parent = frames[frames.length - 1].job
        parent.lowlink = Math.min(parent.lowlink, job.lowlink)
      }
      if (job.lowlink === job.index) {
        const component = stack.splice(job.stackIndex)
        for (const member of component) {
          member.onStack = false
        }
        if (component.length > 1) {
          cycles.push(component.sort((a, b) => a.order - b.order))
        }
      }
    }
  }
  return cycles.sort((a, b) => a[0].order - b[0].order)
}

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      recommended: true,
      description: 'disallow invalid job dependencies.',
    },
    schema: [],
    messages: {
      invalidNeeds:
        'Needs must be a non-empty job ID or an array of non-empty job IDs.',
      unexpectedExpression:
        'Needs must use static job IDs; expressions are not supported.',
      unknownJob: 'Job "{{job}}" depends on unknown job "{{dependency}}".',
      selfDependency: 'Job "{{job}}" cannot depend on itself.',
      circularDependency: 'Circular dependency detected among jobs: {{jobs}}.',
    },
  },
  create(context) {
    return {
      YAMLDocument(document) {
        visitWorkflow(document, {
          workflow(workflow, resolve) {
            for (const jobsPair of workflow.pairs) {
              if (getPairKeyValue(jobsPair) !== 'jobs') {
                continue
              }
              const mapping = resolve(jobsPair.value)
              if (!isYAMLMapping(mapping)) {
                continue
              }

              // Collect by ID, since aliased mappings can belong to several jobs.
              const jobs = new Map<string, Job>()
              for (const pair of mapping.pairs) {
                const id = getPairKeyValue(pair)
                if (id) {
                  jobs.set(id, {
                    id,
                    pair,
                    dependencies: new Map(),
                    order: jobs.size,
                    index: -1,
                    lowlink: -1,
                    stackIndex: -1,
                    onStack: false,
                  })
                }
              }

              for (const job of jobs.values()) {
                const body = resolve(job.pair.value)
                if (!isYAMLMapping(body)) {
                  continue
                }
                const jobAlias =
                  jobsPair.value?.type === 'YAMLAlias'
                    ? jobsPair.value
                    : job.pair.value?.type === 'YAMLAlias'
                      ? job.pair.value
                      : undefined

                for (const pair of body.pairs) {
                  if (getPairKeyValue(pair) !== 'needs') {
                    continue
                  }
                  const needs = resolve(pair.value)
                  const alias =
                    jobAlias ??
                    (pair.value?.type === 'YAMLAlias' ? pair.value : undefined)
                  if (isYAMLSequence(needs)) {
                    let indicators: YAMLAst.Token[] | undefined
                    for (const [index, entry] of needs.entries.entries()) {
                      if (!entry) {
                        indicators ??= getYAMLSequenceEntryIndicators(
                          needs,
                          context.sourceCode,
                        )
                        context.report({
                          node: alias ?? needs,
                          loc: alias?.loc ?? indicators[index].loc,
                          messageId: 'invalidNeeds',
                        })
                        continue
                      }
                      validateDependency(
                        resolve(entry),
                        alias ?? entry,
                        job,
                        jobs,
                      )
                    }
                  } else {
                    validateDependency(
                      needs,
                      alias ?? pair.value ?? pair,
                      job,
                      jobs,
                    )
                  }
                }
              }

              for (const component of findCycles(jobs)) {
                const members = new Set(component)
                const references = component
                  .flatMap(job =>
                    [...job.dependencies].flatMap(([dependency, node]) =>
                      members.has(dependency) ? [node] : [],
                    ),
                  )
                  .sort((a, b) => a.range[0] - b.range[0])
                // Every multi-job component contains at least one internal edge.
                const node = references[0]
                context.report({
                  node,
                  loc: node.loc,
                  messageId: 'circularDependency',
                  data: { jobs: component.map(job => job.id).join(', ') },
                })
              }
            }
          },
        })
      },
    }

    function validateDependency(
      value: YAMLAst.YAMLContent | null,
      node: ReportNode,
      job: Job,
      jobs: Map<string, Job>,
    ) {
      const dependency = isYAMLScalar(value) ? getYAMLScalarValue(value) : null
      if (typeof dependency !== 'string' || !dependency.trim()) {
        context.report({ node, loc: node.loc, messageId: 'invalidNeeds' })
      } else if (hasExpression(dependency)) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpectedExpression',
        })
      } else if (dependency === job.id) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'selfDependency',
          data: { job: job.id },
        })
      } else {
        const target = jobs.get(dependency)
        if (!target) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'unknownJob',
            data: { job: job.id, dependency },
          })
        } else if (!job.dependencies.has(target)) {
          job.dependencies.set(target, node)
        }
      }
    }
  },
})
