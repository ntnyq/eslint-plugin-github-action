import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-fail-fast'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/prefer-fail-fast'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'fail-fast-true.yml',
      code: $`
        jobs:
          test:
            runs-on: ubuntu-latest
            strategy:
              fail-fast: true
              matrix:
                version: [6, 7, 8]
      `,
    },
    {
      filename: 'fail-fast-expression.yml',
      code: $`
        jobs:
          test:
            runs-on: ubuntu-latest
            strategy:
              fail-fast: github.repository == 'ntnyq/eslint-plugin-github-action'
              matrix:
                version: [6, 7, 8]
      `,
    },
    {
      filename: 'fail-fast-false.yml',
      code: $`
        jobs:
          test:
            runs-on: ubuntu-latest
            strategy:
              fail-fast: [foobar]
      `,
    },
  ],
  invalid: [
    {
      filename: 'fail-fast-false.yml',
      code: $`
        jobs:
          test:
            runs-on: ubuntu-latest
            strategy:
              fail-fast: false
              matrix:
                version: [6, 7, 8]
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 23,
              "endLine": 5,
              "line": 5,
              "message": "Disallow setting fail-fast to false.",
              "messageId": "unexpected",
              "nodeType": "YAMLPair",
              "ruleId": "prefer-fail-fast",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
