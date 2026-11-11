---
pageClass: rule-details
sidebarDepth: 0
title: github-action/valid-timeout-minutes
description: Disallow invalid timeout-minutes.
since: v0.0.16
---

# github-action/valid-timeout-minutes

> Disallow invalid timeout-minutes.

- 💼 This rule is enabled in the ✅ `recommended` config.

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

The default option is `360`, allowing positive integers from `1` to `360` for both jobs and steps.

A number sets the maximum for both jobs and steps. A `{ min, max }` object sets a shared range. Use `job` and `step` to configure their limits separately, for example:

```json
{
  "github-action/valid-timeout-minutes": ["error", { "job": 60, "step": 15 }]
}
```

Custom bounds must be integers from `1` to `1440`. With an object option, omitted minimums default to `1` and omitted maximums default to `1440`.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.16

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/valid-timeout-minutes.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/valid-timeout-minutes.test.ts)
