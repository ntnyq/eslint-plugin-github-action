import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/job-name-casing'
import { $, run } from '../helpers/rule-tester'
import type { Options } from '../../src/rules/job-name-casing'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-jobs.yml',
      code: $`
        name: Test
        on: push
      `,
    },
    {
      filename: 'no-job-name.yml',
      code: $`
        jobs:
          test:
            runs-on: ubuntu-latest
      `,
    },
    {
      filename: 'non-mapping-job.yml',
      code: $`
        jobs:
          test: ubuntu-latest
      `,
    },
    {
      filename: 'non-string-name.yml',
      code: $`
        jobs:
          test:
            name: [Unit, test]
      `,
    },
    {
      filename: 'title-case.yml',
      code: $`
        jobs:
          test:
            name: Unit Test
      `,
    },
    {
      filename: 'acronyms-and-punctuation.yml',
      code: $`
        jobs:
          deploy:
            name: Deploy To AWS (CI) With Node.js & C/C++
      `,
    },
    {
      filename: 'expression.yml',
      code: $`
        jobs:
          test:
            name: Test On Node \${{ matrix.node }} With \${{ matrix.os }}
      `,
    },
    {
      filename: 'single-expression.yml',
      code: $`
        jobs:
          test:
            name: \${{ matrix.name }}
      `,
    },
    {
      filename: 'leading-expression.yml',
      code: $`
        jobs:
          test:
            name: \${{ matrix.os }} on Linux
      `,
      options: [{ 'Title Case': true, allowLowercaseMinorWords: true }],
    },
    {
      filename: 'minor-words.yml',
      code: $`
        jobs:
          lint:
            name: Lint Code and Documentation on Node \${{ matrix.node }}
      `,
      options: [{ 'Title Case': true, allowLowercaseMinorWords: true }],
    },
    {
      filename: 'kebab-case.yml',
      code: $`
        jobs:
          test:
            name: unit-test
      `,
      options: ['kebab-case'],
    },
    {
      filename: 'kebab-case-expression.yml',
      code: $`
        jobs:
          test:
            name: Unit Test \${{ matrix.os }}
      `,
      options: ['kebab-case'],
    },
    {
      filename: 'ignores.yml',
      code: $`
        jobs:
          analyze:
            name: CodeQL
      `,
      options: [{ ignores: ['^CodeQL$'] }],
    },
  ],
  invalid: [
    {
      filename: 'lowercase.yml',
      code: $`
        jobs:
          lint:
            name: lint code and docs
      `,
      output: $`
        jobs:
          lint:
            name: Lint Code And Docs
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 29,
              "endLine": 3,
              "fix": {
                "range": [
                  24,
                  42,
                ],
                "text": "Lint Code And Docs",
              },
              "line": 3,
              "message": "Job name 'lint code and docs' is not in Title Case.",
              "messageId": "jobNameNotMatch",
              "ruleId": "job-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'expression.yml',
      code: $`
        jobs:
          package:
            name: validate package on \${{ matrix.os }}
      `,
      output: $`
        jobs:
          package:
            name: Validate Package On \${{ matrix.os }}
      `,
      errors: [{ messageId: 'jobNameNotMatch' }],
    },
    {
      filename: 'minor-words.yml',
      code: $`
        jobs:
          lint:
            name: the lint of code and docs
      `,
      output: $`
        jobs:
          lint:
            name: The Lint of Code and Docs
      `,
      options: [{ 'Title Case': true, allowLowercaseMinorWords: true }],
      errors: [{ messageId: 'jobNameNotMatch' }],
    },
    {
      filename: 'multiple-jobs.yml',
      code: $`
        jobs:
          lint:
            name: Lint
          test:
            name: unit test
      `,
      output: $`
        jobs:
          lint:
            name: Lint
          test:
            name: Unit Test
      `,
      errors: [{ messageId: 'jobNameNotMatch', line: 5 }],
    },
    {
      filename: 'quoted.yml',
      code: $`
        jobs:
          test:
            name: 'it''s a test'
      `,
      output: $`
        jobs:
          test:
            name: 'It''s A Test'
      `,
      errors: [{ messageId: 'jobNameNotMatch' }],
    },
    {
      filename: 'anchored-name.yml',
      code: $`
        jobs:
          lint:
            name: &name unit test
          test:
            name: *name
      `,
      errors: [
        { messageId: 'jobNameNotMatch', line: 3 },
        { messageId: 'jobNameNotMatch', line: 5 },
      ],
      output: $`
        jobs:
          lint:
            name: &name Unit Test
          test:
            name: "Unit Test"
      `,
    },
    {
      filename: 'kebab-case.yml',
      code: $`
        jobs:
          test:
            name: Unit Test
      `,
      output: $`
        jobs:
          test:
            name: unit-test
      `,
      options: ['kebab-case'],
      errors: [{ messageId: 'jobNameNotMatch' }],
    },
    {
      filename: 'multiple-case-types.yml',
      code: $`
        jobs:
          test:
            name: invalid_name
      `,
      options: [{ 'kebab-case': true, camelCase: true }],
      errors(errors) {
        expect(errors).toHaveLength(1)
        expect(errors[0].fix).toBeUndefined()
      },
    },
  ],
})
