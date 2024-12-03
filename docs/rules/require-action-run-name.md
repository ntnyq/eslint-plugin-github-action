---
pageClass: rule-details
sidebarDepth: 0
title: github-action/require-action-run-name
description: Require action name to be set.
since: v0.0.9
---

# github-action/require-action-run-name

> Require action run-name to be set.

## :book: Rule Details

This rule reports when action has no run-name.

::: correct

```yaml
run-name: Cut a release
```

:::

::: incorrect

```yaml
# empty file
```

:::

::: incorrect

```yaml
# no run-name
name: Release
```

:::

::: incorrect

```yaml
# run-name is empty
run-name:
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.9

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/require-action-run-name.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/require-action-run-name.test.ts)
