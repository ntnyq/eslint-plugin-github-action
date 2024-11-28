---
pageClass: rule-details
sidebarDepth: 0
title: github-action/require-job-step-name
description: Require job step name to be set.
since: v0.0.6
---

# github-action/require-job-step-name

> Require job step name to be set.

## :book: Rule Details

This rule reports when action job steps has no name.

::: correct

```yaml
name: Release

jobs:
  test:
    name: Test
    steps:
      - name: Lint
      - name: Typecheck
```

:::

::: incorrect

```yaml
# job step has no name
name: Release

jobs:
  test:
    name: Test
    steps:
      - run: echo hello world
```

:::

::: incorrect

```yaml
# job step name is empty
name: Release

jobs:
  test:
    name: Test
    steps:
      - name:
        run: echo hello world
```

:::

::: incorrect

```yaml
# job step name not a string
name: Release

jobs:
  test:
    name: Test
    steps:
      - name:
          - Test
```

:::

::: incorrect

```yaml
# one or more job step has no name
name: Release

jobs:
  test:
    name: Test
    steps:
      - name: Lint
        run: echo hello world
      - run: echo hello world
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.6

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/require-job-step-name.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/require-job-step-name.test.ts)
