import { Linter } from 'eslint'
import { expect, it } from 'vitest'
import * as yamlParser from 'yaml-eslint-parser'
import rule, { RULE_NAME } from '../../src/rules/valid-job-needs'
import { $, run } from '../helpers/rule-tester'
import type { Options } from '../../src/rules/valid-job-needs'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    '',
    'name: CI',
    'jobs:',
    'jobs: []',
    'jobs: {}',
    'jobs: { 123: {}, "": {}, ? [key] : {} }',
    'jobs: { build: null, test: false, deploy: [] }',
    'jobs: { build: {}, test: { needs: [] } }',
    'jobs: { build: {}, test: { needs: [build, build] } }',
    'jobs: { build: {}, test: { needs: build } }',
    'jobs: { test: { needs: build }, build: {} }',
    'jobs: { constructor: {}, __proto__: {}, test: { needs: [constructor, __proto__] } }',
    'jobs: { !!str 123: {}, test: { !!str needs: !!str 123 } }',
    'jobs: { !!str false: {}, test: { needs: !!str false } }',
    {
      filename: 'diamond.yml',
      code: $`
        jobs:
          deploy:
            needs: [test, lint]
          test:
            needs: build
            strategy:
              matrix:
                node: [22, 24]
          lint:
            needs: build
          build:
            uses: ./.github/workflows/build.yml
      `,
    },
    {
      filename: 'aliases-and-tags.yml',
      code: $`
        &workflow
        !!str jobs: &jobs
          build: &build {}
          copy: *build
          test: &test
            !!str needs: &needs [!!str build, &id copy, *id]
          copy-test: *test
          deploy:
            needs: *needs
      `,
    },
    {
      filename: 'jobs-alias.yml',
      code: $`
        template: &jobs
          build: {}
          test:
            needs: build
        jobs: *jobs
      `,
    },
    {
      filename: 'ignores-unrelated-needs.yml',
      code: $`
        needs: missing
        env:
          needs: missing
        jobs:
          test:
            name: Test
            steps:
              - run: echo \${{ needs.missing.outputs.value }}
                needs: missing
            strategy:
              needs: missing
      `,
    },
    {
      filename: 'document-graphs-are-independent.yml',
      code: $`
        jobs:
          a: { needs: b }
          b: {}
        ---
        jobs:
          a: {}
          b: { needs: a }
      `,
    },
  ],
  invalid: [
    ...[
      'null',
      '~',
      '',
      'false',
      '123',
      '1.5',
      '""',
      '"   "',
      '{}',
      '{ build: true }',
      '!!int "123"',
      '!!bool "true"',
      '!!null null',
      '*missing',
      '&empty',
    ].map(value => ({
      code: `jobs:\n  test:\n    needs: ${value}`,
      errors: [{ messageId: 'invalidNeeds' }],
    })),
    ...[
      `\${{ inputs.job }}`,
      `build-\${{ inputs.job }}`,
      `\${{ inputs.job }}-test`,
      `\${{ inputs.a }}\${{ inputs.b }}`,
      `\${{ }}`,
      `\${{ missing-end`,
    ].map(value => ({
      code: `jobs: { test: { needs: ${JSON.stringify(value)} } }`,
      errors: [{ messageId: 'unexpectedExpression' }],
    })),
    {
      code: 'jobs: { build: {}, test: { needs: biuld } }',
      errors: [
        {
          messageId: 'unknownJob',
          message: 'Job "test" depends on unknown job "biuld".',
        },
      ],
    },
    ...['Build', ' build', 'build ', 'Build name', 'build.test'].map(
      dependency => ({
        code: `jobs: { build: { name: Build name }, test: { needs: ${JSON.stringify(dependency)} } }`,
        errors: [{ messageId: 'unknownJob' }],
      }),
    ),
    {
      code: 'jobs: { build: { needs: build } }',
      errors: [
        {
          messageId: 'selfDependency',
          message: 'Job "build" cannot depend on itself.',
        },
      ],
    },
    {
      filename: 'mixed-array.yml',
      code: $`
        jobs:
          build: {}
          test:
            needs:
              - build
              - false
              -
              - ''
              - [build]
              - { job: build }
              - missing
              - \${{ inputs.job }}
              - test
      `,
      errors: [
        { messageId: 'invalidNeeds', line: 6, column: 9 },
        { messageId: 'invalidNeeds', line: 7, column: 7, endColumn: 8 },
        { messageId: 'invalidNeeds', line: 8, column: 9 },
        { messageId: 'invalidNeeds', line: 9, column: 9 },
        { messageId: 'invalidNeeds', line: 10, column: 9 },
        { messageId: 'unknownJob', line: 11, column: 9 },
        { messageId: 'unexpectedExpression', line: 12, column: 9 },
        { messageId: 'selfDependency', line: 13, column: 9 },
      ],
    },
    {
      filename: 'empty-entries-with-nested-sequences.yml',
      code: $`
        jobs:
          build: {}
          test:
            needs:
              - # first empty entry
              - - build
                - build
              - build
              - # trailing empty entry
              - # consecutive empty entry
      `,
      errors: [
        {
          messageId: 'invalidNeeds',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 8,
        },
        { messageId: 'invalidNeeds', line: 6, column: 9 },
        {
          messageId: 'invalidNeeds',
          line: 9,
          column: 7,
          endLine: 9,
          endColumn: 8,
        },
        {
          messageId: 'invalidNeeds',
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 8,
        },
      ],
    },
    {
      filename: 'empty-entries-through-alias.yml',
      code: $`
        jobs:
          a:
            needs: &needs
              -
              -
          b:
            needs: *needs
      `,
      errors: [
        { messageId: 'invalidNeeds', line: 4, column: 7, endColumn: 8 },
        { messageId: 'invalidNeeds', line: 5, column: 7, endColumn: 8 },
        { messageId: 'invalidNeeds', line: 7, column: 12 },
        { messageId: 'invalidNeeds', line: 7, column: 12 },
      ],
    },
    {
      filename: 'two-job-cycle-with-downstream.yml',
      code: $`
        jobs:
          a:
            needs: b
          b:
            needs: a
          deploy:
            needs: a
      `,
      errors: [
        {
          messageId: 'circularDependency',
          message: 'Circular dependency detected among jobs: a, b.',
          line: 3,
          column: 12,
          endColumn: 13,
        },
      ],
    },
    {
      filename: 'overlapping-cycles.yml',
      code: $`
        jobs:
          a:
            needs: [c, b, a]
          b:
            needs: [c, a]
          c:
            needs: [a, b]
      `,
      errors: [
        {
          messageId: 'circularDependency',
          message: 'Circular dependency detected among jobs: a, b, c.',
          line: 3,
          column: 13,
        },
        { messageId: 'selfDependency', line: 3, column: 19 },
      ],
    },
    {
      filename: 'independent-cycles-and-cross-component-edges.yml',
      code: $`
        jobs:
          a: { needs: [b, c] }
          b: { needs: a }
          c: { needs: d }
          d: { needs: c }
          downstream: { needs: [a, c] }
      `,
      errors: [
        {
          messageId: 'circularDependency',
          message: 'Circular dependency detected among jobs: a, b.',
          line: 2,
        },
        {
          messageId: 'circularDependency',
          message: 'Circular dependency detected among jobs: c, d.',
          line: 4,
        },
      ],
    },
    {
      filename: 'conditions-do-not-remove-edges.yml',
      code: $`
        jobs:
          a:
            needs: [missing, b, b, false]
            if: false
          b:
            needs: a
            if: always()
            continue-on-error: true
            uses: ./.github/workflows/build.yml
      `,
      errors: [
        { messageId: 'unknownJob', line: 3, column: 13 },
        { messageId: 'circularDependency', line: 3, column: 22 },
        { messageId: 'invalidNeeds', line: 3, column: 28 },
      ],
    },
    {
      filename: 'shared-job-keeps-each-id.yml',
      code: $`
        jobs:
          a: &job
            needs: b
          b: *job
      `,
      errors: [{ messageId: 'selfDependency', line: 4, column: 6 }],
    },
    {
      filename: 'shared-job-cycle.yml',
      code: $`
        jobs:
          a: &job
            needs: c
          b: *job
          c:
            needs: b
      `,
      errors: [
        {
          messageId: 'circularDependency',
          message: 'Circular dependency detected among jobs: b, c.',
          line: 4,
          column: 6,
        },
      ],
    },
    {
      filename: 'aliased-needs.yml',
      code: $`
        jobs:
          a:
            needs: &needs [missing, &id unknown, *id]
          b:
            needs: *needs
      `,
      errors: [
        { messageId: 'unknownJob', line: 3, column: 20 },
        { messageId: 'unknownJob', line: 3, column: 29 },
        { messageId: 'unknownJob', line: 3, column: 42 },
        { messageId: 'unknownJob', line: 5, column: 12 },
        { messageId: 'unknownJob', line: 5, column: 12 },
        { messageId: 'unknownJob', line: 5, column: 12 },
      ],
    },
    {
      filename: 'scalar-alias.yml',
      code: $`
        target: &id missing
        jobs:
          a:
            needs: *id
      `,
      errors: [{ messageId: 'unknownJob', line: 4, column: 12 }],
    },
    {
      filename: 'jobs-alias-location.yml',
      code: $`
        template: &jobs
          a: &job
            needs: missing
          b: *job
        jobs: *jobs
      `,
      errors: [
        { messageId: 'unknownJob', line: 5, column: 7 },
        { messageId: 'unknownJob', line: 5, column: 7 },
      ],
    },
    {
      filename: 'anchor-shadowing.yml',
      code: $`
        first: &id missing
        second: &id build
        jobs:
          build: {}
          test:
            needs: [*id, *unknown]
      `,
      errors: [{ messageId: 'invalidNeeds', line: 6, column: 18 }],
    },
    {
      filename: 'document-ids-and-anchors-are-independent.yml',
      code: $`
        jobs:
          build: {}
          test:
            needs: &id build
        ---
        jobs:
          test:
            needs: build
          deploy:
            needs: *id
      `,
      errors: [
        { messageId: 'unknownJob', line: 8, column: 12 },
        { messageId: 'invalidNeeds', line: 10, column: 12 },
      ],
    },
  ],
})

it.each([false, true])(
  'checks an 8000-job dependency chain (cycle: %s)',
  isCycle => {
    const jobCount = 8000
    const code = `jobs:\n${Array.from({ length: jobCount }, (_, index) => {
      const dependency =
        index + 1 < jobCount ? `job${index + 1}` : isCycle ? 'job0' : ''
      return `  job${index}: { needs: [${dependency}] }`
    }).join('\n')}`
    const messages = new Linter().verify(code, [
      {
        languageOptions: { parser: yamlParser },
        plugins: { test: { rules: { [RULE_NAME]: rule } } },
        rules: { [`test/${RULE_NAME}`]: 'error' },
      },
    ])
    expect(messages.map(message => message.messageId)).toEqual(
      isCycle ? ['circularDependency'] : [],
    )
  },
)
