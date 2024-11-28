---
pageClass: rule-details
sidebarDepth: 0
title: github-action/no-top-level-permissions
description: Disallow using top level permissions.
since: v0.0.4
---

# github-action/no-top-level-permissions

> Disallow using top level permissions.

## :book: Rule Details

This rule reports when action has a top level `permissions` property.

::: correct

```yaml
name: CI

jobs:
  unit-test:
    runs-on: ubuntu-latest
    # No top level permissions
    permissions:
      id-token: write
      contents: write
```

:::

::: incorrect

```yaml
name: CI

permissions:
  id-token: write
  contents: write
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.4

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/no-top-level-permissions.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/no-top-level-permissions.test.ts)
