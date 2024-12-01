---
pageClass: rule-details
sidebarDepth: 0
title: github-action/no-invalid-key
description: Disallow using invalid key.
since: v0.0.8
---

# github-action/no-invalid-key

> Disallow using invalid key.

## :book: Rule Details

This rule reports when action file uses invalid keys.

::: correct

```yaml
name: CI

run-name: CI

on: push

permissions:
  contents: read
  pull-requests: write

env:
  SERVER: production

defaults:
  run:
    shell: bash

concurrency:
  group: example
  cancel-in-progress: true

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run tests
        run: npm test
```

:::

::: incorrect

```yaml
workflow: CI

dispatch: inputs

push: branch

needs:
  contents: read

if:
  SERVER: production

matrix: [20.x, 22.x]
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.8

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/no-invalid-key.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/no-invalid-key.test.ts)
