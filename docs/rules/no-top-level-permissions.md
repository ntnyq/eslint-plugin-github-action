---
pageClass: rule-details
sidebarDepth: 0
title: github-action/no-top-level-permissions
description: Disallow using top-level permissions.
since: v0.0.4
---

# github-action/no-top-level-permissions

> Disallow using top-level permissions.

## :book: Rule Details

This rule reports when a workflow has a top-level `permissions` property.

::: correct

```yaml
name: CI

jobs:
  unit-test:
    runs-on: ubuntu-latest
    # Non top-level permissions
    permissions:
      id-token: write
      contents: write
```

:::

::: incorrect

```yaml
name: CI

permissions:
  id-token: write
  contents: write
```

:::

## :wrench: Options

Sometimes, a GitHub token may have permissions enabled—either intentionally or accidentally—that are not required for the current workflow.
Some people consider specifying an empty permissions block at the top level to be a good practice, as it provides an additional layer of protection against such cases.
If you're following this practice, set the `allowEmpty` option to `true`.

```ts
type NoTopLevelPermissionsOptions = [
  'error' | 'warn' | 'off' | 2 | 1 | 0,
  {
    /**
     * @default false
     */
    allowEmpty?: boolean
  },
]
```

### With empty permissions block allowed

```json
{
  "allowEmpty": true
}
```

Examples of **correct** code:

::: correct

```yaml
name: CI

permissions: {}
```

:::

Examples of **incorrect** code:

::: incorrect

```yaml
name: CI

permissions:
  contents: write
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.4

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/no-top-level-permissions.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/no-top-level-permissions.test.ts)
