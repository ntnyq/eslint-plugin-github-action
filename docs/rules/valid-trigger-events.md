---
pageClass: rule-details
sidebarDepth: 0
title: github-action/valid-trigger-events
description: Disallow invalid trigger events.
since: v0.0.16
---

# github-action/valid-trigger-events

> Disallow invalid trigger events.

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/latest/use/command-line-interface#--fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule reports when a workflow has an invalid `on.<event_name>`.

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

```yaml eslint-check
name: CI

on:
  foo_bar:
    branches:
      - main
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.16

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/valid-trigger-events.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/valid-trigger-events.test.ts)
