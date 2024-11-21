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
      errors: [
        {
          messageId: 'toManyJobs',
          data: {
            count: 4,
            limit: 3,
          },
        },
      ],
    },
  ],
})
