---
pageClass: rule-details
sidebarDepth: 0
title: github-action/prefer-file-extension
description: Enforce workflow file extension.
since: v0.0.8
---

# github-action/prefer-file-extension

> Enforce workflow file extension.

- 💼 This rule is enabled in the ✅ `recommended` config.

## :book: Rule Details

This rule reports when a workflow file extension does not match.

::: correct

```yml
# yml.yml
name: Release
```

:::

::: incorrect

```yaml
# yaml.yaml
name: Release
```

:::

## :wrench: Options

Default extension is set to `yml`.

```ts
type AllowedExtension = 'yml' | 'yaml'

type PreferFileExtensionOptions = [
  'error' | 'warn' | 'off' | 2 | 1 | 0,
  (
    | AllowedExtension
    | {
        extension?: AllowedExtension
        /**
         * @default true
         */
        caseSensitive?: boolean
      }
  ),
]
```

### `"yml"` (default)

Examples of **correct** code for this rule with default option:

::: correct

```yml
# yml.yml
name: Release
```

:::

Examples of **incorrect** code for this rule with default option:

::: incorrect

```yaml
# yaml.yaml
name: Release
```

:::

### `"yaml"`

Examples of **correct** code for this rule with `"yaml"` option:

::: correct

```yaml
# yaml.yaml
name: Release
```

:::

Examples of **incorrect** code for this rule with `"yaml"` option:

::: incorrect

```yml
# yml.yml
name: Release
```

:::

## :rocket: Version

This rule was introduced in eslint-plugin-github-action v0.0.8

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/prefer-file-extension.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/prefer-file-extension.test.ts)
