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

This rule reports when set `strategy.fail-fast` to false.

::: correct

```yaml
name: Release

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: true
      matrix:
        version: [6, 7, 8]
```

:::

::: correct

```yaml
name: Release

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: github.repository == 'ntnyq/eslint-plugin-github-action'
      matrix:
        version: [6, 7, 8]
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
        version: [6, 7, 8]
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.9

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/prefer-fail-fast.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/prefer-fail-fast.test.ts)
