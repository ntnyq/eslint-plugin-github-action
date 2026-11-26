import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/step-name-casing'
import { $, run } from '../helpers/rule-tester'
import type { Options } from '../../src/rules/step-name-casing'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'no-step-name.yml',
      code: $`
        jobs:
          test:
            steps:
              - run: npm test
      `,
    },
    {
      filename: 'title-case.yml',
      code: $`
        name: lowercase workflow names are not checked
        jobs:
          test:
            name: lowercase job names are not checked
            steps:
              - name: Check Out Source
                uses: actions/checkout@v7
      `,
    },
    {
      filename: 'code-span.yml',
      code: $`
        jobs:
          test:
            steps:
              - name: Run \`npm test\` On \${{ matrix.os }}
                run: npm test
      `,
    },
    {
      filename: 'single-expression.yml',
      code: $`
        jobs:
          test:
            steps:
              - name: \${{ matrix.step-name }}
                run: echo
      `,
    },
    {
      filename: 'minor-words.yml',
      code: $`
        jobs:
          test:
            steps:
              - name: Set Up Node with Caching
                uses: actions/setup-node@v7
      `,
      options: [{ 'Title Case': true, allowLowercaseMinorWords: true }],
    },
  ],
  invalid: [
    {
      filename: 'lowercase.yml',
      code: $`
        jobs:
          test:
            steps:
              - name: check out source
                uses: actions/checkout@v7
      `,
      output: $`
        jobs:
          test:
            steps:
              - name: Check Out Source
                uses: actions/checkout@v7
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 15,
              "endColumn": 31,
              "endLine": 4,
              "fix": {
                "range": [
                  39,
                  55,
                ],
                "text": "Check Out Source",
              },
              "line": 4,
              "message": "Job step name 'check out source' is not in Title Case.",
              "messageId": "stepNameNotMatch",
              "ruleId": "step-name-casing",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'code-span.yml',
      code: $`
        jobs:
          test:
            steps:
              - name: run \`npm test\`
                run: npm test
      `,
      output: $`
        jobs:
          test:
            steps:
              - name: Run \`npm test\`
                run: npm test
      `,
      errors: [{ messageId: 'stepNameNotMatch' }],
    },
    {
      filename: 'parallel-steps.yml',
      code: $`
        jobs:
          test:
            steps:
              - parallel:
                  - name: lint
                    run: npm run lint
                  - name: Test
                    run: npm test
      `,
      output: $`
        jobs:
          test:
            steps:
              - parallel:
                  - name: Lint
                    run: npm run lint
                  - name: Test
                    run: npm test
      `,
      errors: [{ messageId: 'stepNameNotMatch', line: 5 }],
    },
    {
      filename: 'snake-case.yml',
      code: $`
        jobs:
          test:
            steps:
              - name: Check Out Source
                uses: actions/checkout@v7
      `,
      output: $`
        jobs:
          test:
            steps:
              - name: check_out_source
                uses: actions/checkout@v7
      `,
      options: ['snake_case'],
      errors: [{ messageId: 'stepNameNotMatch' }],
    },
  ],
})
