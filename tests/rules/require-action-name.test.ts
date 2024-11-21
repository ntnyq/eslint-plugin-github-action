import rule, { RULE_NAME } from '../../src/rules/require-action-name'
import { $, run } from '../internal'

run({
  name: RULE_NAME,
  rule,
  valid: [
    {
      filename: 'valid-name.yml',
      code: $`
        name: Release

        on:
          push:
            branches:
              - main
      `,
    },
  ],
  invalid: [
    {
      filename: 'no-name.yml',
      code: $`
        on:
          push:
            branches:
              - main
      `,
      errors: [
        {
          messageId: 'requireActionName',
        },
      ],
    },
    {
      filename: 'empty-name.yml',
      code: $`
        name:
        on:
          push:
            branches:
              - main
      `,
      errors: [
        {
          messageId: 'requireActionName',
        },
      ],
    },
  ],
})
