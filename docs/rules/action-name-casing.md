---
pageClass: rule-details
sidebarDepth: 0
title: github-action/action-name-casing
description: Enforce naming convention to action name.
since: v0.0.2
---

# github-action/action-name-casing

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

> Enforce naming convention to action name.

## :book: Rule Details

This rule enforces the consistent case usage of action names.

### Good

```yaml
name: Unit Test
```

### Bad

```yaml
# camelCase
name: unitTest
```

```yaml
# kebab-case
name: unit-test
```

```yaml
# PascalCase
name: UnitTest
```

```yaml
# snake_case
name: unit_test
```

```yaml
# Train-Case
name: Unit-Test
```

```yaml
# SCREAMING_SNAKE_CASE
name: UNIT_TEST
```

## :wrench: Options

Default casing is set to `TitleCase`.

```ts
type ActionNameCasingOptions = [
  'error' | 'warn' | 'off' | 2 | 1 | 0,
  (
    | 'camelCase'
    | 'kebab-case'
    | 'PascalCase'
    | 'snake_case'
    | 'Title Case'
    | 'Train-Case'
    | 'SCREAMING_SNAKE_CASE'
  ),
]
```

### `"Title Case"` (default)

#### Good

```yaml
name: Unit Test
```

#### Bad

```yaml
# camelCase
name: unitTest
```

```yaml
# kebab-case
name: unit-test
```

```yaml
# PascalCase
name: UnitTest
```

```yaml
# snake_case
name: unit_test
```

```yaml
# Train-Case
name: Unit-Test
```

```yaml
# SCREAMING_SNAKE_CASE
name: UNIT_TEST
```

### `"kebab-case"`

#### Good

```yaml
name: unit-test
```

#### Bad

```yaml
# camelCase
name: unitTest
```

```yaml
# PascalCase
name: UnitTest
```

```yaml
# snake_case
name: unit_test
```

```yaml
# Title Case
name: unit-test
```

```yaml
# Train-Case
name: Unit-Test
```

```yaml
# SCREAMING_SNAKE_CASE
name: UNIT_TEST
```

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.2

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/action-name-casing.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/action-name-casing.test.ts)
