import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/no-invalid-key'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid-top-keys.yml',
      code: $`
        name: CI
        
        run-name: CI
        
        on: push
        
        permissions:
          contents: read
          pull-requests: write
        
        env:
          SERVER: production
        
        defaults:
          run:
            shell: bash
        
        concurrency:
          group: example
          cancel-in-progress: true
        
        jobs:
          test:
            name: Test
            runs-on: ubuntu-latest
            steps:
              - name: Checkout
                uses: actions/checkout@v4
              - name: Run tests
                run: npm test
      `,
    },
  ],
  invalid: [
    {
      filename: 'invalid-top-keys.yml',
      code: $`
        workflow: CI
        
        dispatch: inputs
        
        push: branch
        
        needs:
          contents: read
        
        if:
          SERVER: production
        
        matrix: [20.x, 22.x]
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 9,
              "endLine": 1,
              "line": 1,
              "message": "invalid top-level key \`workflow\`.",
              "messageId": "invalidTopLevel",
              "nodeType": "YAMLMapping",
              "ruleId": "no-invalid-key",
              "severity": 2,
            },
            {
              "column": 1,
              "endColumn": 9,
              "endLine": 3,
              "line": 3,
              "message": "invalid top-level key \`dispatch\`.",
              "messageId": "invalidTopLevel",
              "nodeType": "YAMLMapping",
              "ruleId": "no-invalid-key",
              "severity": 2,
            },
            {
              "column": 1,
              "endColumn": 5,
              "endLine": 5,
              "line": 5,
              "message": "invalid top-level key \`push\`.",
              "messageId": "invalidTopLevel",
              "nodeType": "YAMLMapping",
              "ruleId": "no-invalid-key",
              "severity": 2,
            },
            {
              "column": 1,
              "endColumn": 6,
              "endLine": 7,
              "line": 7,
              "message": "invalid top-level key \`needs\`.",
              "messageId": "invalidTopLevel",
              "nodeType": "YAMLMapping",
              "ruleId": "no-invalid-key",
              "severity": 2,
            },
            {
              "column": 1,
              "endColumn": 3,
              "endLine": 10,
              "line": 10,
              "message": "invalid top-level key \`if\`.",
              "messageId": "invalidTopLevel",
              "nodeType": "YAMLMapping",
              "ruleId": "no-invalid-key",
              "severity": 2,
            },
            {
              "column": 1,
              "endColumn": 7,
              "endLine": 13,
              "line": 13,
              "message": "invalid top-level key \`matrix\`.",
              "messageId": "invalidTopLevel",
              "nodeType": "YAMLMapping",
              "ruleId": "no-invalid-key",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
