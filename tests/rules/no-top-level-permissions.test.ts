import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-top-level-permissions'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-permissions.yml',
      code: $`
        name: Release
      `,
    },
    {
      filename: 'empty.yml',
      code: '',
    },
    {
      filename: 'non-top-level-permissions.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            permissions:
              id-token: write
              contents: write
      `,
    },
  ],
  invalid: [
    {
      filename: 'top-level-permissions.yml',
      code: $`
        permissions:
          id-token: write
          contents: write
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 18,
              "endLine": 3,
              "line": 1,
              "message": "Disallow using top level permissions.",
              "messageId": "disallowTopLevelPermissions",
              "nodeType": "YAMLMapping",
              "ruleId": "no-top-level-permissions",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
