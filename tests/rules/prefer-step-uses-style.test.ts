import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-step-uses-style'
import { $, run } from '../helpers/rule-tester'
import type { Options } from '../../src/rules/prefer-step-uses-style'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'allow-same-repository.yml',
      options: [{ release: true, allowRepository: true }],
      code: $`
        on: push
        jobs:
          build:
            runs-on: ubuntu-latest
            steps:
              - uses: ./.github/actions/setup
              - uses: $/.github/actions/setup
      `,
    },
    {
      filename: 'allow-same-repository-alias.yml',
      options: [{ commit: true, allowRepository: true }],
      code: $`
        jobs:
          build:
            steps:
              - uses: &setup $/.github/actions/setup
              - parallel:
                  - uses: *setup
      `,
    },
    {
      filename: 'parallel-release-alias.yml',
      code: $`
        jobs:
          test: &job
            steps:
              - parallel:
                  - uses: &checkout actions/checkout@v4
                  - uses: *checkout
      `,
    },
    {
      filename: 'no-jobs.yml',
      code: $`
        name: Release
      `,
    },
    {
      filename: 'no-steps.yml',
      code: $`
        name: Release
        jobs:
          test:
            uses: ./.github/workflows/ci.yml
      `,
    },
    {
      filename: 'no-step-uses.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - run: echo "Hello World"
      `,
    },
    {
      filename: 'invalid-step.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
             - helloWorld
      `,
    },
    {
      filename: 'release-style.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses: actions/checkout@v4
      `,
    },
    {
      filename: 'ignore.yml',
      options: [
        {
          ignores: ['actions/checkout@main'],
        },
      ],
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses: actions/checkout@main
      `,
    },
    {
      filename: 'allow-all-style.yml',
      options: [
        {
          branch: true,
          commit: true,
          release: true,
          allowDocker: true,
          allowRepository: true,
        },
      ],
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses: actions/checkout@v4
              - uses: actions/checkout@main
              - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3
              - uses: ./.github/actions/hello-world-action
              - uses: docker://alpine:3.8
      `,
    },
  ],
  invalid: [
    {
      filename: 'disallow-same-repository.yml',
      code: $`
        jobs:
          build:
            steps:
              - uses: $/.github/actions/setup
      `,
      errors: [{ messageId: 'disallowRepository', line: 4 }],
    },
    {
      filename: 'disallow-same-repository-with-branch-allowed.yml',
      options: [{ branch: true, allowRepository: false }],
      code: $`
        jobs:
          build:
            steps:
              - uses: &setup $/.github/actions/setup
              - parallel:
                  - uses: *setup
      `,
      errors: [
        { messageId: 'disallowRepository', line: 4 },
        { messageId: 'disallowRepository', line: 6 },
      ],
    },
    {
      filename: 'parallel-branch-alias.yml',
      code: $`
        jobs:
          test: &job
            steps:
              - parallel:
                  - uses: &checkout actions/checkout@main
                  - uses: *checkout
      `,
      errors: [{ messageId: 'disallowStyle' }, { messageId: 'disallowStyle' }],
    },
    {
      filename: 'empty-step-uses.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses:
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 14,
              "endLine": 5,
              "line": 5,
              "message": "Invalid style for job step uses.",
              "messageId": "invalidStyle",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'invalid-step-uses.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses: [helloWorld]
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 27,
              "endLine": 5,
              "line": 5,
              "message": "Invalid style for job step uses.",
              "messageId": "invalidStyle",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'not-release-style.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses: actions/checkout
              - uses: actions/checkout@main
              - uses: actions/checkout@xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 31,
              "endLine": 5,
              "line": 5,
              "message": "Disallow style \`branch\` for job step uses.",
              "messageId": "disallowStyle",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
            {
              "column": 15,
              "endColumn": 36,
              "endLine": 6,
              "line": 6,
              "message": "Disallow style \`branch\` for job step uses.",
              "messageId": "disallowStyle",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
            {
              "column": 15,
              "endColumn": 72,
              "endLine": 7,
              "line": 7,
              "message": "Disallow style \`branch\` for job step uses.",
              "messageId": "disallowStyle",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
            {
              "column": 15,
              "endColumn": 72,
              "endLine": 8,
              "line": 8,
              "message": "Disallow style \`commit\` for job step uses.",
              "messageId": "disallowStyle",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'repository-or-docker.yml',
      code: $`
        name: Release
        jobs:
          test:
            steps:
              - uses: ./.github/actions/hello-world-action
              - uses: docker://alpine:3.8
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 51,
              "endLine": 5,
              "line": 5,
              "message": "Disallow using same repository action.",
              "messageId": "disallowRepository",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
            {
              "column": 15,
              "endColumn": 34,
              "endLine": 6,
              "line": 6,
              "message": "Disallow using docker action.",
              "messageId": "disallowDocker",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
