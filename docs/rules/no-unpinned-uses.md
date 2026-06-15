---
pageClass: rule-details
sidebarDepth: 0
title: github-action/no-unpinned-uses
description: Disallow unpinned uses references.
since: v0.3.0
---

# github-action/no-unpinned-uses

> Disallow unpinned uses references.

## :book: Rule Details

This rule reports `uses` references that are not pinned to a full 40-character commit SHA.

The rule checks both reusable workflow `jobs.<job_id>.uses` and step-level `jobs.<job_id>.steps[*].uses`.

Local actions (`./`) and Docker actions (`docker://`) are ignored.

::: correct

```yaml
name: CI

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@8f4b7f84864484a7bf31766abe9204da3cbe65b3
```

:::

::: incorrect

```yaml
name: CI

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
name: CI

jobs:
  release:
    uses: owner/repo/.github/workflows/release.yml@main
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.3.0

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/no-unpinned-uses.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/no-unpinned-uses.test.ts)
