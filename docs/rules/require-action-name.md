---
pageClass: rule-details
sidebarDepth: 0
title: github-action/require-action-name
description: Require a string action name.
since: v0.0.0
---

# github-action/require-action-name

> Require a string action name.

- 💼 This rule is enabled in the ✅ `recommended` config.

## :book: Rule Details

This rule reports when action has no name or not a string.

::: correct

```yaml
name: CI

on:
  push:
    branches:
      - main
```

:::

::: incorrect

```yaml
# empty file
```

:::

::: incorrect

```yaml
# no name
on:
  push:
    branches:
      - main
```

:::

::: incorrect

```yaml
# name is empty
name:

on:
  push:
    branches:
      - main
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/require-action-name.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/require-action-name.test.ts)
