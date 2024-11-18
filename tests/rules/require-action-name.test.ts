import rule, { RULE_NAME } from '../../src/rules/require-action-name'
import { $, run } from '../internal'

const validCases = [
  $`
    name: Release

    on:
      push:
        branches:
          - main

    jobs:
      release:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
  `,
]
const invalidCases = [
  [
    $`
      on:
        push:
          branches:
            - main
      jobs:
        release:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4
    `,
  ],
]

run({
  name: RULE_NAME,
  rule,
  valid: validCases,
  invalid: invalidCases.map(i => ({
    code: i[0],
    output: i[1],
    errors: [
      {
        messageId: 'requireActionName',
      },
    ],
  })),
})
