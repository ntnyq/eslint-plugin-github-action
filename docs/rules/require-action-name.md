---
pageClass: rule-details
sidebarDepth: 0
title: github-action/require-action-name
description: Require action name to be set.
since: v0.0.0
---

# github-action/require-action-name

- 💼 This rule is enabled in the ✅ `recommended` config.

> Require action name to be set.

## :book: Rule Details

This rule reports when action has no name.

### Good

```yaml
name: CI

on:
  push:
    branches:
      - main
```

### Bad

### without `name`

```yaml
on:
  push:
    branches:
      - main
```

### empty `name`

```yaml
name:

on:
  push:
    branches:
      - main
```

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/require-action-name.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/require-action-name.test.ts)
