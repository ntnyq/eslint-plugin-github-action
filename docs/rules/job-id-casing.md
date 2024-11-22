---
pageClass: rule-details
sidebarDepth: 0
title: github-action/job-id-casing
description: Enforce naming convention to job id.
since: v0.0.3
---

# github-action/job-id-casing

> Enforce naming convention to job id.

## :book: Rule Details

This rule enforces the consistent case usage of job ids.

### Good

```yaml
jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### Bad

```yaml
# camelCase
jobs:
  unitTest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# snake_case
jobs:
  unit_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# PascalCase
jobs:
  UnitTest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# Train-Case
jobs:
  Unit-Test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# SCREAMING_SNAKE_CASE
jobs:
  UNIT_TEST:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## :wrench: Options

Default casing is set to `kebab-case`.

```ts
type AllowedCasing =
  | 'camelCase'
  | 'kebab-case'
  | 'PascalCase'
  | 'snake_case'
  | 'Train-Case'
  | 'SCREAMING_SNAKE_CASE'

type JobIdCasingOptions = [
  'error' | 'warn' | 'off' | 2 | 1 | 0,
  (
    | AllowedCasing
    | ({
        [key in AllowedCasing]?: boolean
      } & {
        ignores?: string[]
      })
  ),
]
```

### `"kebab-case"` (default)

#### Good

```yaml
jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

#### Bad

```yaml
# camelCase
jobs:
  unitTest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# snake_case
jobs:
  unit_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# PascalCase
jobs:
  UnitTest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# Train-Case
jobs:
  Unit-Test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# SCREAMING_SNAKE_CASE
jobs:
  UNIT_TEST:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### `"snake_case"`

#### Good

```yaml
jobs:
  unit_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

#### Bad

```yaml
# camelCase
jobs:
  unitTest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# kebab-case
jobs:
  unit-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# PascalCase
jobs:
  UnitTest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# Train-Case
jobs:
  Unit-Test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

```yaml
# SCREAMING_SNAKE_CASE
jobs:
  UNIT_TEST:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.3

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/job-id-casing.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/job-id-casing.test.ts)