import { getPairKeyValue } from './action'
import { isYAMLMapping, isYAMLSequence, resolveYAMLNode } from './ast'
import type { YAMLAst } from '../types/yaml'

/**
 * YAML content accepted by traversal, including metadata wrappers and empty values.
 */
type YAMLValue = YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null

/**
 * Structural role of a workflow mapping, used to select visitors and deduplicate visits.
 */
type MappingKind =
  | 'workflow'
  | 'job'
  | 'step'
  | 'strategy'
  | 'container'
  | 'service'

/**
 * Resolves a YAML value using anchors from the current document.
 *
 * @param node - Content, metadata wrapper, alias, or empty value to resolve.
 * @returns Unwrapped content, the aliased anchor's value, or null when empty or
 * unresolved. Nodes without metadata or aliases are returned unchanged.
 */
type ResolveNode = (node: YAMLValue) => YAMLAst.YAMLContent | null

/**
 * Callback invoked before traversing a workflow mapping's children.
 *
 * @param node - Resolved mapping being visited in the callback's structural role.
 * @param resolve - Resolver for mapping values, using the current document's anchors.
 */
type WorkflowVisitor = (node: YAMLAst.YAMLMapping, resolve: ResolveNode) => void

/**
 * Optional visitors for each workflow mapping role; omitted roles are still traversed.
 */
type WorkflowVisitors = Partial<Record<MappingKind, WorkflowVisitor>>

/**
 * Visits workflow, job, step, strategy, container, and service mappings.
 *
 * Traverses recognized workflow structures depth-first, invoking each visitor
 * before its children, including steps in nested parallel groups. Shared mappings
 * are visited once per role, and step sequences are traversed once per call.
 * Missing visitors do not prevent traversal. Non-mapping structures are skipped
 * where a mapping is expected, and non-sequence step collections are skipped.
 *
 * @param document - Parsed YAML document containing the workflow and its anchors.
 * @param visitors - Optional callbacks keyed by mapping role. Each receives the
 * resolved mapping and a resolver that unwraps YAML metadata or resolves aliases
 * using the nearest preceding anchor with the same name in this document.
 * The resolver preserves other nodes and returns null for null input, empty
 * metadata values, or unresolved aliases.
 */
export function visitWorkflow(
  document: YAMLAst.YAMLDocument,
  visitors: WorkflowVisitors,
) {
  const visited = new Map<MappingKind, Set<YAMLAst.YAMLMapping>>()
  const visitedSequences = new Set<YAMLAst.YAMLSequence>()

  const resolve: ResolveNode = resolveYAMLNode

  /**
   * Visits a resolved mapping once per role, then traverses its recognized children.
   * Non-mapping values and mappings already visited in this role are skipped.
   *
   * @param value - Mapping, metadata wrapper, or alias to resolve before visiting.
   * @param kind - Structural role selecting the visitor and child traversal rules.
   */
  function visitMapping(value: YAMLValue, kind: MappingKind) {
    const node = resolve(value)
    if (!isYAMLMapping(node)) {
      return
    }
    let mappings = visited.get(kind)
    if (!mappings) {
      mappings = new Set()
      visited.set(kind, mappings)
    }
    if (mappings.has(node)) {
      return
    }
    mappings.add(node)
    visitors[kind]?.(node, resolve)

    for (const pair of node.pairs) {
      const key = getPairKeyValue(pair)
      if (kind === 'workflow' && key === 'jobs') {
        visitEntries(pair.value, 'job')
      } else if (kind === 'job') {
        if (key === 'steps') {
          visitSteps(pair.value)
        } else if (key === 'strategy') {
          visitMapping(pair.value, 'strategy')
        } else if (key === 'container') {
          visitMapping(pair.value, 'container')
        } else if (key === 'services') {
          visitEntries(pair.value, 'service')
        }
      } else if (kind === 'step' && key === 'parallel') {
        visitSteps(pair.value)
      }
    }
  }

  /**
   * Visits the values of a resolved jobs or services mapping in source order.
   * Non-mapping collections are skipped.
   *
   * @param value - Collection mapping, metadata wrapper, or alias to resolve.
   * @param kind - Structural role assigned to each entry's mapping value.
   */
  function visitEntries(value: YAMLValue, kind: MappingKind) {
    const node = resolve(value)
    if (isYAMLMapping(node)) {
      for (const pair of node.pairs) {
        visitMapping(pair.value, kind)
      }
    }
  }

  /**
   * Visits entries of a resolved steps or parallel sequence as step mappings.
   * Non-sequence values and previously traversed sequences are skipped to avoid
   * repeated traversal and cycles through aliases.
   *
   * @param value - Step sequence, metadata wrapper, or alias to resolve.
   */
  function visitSteps(value: YAMLValue) {
    const node = resolve(value)
    if (!isYAMLSequence(node) || visitedSequences.has(node)) {
      return
    }
    visitedSequences.add(node)
    for (const entry of node.entries) {
      visitMapping(entry, 'step')
    }
  }

  visitMapping(document.content, 'workflow')
}
