import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-top-level-env'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'empty.yml',
      code: '',
    },
    {
      filename: 'no-env.yml',
      code: $`
        name: Release
      `,
    },
    {
      filename: 'non-top-level-env.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            env:
              SERVER: production
      `,
    },
  ],
  invalid: [
    {
      filename: 'top-level-env.yml',
      code: $`
        name: Release
        
        env:
          SERVER: production
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 21,
              "endLine": 4,
              "line": 3,
              "message": "Disallow using top level env.",
              "messageId": "disallowTopLevelEnv",
              "nodeType": "YAMLMapping",
              "ruleId": "no-top-level-env",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
