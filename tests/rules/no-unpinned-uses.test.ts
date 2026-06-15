import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-unpinned-uses'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/no-unpinned-uses'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'step-uses-pinned.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3
      `,
    },
    {
      filename: 'job-uses-pinned.yml',
      code: $`
        name: CI
        jobs:
          release:
            uses: owner/repo/.github/workflows/release.yml@8f4b7f84864484a7bf31766abe9204da3cbe65b3
      `,
    },
    {
      filename: 'local-and-docker.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: ./.github/actions/setup
              - uses: docker://alpine:3.20
      `,
    },
    {
      filename: 'non-scalar-uses.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: [actions/checkout@v4]
      `,
    },
  ],
  invalid: [
    {
      filename: 'step-uses-tag.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 34,
              "endLine": 6,
              "line": 6,
              "message": "Disallow unpinned uses reference; pin to a full commit SHA.",
              "messageId": "disallowUnpinnedUses",
              "ruleId": "no-unpinned-uses",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'step-uses-branch.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@main
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 36,
              "endLine": 6,
              "line": 6,
              "message": "Disallow unpinned uses reference; pin to a full commit SHA.",
              "messageId": "disallowUnpinnedUses",
              "ruleId": "no-unpinned-uses",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'step-uses-no-ref.yml',
      code: $`
        name: CI
        jobs:
          test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 31,
              "endLine": 6,
              "line": 6,
              "message": "Disallow unpinned uses reference; pin to a full commit SHA.",
              "messageId": "disallowUnpinnedUses",
              "ruleId": "no-unpinned-uses",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-uses-tag.yml',
      code: $`
        name: CI
        jobs:
          release:
            uses: owner/repo/.github/workflows/release.yml@v1
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 54,
              "endLine": 4,
              "line": 4,
              "message": "Disallow unpinned uses reference; pin to a full commit SHA.",
              "messageId": "disallowUnpinnedUses",
              "ruleId": "no-unpinned-uses",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
