---
pageClass: rule-details
sidebarDepth: 0
title: github-action/job-name-casing
description: Enforce naming convention for job names.
since: unreleased
---

# github-action/job-name-casing

> Enforce naming convention for job names.

- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/latest/use/command-line-interface#--fix) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

This rule enforces consistent casing for each job `name`, the display name shown in workflow runs and status checks. It accepts the same options as [`action-name-casing`](./action-name-casing.md) and fixes names the same way, including anchored and aliased names. Jobs without a `name` are ignored; use [`require-job-name`](./require-job-name.md) to require one.

In `Title Case`, <code v-pre>${{ … }}</code> expressions and backtick code spans are kept as written and never checked, so a name that is a single expression is always valid. Only the first letter of each word can change, which preserves acronyms and punctuation such as `AWS`, `(CI)`, and `Node.js`. Other casings do not check names that contain an expression or code span.

::: correct

<div v-pre>

```yaml
jobs:
  test:
    name: Test On Node ${{ matrix.node }}
```

</div>

:::

::: correct

<div v-pre>

```yaml
jobs:
  build:
    name: ${{ matrix.name }}
```

</div>

:::

::: incorrect

```yaml
jobs:
  lint:
    name: lint code and docs
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

type JobNameCasingOptions = [
  'error' | 'warn' | 'off' | 2 | 1 | 0,
  (
    | AllowedCasing
    | ({
        [key in AllowedCasing]?: boolean
      } & {
        allowLowercaseMinorWords?: boolean
        ignores?: string[]
      })
  ),
]
```

The object form accepts multiple casing styles and regular expression strings in `ignores`. If no casing style is enabled, it falls back to `Title Case`. Automatic fixes are available only when one casing style is enabled.

### `allowLowercaseMinorWords`

When `true`, minor words such as `a`, `and`, `on`, `the`, `to`, and `with` may stay lowercase in `Title Case`, except as the first word. The list matches the [`title-case`](https://github.com/blakeembrey/change-case/tree/main/packages/title-case) package. Fixes leave minor words as written.

```js
{
  'github-action/job-name-casing': [
    'error',
    { 'Title Case': true, allowLowercaseMinorWords: true },
  ],
}
```

::: correct

```yaml
jobs:
  lint:
    name: Lint Code and Documentation
```

:::

::: incorrect

```yaml
jobs:
  lint:
    name: the code linter
```

:::

## :rocket: Version

This rule has not been released yet.

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/job-name-casing.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/job-name-casing.test.ts)
