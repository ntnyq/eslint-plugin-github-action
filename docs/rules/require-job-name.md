---
pageClass: rule-details
sidebarDepth: 0
title: github-action/require-job-name
description: Require a string job name.
since: v0.0.6
---

# github-action/require-job-name

> Require a string job name.

## :book: Rule Details

This rule reports when action jobs has no name or not a string.

::: correct

```yaml
name: Release

jobs:
  test:
    name: Test

  lint:
    name: Lint
```

:::

::: incorrect

```yaml
# not a mapping
name: Release

jobs:
  test: helloWorld
```

:::

::: incorrect

```yaml
# has no name
name: Release

jobs:
  test:
    runs-on: ubuntu-latest
```

:::

::: incorrect

```yaml
# job name is empty
name: Release

jobs:
  test:
    name:
    runs-on: ubuntu-latest
```

:::

::: incorrect

```yaml
# job name is not a string
name: Release

jobs:
  test:
    name:
      - Test
    runs-on: ubuntu-latest
```

:::

::: incorrect

```yaml
# one or more job has no name
name: Release

jobs:
  test:
    name: Test

  lint:
```

:::

## :wrench: Options

Nothing.

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.6

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/require-job-name.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/require-job-name.test.ts)
