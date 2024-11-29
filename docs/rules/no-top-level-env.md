---
pageClass: rule-details
sidebarDepth: 0
title: github-action/no-top-level-env
description: Disallow using top level env.
since: v0.0.6
---

# github-action/no-top-level-env

> Disallow using top level env.

## :book: Rule Details

This rule reports when action has a top level `env` property.

::: correct

```yaml
name: CI

jobs:
  unit-test:
    runs-on: ubuntu-latest
    # Non top level env
    env:
      SERVER: production
```

:::

::: incorrect

```yaml eslint-check
name: CI

env:
  SERVER: production
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.6

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/no-top-level-env.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/no-top-level-env.test.ts)
