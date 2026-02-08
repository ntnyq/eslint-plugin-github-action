---
pageClass: rule-details
sidebarDepth: 0
title: github-action/prefer-step-uses-style
description: Enforce the style of job step `uses`.
since: v0.0.7
---

# github-action/prefer-step-uses-style

> Enforce the style of job step `uses`.

## :book: Rule Details

This rule enforces a consistent style for job step `uses`.

::: correct

```yaml
name: Release

jobs:
  test:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4.2.0
```

:::

::: incorrect

```yaml
name: Release

jobs:
  test:
    steps:
      - uses: actions/checkout@main
      - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3
```

:::

## :wrench: Options

Default style is set to `release`.

```ts
type AllowedStyle = 'release' | 'commit' | 'branch'

type JobIdCasingOptions = [
  'error' | 'warn' | 'off' | 2 | 1 | 0,
  (
    | AllowedStyle
    | ({
        [key in AllowedStyle]?: boolean
      } & {
        ignores?: string[]
        /**
         * @default false
         */
        allowRepository?: boolean
        /**
         * @default false
         */
        allowDocker?: boolean
      })
  ),
]
```

### `"release"` (default)

Examples of **correct** code for this rule with default option:

::: correct

```yaml
name: Release

jobs:
  test:
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4.2.0
```

:::

Examples of **incorrect** code for this rule with default option:

::: incorrect

```yaml
name: Release

jobs:
  test:
    steps:
      # `branch` style
      - uses: actions/checkout@main

      # `commit` style
      - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3

      # same repository
      - uses: ./.github/actions/hello-world-action

      # docker action
      - uses: docker://alpine:3.8
```

:::

### Custom options

```json
{
  "commit": true,
  "allowDocker": true,
  "ignores": ["actions/checkout@main"]
}
```

Examples of **correct** code for custom option above:

::: correct

```yaml
name: Release

jobs:
  test:
    steps:
      # ignored
      - uses: actions/checkout@main

      # `commit` style
      - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3

      # docker action
      - uses: docker://alpine:3.8
```

:::

Examples of **incorrect** code for custom option above:

::: incorrect

```yaml
name: Release

jobs:
  test:
    steps:
      # `release` style
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4.2.0

      # same repository
      - uses: ./.github/actions/hello-world-action
```

:::

## :books: Further reading

### docker

When `uses` starts with `docker://`, it is considered a docker action.

### repository

When `uses` starts with `./`, it is considered a same-repository action.

### commit

When `uses` has 40 characters after `@`, it is considered a commit style action.

### release

When `uses` starts with `v` after `@`, it is considered a release style action.

### branch

Fallback style when none match above.

### Reference

- [GitHub action - jobs.<job_id>.steps[\*].uses](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsuses)

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.7

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/prefer-step-uses-style.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/prefer-step-uses-style.test.ts)
