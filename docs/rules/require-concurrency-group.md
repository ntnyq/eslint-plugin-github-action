---
pageClass: rule-details
sidebarDepth: 0
title: github-action/require-concurrency-group
description: Require a workflow-level concurrency group.
since: v0.3.0
---

# github-action/require-concurrency-group

> Require a workflow-level concurrency group.

## :book: Rule Details

This rule reports when workflow-level `concurrency` is missing, or when `concurrency` does not provide a non-empty group value.

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

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm test
```

```yaml
name: CI

concurrency:
  cancel-in-progress: true
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.3.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/require-concurrency-group.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/require-concurrency-group.test.ts)
