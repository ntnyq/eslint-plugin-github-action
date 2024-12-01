import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-step-uses-style'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
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
      options: {
        ignores: ['actions/checkout@main'],
      },
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
              "column": 9,
              "endColumn": 27,
              "endLine": 6,
              "line": 6,
              "message": "Invalid style for job step uses.",
              "messageId": "invalidStyle",
              "nodeType": "YAMLPair",
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
              - uses: actions/checkout@main
              - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 9,
              "endColumn": 36,
              "endLine": 6,
              "line": 6,
              "message": "Disallow style \`branch\` for job step uses.",
              "messageId": "disallowStyle",
              "nodeType": "YAMLPair",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
            {
              "column": 9,
              "endColumn": 72,
              "endLine": 7,
              "line": 7,
              "message": "Disallow style \`commit\` for job step uses.",
              "messageId": "disallowStyle",
              "nodeType": "YAMLPair",
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
              "column": 9,
              "endColumn": 51,
              "endLine": 6,
              "line": 6,
              "message": "Disallow using same repository action.",
              "messageId": "disallowRepository",
              "nodeType": "YAMLPair",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
            {
              "column": 9,
              "endColumn": 34,
              "endLine": 7,
              "line": 7,
              "message": "Disallow using docker action.",
              "messageId": "disallowDocker",
              "nodeType": "YAMLPair",
              "ruleId": "prefer-step-uses-style",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
