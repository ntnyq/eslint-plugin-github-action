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
// @noErrors
import { defineConfig } from 'eslint/config'
import pluginGitHubAction from 'eslint-plugin-github-action'

export default defineConfig([
  ...pluginGitHubAction.configs.recommended,
  // Other configs...
])
```

### The recommended preset

The `recommended` config enables a subset of [the rules](#rules) that should be most useful to most users.

## Advanced Usage

Override/add specific rules configurations.

_See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring)_.

```ts [eslint.config.mjs] twoslash
// @noErrors
import { defineConfig } from 'eslint/config'
import pluginGitHubAction from 'eslint-plugin-github-action'
import * as parserYAML from 'yml-eslint-parser'

export default defineConfig([
  // Create a single config based on the recommended config
  {
    name: 'github-action',
    files: ['.github/workflows/*.y?(a)ml'],
    ignores: ['!**/.github/workflows/*.y?(a)ml'],
    plugins: {
      'github-action': pluginGitHubAction,
    },
    languageOptions: {
      parser: parserYAML,
    },
    rules: {
      'github-action/action-name-casing': ['error', 'kebab-case'],
    },
  },
])
```
