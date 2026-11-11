---
pageClass: rule-details
sidebarDepth: 0
title: github-action/prefer-fail-fast
description: Disallow setting fail-fast to false.
since: v0.0.9
---

# github-action/prefer-fail-fast

> Disallow setting fail-fast to false.

## :book: Rule Details

This rule reports when `strategy.fail-fast` is set to false.

::: correct

```yaml
name: Release

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        node-version: [22, 24, 26]
```

:::

::: correct

```yaml
name: Release

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      # fail-fast defaults to true when omitted
      matrix:
        node-version: [22, 24, 26]
```

:::

::: incorrect

```yaml
name: Release

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node-version: [22, 24, 26]
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.9

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/prefer-fail-fast.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/prefer-fail-fast.test.ts)
