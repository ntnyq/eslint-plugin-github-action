---
pageClass: rule-details
sidebarDepth: 0
title: github-action/action-name-casing
description: Enforce naming convention for workflow name.
since: v0.0.2
---

# github-action/action-name-casing

> Enforce naming convention for workflow name.

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/latest/use/command-line-interface#--fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent casing for the workflow `name`, including anchored and aliased names. Fixes add quotes when needed to preserve the YAML string type. An aliased name is replaced at its use without changing the anchor definition. Anchored names referenced elsewhere and names whose converted value would be empty are reported without an automatic fix. Explicit YAML tags are respected when reading the name.

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

Default casing is set to `Title Case`.

```ts
type AllowedCasing =
  | 'camelCase'
  | 'kebab-case'
  | 'PascalCase'
  | 'snake_case'
  | 'Title Case'
  | 'Train-Case'
  | 'SCREAMING_SNAKE_CASE'

type ActionNameCasingOptions = [
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

The object form accepts multiple casing styles and regular expression strings in `ignores`. If no casing style is enabled, it falls back to `Title Case`. Automatic fixes are available only when one casing style is enabled.

### `"Title Case"` (default)

Examples of **correct** code for this rule with default option:

::: correct

```yaml
name: Unit Test
```

:::

Examples of **incorrect** code for this rule with default option:

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

:::

Examples of **incorrect** code for this rule with `"kebab-case"` option:

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
name: Unit Test
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
