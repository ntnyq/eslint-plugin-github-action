import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/max-jobs-per-action'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/max-jobs-per-action'

run<Options>({
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
    {
      filename: 'jobs-is-not-mapping.yml',
      code: $`
        name: CI
        jobs: helloWorld
      `,
    },
    {
      filename: 'limit-4-jobs.yml',
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
      options: [4],
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
              "column": 3,
              "endColumn": 34,
              "endLine": 18,
              "line": 3,
              "message": "There are 4 jobs, maximum allowed is 3.",
              "messageId": "toManyJobs",
              "ruleId": "max-jobs-per-action",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
