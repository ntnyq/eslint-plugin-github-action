import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-external-job'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-external-job'

run<Options>({
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
              "endLine": 4,
              "line": 4,
              "message": "Disallow using external job.",
              "messageId": "disallowExternalJob",
              "ruleId": "no-external-job",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
