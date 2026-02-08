---
pageClass: rule-details
sidebarDepth: 0
title: github-action/max-jobs-per-action
description: Enforce maximum jobs per workflow file.
since: v0.0.2
---

# github-action/max-jobs-per-action

> Enforce maximum jobs per workflow file.

## :book: Rule Details

This rule reports when the number of jobs in a workflow exceeds the limit.

::: correct

```yaml
name: CI

jobs:
  checkout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

:::

::: incorrect

```yaml
name: CI

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job2:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job3:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job4:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

:::

## :wrench: Options

Default limit is set to `3`.

```ts
type MaxJobsPerActionOptions = ['error' | 'warn' | 'off' | 2 | 1 | 0, number]
```

### `3` (default)

Examples of **correct** code for this rule with default option:

::: correct

```yaml
name: CI

jobs:
  checkout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

:::

Examples of **incorrect** code for this rule with default option:

::: incorrect

```yaml
name: CI

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job2:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job3:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job4:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

:::

### `1`

Examples of **correct** code for this rule with `1` option:

::: correct

```yaml
name: CI

jobs:
  checkout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

:::

Examples of **incorrect** code for this rule with `1` option:

::: incorrect

```yaml
name: CI

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  job2:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.2

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/max-jobs-per-action.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/max-jobs-per-action.test.ts)
