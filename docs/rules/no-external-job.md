---
pageClass: rule-details
sidebarDepth: 0
title: github-action/no-external-job
description: Disallow using external jobs.
since: v0.0.7
---

# github-action/no-external-job

> Disallow using external jobs.

## :book: Rule Details

This rule reports when a job uses an external workflow via `uses`.

::: correct

```yaml
name: Release

jobs:
  test:
    name: Test
```

:::

::: incorrect

```yaml
name: Release

jobs:
  test:
    uses: ./.github/workflows/ci.yml
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.7

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/no-external-job.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/no-external-job.test.ts)
