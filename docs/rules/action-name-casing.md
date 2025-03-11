---
pageClass: rule-details
sidebarDepth: 0
title: github-action/action-name-casing
description: Enforce naming convention to action name.
since: v0.0.2
---

# github-action/action-name-casing

> Enforce naming convention to action name.

- 💼 This rule is enabled in the ✅ `recommended` config.

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces the consistent case usage of action names.

::: correct

```yaml
name: Unit Test
```

:::

::: incorrect

```yaml
# camelCase
name: unitTest
```

:::

::: incorrect

```yaml
# kebab-case
name: unit-test
```

:::

::: incorrect

```yaml
# PascalCase
name: UnitTest
```

:::

::: incorrect

```yaml
# snake_case
name: unit_test
```

:::

::: incorrect

```yaml
# Train-Case
name: Unit-Test
```

:::

::: incorrect

```yaml
# SCREAMING_SNAKE_CASE
name: UNIT_TEST
```

:::

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

Examples of **correct** code for this rule with default option:

::: correct

```yaml
name: Unit Test
```

Examples of **incorrect** code for this rule with default option:

:::

::: incorrect

```yaml
# camelCase
name: unitTest
```

:::

::: incorrect

```yaml
# kebab-case
name: unit-test
```

:::

::: incorrect

```yaml
# PascalCase
name: UnitTest
```

:::

::: incorrect

```yaml
# snake_case
name: unit_test
```

:::

::: incorrect

```yaml
# Train-Case
name: Unit-Test
```

:::

::: incorrect

```yaml
# SCREAMING_SNAKE_CASE
name: UNIT_TEST
```

:::

### `"kebab-case"`

Examples of **correct** code for this rule with `"kebab-case"` option:

::: correct

```yaml
name: unit-test
```

Examples of **incorrect** code for this rule with `"kebab-case"` option:

:::

::: incorrect

```yaml
# camelCase
name: unitTest
```

:::

::: incorrect

```yaml
# PascalCase
name: UnitTest
```

:::

::: incorrect

```yaml
# snake_case
name: unit_test
```

:::

::: incorrect

```yaml
# Title Case
name: unit-test
```

:::

::: incorrect

```yaml
# Train-Case
name: Unit-Test
```

:::

::: incorrect

```yaml
# SCREAMING_SNAKE_CASE
name: UNIT_TEST
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.2

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/action-name-casing.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/action-name-casing.test.ts)
