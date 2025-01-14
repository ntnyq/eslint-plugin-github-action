# User Guide

## Install

::: code-group

```shell [npm]
npm i eslint-plugin-github-action -D
```

```shell [yarn]
yarn add eslint-plugin-github-action -D
```

```shell [pnpm]
pnpm add eslint-plugin-github-action -D
```

:::

## Basic Usage

Highly recommended to use `eslint.config.mjs` as config file.

```ts [eslint.config.mjs] twoslash
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

```ts [eslint.config.mjs] twoslash
// @noErrors
import { createConfig } from 'eslint-plugin-github-action'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // Create a single config based on the recommended config
  createConfig({
    // config name
    name: 'github-action',

    // files to include
    files: ['.github/workflows/*.y?(a)ml'],

    // files to exclude
    ignores: ['!**/.github/workflows/*.y?(a)ml'],

    // rules to enable
    rules: {
      'github-action/action-name-casing': ['error', 'kebab-case'],
    },
  }),
]
```

## Options of `createConfig`

All fields of ESLint `Linter.Config` are supported, but bellow fields have default value:

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

### languageOptions.parser

The parser to use, this is set by default and can't be overridden.

- Type: `Linter.Parser`
- Required: `false`
- Default: [yaml-eslint-parser](https://github.com/ota-meshi/yaml-eslint-parser)

### plugins

The plugins to use.

- Type: `Record<string, ESLint.Plugin>`
- Required: `false`
- Default: key `github-action` set to this plugin
