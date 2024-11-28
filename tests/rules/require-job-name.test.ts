import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/require-job-name'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-jobs.yml',
      code: $`
        name: Release
        
        jobs:
      `,
    },
    {
      filename: 'all-jobs-have-name.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            name: Test
        
          lint:
            name: Lint
      `,
    },
  ],
  invalid: [
    {
      filename: 'job-name-not-mapping.yml',
      code: $`
        name: Release
        
        jobs:
          test: helloWorld
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 19,
              "endLine": 4,
              "line": 4,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-has-no-name.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            runs-on: ubuntu-latest
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 27,
              "endLine": 5,
              "line": 4,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-name-is-empty.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            name:
            runs-on: ubuntu-latest
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 10,
              "endLine": 5,
              "line": 5,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": null,
              "ruleId": "require-job-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'job-name-is-not-a-string.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            name:
              - Test
            runs-on: ubuntu-latest
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 13,
              "endLine": 6,
              "line": 5,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": "YAMLSequence",
              "ruleId": "require-job-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'one-job-no-name.yml',
      code: $`
        name: Release
        
        jobs:
          test:
            name: Test
        
          lint:
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 8,
              "endLine": 7,
              "line": 7,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'every-job-no-name.yml',
      code: $`
        name: Release
        
        jobs:
          test:
        
          lint:
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 8,
              "endLine": 4,
              "line": 4,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-name",
              "severity": 2,
            },
            {
              "column": 3,
              "endColumn": 8,
              "endLine": 6,
              "line": 6,
              "message": "Require job name to be set.",
              "messageId": "requireJobName",
              "nodeType": "YAMLMapping",
              "ruleId": "require-job-name",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
