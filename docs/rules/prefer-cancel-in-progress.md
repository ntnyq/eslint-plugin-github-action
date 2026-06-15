---
pageClass: rule-details
sidebarDepth: 0
title: github-action/prefer-cancel-in-progress
description: Prefer setting concurrency cancel-in-progress to true.
since: v0.3.0
---

# github-action/prefer-cancel-in-progress

> Prefer setting concurrency cancel-in-progress to true.

## :book: Rule Details

This rule reports when a `concurrency` block does not set `cancel-in-progress: true`.

The rule checks both workflow-level and job-level `concurrency`.

::: correct

```yaml
name: CI

concurrency:
  group: ci-main
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test
```

:::

::: incorrect

```yaml
name: CI

concurrency:
  group: ci-main
```

```yaml
name: CI

jobs:
  test:
    runs-on: ubuntu-latest
    concurrency:
      group: test-main
      cancel-in-progress: false
    steps:
      - run: pnpm test
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.3.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/prefer-cancel-in-progress.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/prefer-cancel-in-progress.test.ts)
