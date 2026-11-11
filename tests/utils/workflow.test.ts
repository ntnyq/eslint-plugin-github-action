import { describe, expect, it } from 'vitest'
import { parseYAML } from 'yaml-eslint-parser'
import { getPairKeyValue } from '../../src/utils/action'
import { visitWorkflow } from '../../src/utils/workflow'
import { $ } from '../internal'

describe('visitWorkflow', () => {
  it('visits anchored mappings and recursive parallel groups once per role', () => {
    const [document] = parseYAML($`
      jobs: &jobs
        test: &job
          strategy: &strategy
            fail-fast: true
          container: &container
            image: node
          services: &services
            db: &db
              image: postgres
          steps: &steps
            - &group
              parallel:
                - run: echo test
                - *group
                - parallel: *steps
            - *group
        copy: *job
        other:
          strategy: *strategy
          container: *container
          services: *services
          steps: *steps
    `).body
    const kinds: string[] = []
    visitWorkflow(document, {
      workflow: () => kinds.push('workflow'),
      job: () => kinds.push('job'),
      step: () => kinds.push('step'),
      strategy: () => kinds.push('strategy'),
      container: () => kinds.push('container'),
      service: () => kinds.push('service'),
    })
    expect(kinds).toEqual([
      'workflow',
      'job',
      'strategy',
      'container',
      'service',
      'step',
      'step',
      'step',
      'job',
    ])
  })

  it('resolves the nearest preceding anchor within each document', () => {
    const documents = parseYAML($`
      jobs:
        test:
          steps:
            - uses: &uses first
            - uses: *uses
            - uses: &uses second
            - uses: *uses
      ---
      jobs:
        test:
          steps:
            - uses: *uses
            - uses: &uses third
            - uses: *uses
    `).body
    const values: unknown[] = []
    for (const document of documents) {
      visitWorkflow(document, {
        step(node, resolve) {
          for (const pair of node.pairs) {
            const value = resolve(pair.value)
            values.push(value?.type === 'YAMLScalar' ? value.value : null)
          }
        },
      })
    }
    expect(values).toEqual([
      'first',
      'first',
      'second',
      'second',
      null,
      'third',
      'third',
    ])
  })

  it.each([
    '',
    'null',
    '[]',
    'jobs: []',
    'jobs: { test: null }',
    'jobs: { test: { steps: false, services: [] } }',
  ])('ignores malformed structures: %s', code => {
    expect(() => visitWorkflow(parseYAML(code).body[0], {})).not.toThrow()
  })

  it('checks only workflow structure, preserving arbitrary input mappings', () => {
    const [document] = parseYAML($`
      env:
        template: &template
          run: echo test
      jobs:
        test:
          with:
            steps:
              - uses: ignored
          steps:
            - *template
            - with:
                parallel:
                  - uses: ignored
    `).body
    const keys: unknown[] = []
    visitWorkflow(document, {
      step(node) {
        keys.push(node.pairs.map(getPairKeyValue))
      },
    })
    expect(keys).toEqual([['run'], ['with']])
  })
})
