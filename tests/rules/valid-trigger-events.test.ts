import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/valid-trigger-events'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/valid-trigger-events'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'empty.yml',
      code: '',
    },
    {
      filename: 'empty-on.yml',
      code: $`
        on: {}
      `,
    },
    {
      filename: 'valid.yml',
      code: $`
        on:
          push:
            - main
      `,
    },
    {
      filename: 'scalar.yml',
      code: 'on: push',
    },
    {
      filename: 'sequence.yml',
      code: 'on: [push, pull_request, issue_comment]',
    },
  ],
  invalid: [
    {
      filename: 'invalid-scalar.yml',
      code: 'on: foo_bar',
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 5,
              "endColumn": 12,
              "endLine": 1,
              "line": 1,
              "message": "Disallow invalid trigger events foo_bar.",
              "messageId": "invalidEvent",
              "ruleId": "valid-trigger-events",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'invalid-sequence.yml',
      code: 'on: [push, foo_bar, pull_request_comment, 2]',
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 12,
              "endColumn": 19,
              "endLine": 1,
              "line": 1,
              "message": "Disallow invalid trigger events foo_bar.",
              "messageId": "invalidEvent",
              "ruleId": "valid-trigger-events",
              "severity": 2,
            },
            {
              "column": 21,
              "endColumn": 41,
              "endLine": 1,
              "line": 1,
              "message": "Disallow invalid trigger events pull_request_comment.",
              "messageId": "invalidEvent",
              "ruleId": "valid-trigger-events",
              "severity": 2,
            },
            {
              "column": 43,
              "endColumn": 44,
              "endLine": 1,
              "line": 1,
              "message": "Disallow invalid on.event_name",
              "messageId": "invalidPair",
              "ruleId": "valid-trigger-events",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'invalid.yml',
      code: $`
        name: CI
        on:
          foo_bar:
            - main
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "name: CI
          on:
            "
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 11,
              "endLine": 4,
              "fix": {
                "range": [
                  15,
                  34,
                ],
                "text": "",
              },
              "line": 3,
              "message": "Disallow invalid trigger events foo_bar.",
              "messageId": "invalidEvent",
              "ruleId": "valid-trigger-events",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'not-scaler.yml',
      code: $`
        name: CI
        on:
          2: 3
      `,
      output(output) {
        expect(output).toMatchInlineSnapshot(`
          "name: CI
          on:
            "
        `)
      },
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 3,
              "endColumn": 7,
              "endLine": 3,
              "fix": {
                "range": [
                  15,
                  19,
                ],
                "text": "",
              },
              "line": 3,
              "message": "Disallow invalid on.event_name",
              "messageId": "invalidPair",
              "ruleId": "valid-trigger-events",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
