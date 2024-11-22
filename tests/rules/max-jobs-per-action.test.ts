import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/max-jobs-per-action'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-job.yml',
      code: $`
        name: Unit Test
      `,
    },
    {
      filename: '1-job.yml',
      code: $`
        name: CI
        
        jobs:
          checkout:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
  ],
  invalid: [
    {
      filename: '4-jobs.yml',
      code: $`
        name: CI
        
        jobs:
          job1:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
          job2:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
          job3:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
          job4:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 34,
              "endLine": 19,
              "line": 1,
              "message": "There are 4 jobs, maximum allowed is 3.",
              "messageId": "toManyJobs",
              "nodeType": "YAMLMapping",
              "ruleId": "max-jobs-per-action",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
