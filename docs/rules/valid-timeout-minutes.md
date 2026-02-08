---
pageClass: rule-details
sidebarDepth: 0
title: github-action/valid-timeout-minutes
description: Disallow invalid timeout-minutes.
since: v0.0.16
---

# github-action/valid-timeout-minutes

> Disallow invalid timeout-minutes.

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/latest/use/command-line-interface#--fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports when jobs or steps have invalid `timeout-minutes`.

::: correct

```yaml
jobs:
  unit-test:
    steps:
      - timeout-minutes: 20
```

:::

::: incorrect

```yaml eslint-check
jobs:
  unit-test:
    timeout-minutes: 0
```

```yaml eslint-check
jobs:
  unit-test:
    timeout-minutes: -2
```

```yaml eslint-check
jobs:
  unit-test:
    timeout-minutes: 2.3
```

```yaml eslint-check
jobs:
  unit-test:
    steps:
      - timeout-minutes: 0
```

:::

## :wrench: Options

```ts
type TimeoutMinutesRange = {
  min?: number
  max?: number
}

type ValidTimeoutMinutesOptions = [
  | number
  | TimeoutMinutesRange
  | {
      job?: number | TimeoutMinutesRange
      step?: number | TimeoutMinutesRange
    },
]
```

Default option is set to `{ min: 1, max: 360 }`.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.16

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/valid-timeout-minutes.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/valid-timeout-minutes.test.ts)
