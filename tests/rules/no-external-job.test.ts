import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-external-job'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'without-external-job.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            name: Test
      `,
    },
    {
      filename: 'no-jobs.yml',
      code: $`
        name: Release
        
        jobs:
      `,
    },
  ],
  invalid: [
    {
      filename: 'external-job.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            uses: ./.github/workflows/ci.yml
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 37,
              "endLine": 5,
              "line": 5,
              "message": "Disallow using external job.",
              "messageId": "disallowExternalJob",
              "nodeType": "YAMLPair",
              "ruleId": "no-external-job",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
