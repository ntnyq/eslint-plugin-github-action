import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/job-id-casing'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/job-id-casing'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-jobs.yml',
      code: $`
        name: CI
      `,
    },
    {
      filename: 'single-word.yml',
      code: $`
        jobs:
          checkout:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
    {
      filename: 'kebab-case-job.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
    {
      filename: 'kebab-case-multi-job.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
          test-coverage:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
    },
    {
      filename: 'snake-case.yml',
      code: $`
        jobs:
          unit_test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      options: ['snake_case'],
    },
    {
      filename: 'empty-object-options.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      options: [{}],
    },
    {
      filename: 'multi-case.yml',
      code: $`
        jobs:
          unitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
          UnitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      options: [
        {
          camelCase: true,
          PascalCase: true,
        },
      ],
    },
    {
      filename: 'empty-object-options.yml',
      code: $`
        jobs:
          unit-test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      options: [{}],
    },
    {
      filename: 'options-ignores.yml',
      code: $`
        jobs:
          UnitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      options: [
        {
          ignores: ['UnitTest'],
        },
      ],
    },
  ],
  invalid: [
    {
      filename: 'camel-case.yml',
      code: $`
        jobs:
          unitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 11,
              "endLine": 2,
              "line": 2,
              "message": "Job id 'unitTest' is not in kebab-case.",
              "messageId": "jobIdNotMatch",
              "ruleId": "job-id-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'snake-case.yml',
      code: $`
        jobs:
          unit_test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 12,
              "endLine": 2,
              "line": 2,
              "message": "Job id 'unit_test' is not in kebab-case.",
              "messageId": "jobIdNotMatch",
              "ruleId": "job-id-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'pascal-case.yml',
      code: $`
        jobs:
          UnitTest:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 11,
              "endLine": 2,
              "line": 2,
              "message": "Job id 'UnitTest' is not in kebab-case.",
              "messageId": "jobIdNotMatch",
              "ruleId": "job-id-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'train-case.yml',
      code: $`
        jobs:
          Unit-Test:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 12,
              "endLine": 2,
              "line": 2,
              "message": "Job id 'Unit-Test' is not in kebab-case.",
              "messageId": "jobIdNotMatch",
              "ruleId": "job-id-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'screaming-snake-case.yml',
      code: $`
        jobs:
          UNIT_TEST:
            runs-on: ubuntu-latest
            steps:
              - uses: actions/checkout@v4
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 12,
              "endLine": 2,
              "line": 2,
              "message": "Job id 'UNIT_TEST' is not in kebab-case.",
              "messageId": "jobIdNotMatch",
              "ruleId": "job-id-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
