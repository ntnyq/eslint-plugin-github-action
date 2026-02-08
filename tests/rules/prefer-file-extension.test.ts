import { expect } from 'vitest'
import rule, { RULE_NAME } from '../../src/rules/prefer-file-extension'
import { $, run } from '../internal'
import type { Options } from '../../src/rules/prefer-file-extension'

run<Options>({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'yml.yml',
      code: $`
        name: Release
      `,
    },
    {
      filename: 'NO_FILE_EXTENSION',
      code: $`
        name: Release
      `,
    },
    {
      filename: 'yml.YML',
      options: [
        {
          caseSensitive: false,
        },
      ],
      code: $`
        name: Release
      `,
    },
    {
      filename: 'yaml.yaml',
      options: [
        {
          extension: 'yaml',
        },
      ],
      code: $`
        name: Release
      `,
    },
  ],
  invalid: [
    {
      filename: 'yaml.yaml',
      code: $`
        name: Release
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 14,
              "endLine": 1,
              "line": 1,
              "message": "Expected extension \`yml\`, but got \`yaml\`.",
              "messageId": "unexpected",
              "ruleId": "prefer-file-extension",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'yml.yml',
      options: ['yaml'],
      code: $`
        name: Release
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 14,
              "endLine": 1,
              "line": 1,
              "message": "Expected extension \`yaml\`, but got \`yml\`.",
              "messageId": "unexpected",
              "ruleId": "prefer-file-extension",
              "severity": 2,
            },
          ]
        `)
      },
    },
    {
      filename: 'yaml.YAML',
      options: [
        {
          caseSensitive: false,
        },
      ],
      code: $`
        name: Release
      `,
      errors(errors) {
        expect(errors).toMatchInlineSnapshot(`
          [
            {
              "column": 1,
              "endColumn": 14,
              "endLine": 1,
              "line": 1,
              "message": "Expected extension \`yml\`, but got \`YAML\`.",
              "messageId": "unexpected",
              "ruleId": "prefer-file-extension",
              "severity": 2,
            },
          ]
        `)
      },
    },
  ],
})
