# User Guide

## Install

::: code-group

```bash [npm]
npm i eslint-plugin-github-action -D
```

```bash [yarn]
yarn add eslint-plugin-github-action -D
```

```bash [pnpm]
pnpm add eslint-plugin-github-action -D
```

:::

## Basic Usage

Highly recommended to use `eslint.config.mjs` as config file.

```js [eslint.config.mjs]
import pluginGitHubAction from 'eslint-plugin-github-action'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...pluginGitHubAction.configs.recommended,
  // Other configs...
]
```

### The recommended preset

The `recommended` config enables a subset of [the rules](#rules) that should be most useful to most users.

## Advanced Usage

Override/add specific rules configurations.

_See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring)_.

```js [eslint.config.mjs]
import { createRecommendedConfig } from 'eslint-plugin-github-action'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // Create a single config based on the recommended config
  createRecommendedConfig({
    // Overrides built-in recommended rules
    overridesRules: {
      'github-action/action-name-casing': ['error', 'kebab-case'],
    },
  }),
]
```

## Options of `createRecommendedConfig`

### name

The name of the config.

- Type: `string`
- Required: `false`
- Default: `github-action/recommended`

### files

The files to be linted.

- Type: `string[]`
- Required: `false`
- Default: `['.github/workflows/*.y?(a)ml']`

### ignores

The files to be ignored. negated patterns for force lint.

- Type: `string[]`
- Required: `false`
- Default: `['!**/.github/workflows/*.y?(a)ml']`

### overridesRules

Override rules in the `recommended` preset.

- Type: `Record<string, Linter.RuleEntry>`
- Required: `false`
- Default: `undefined`