# User Guide

## Requirements

- Node.js `^22.19.0 || >=24.11.0`
- ESLint `^9.5.0 || ^10.0.0` with flat config

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

The recommended config already applies to `**/.github/workflows/*.yml` and `.yaml` files and sets `yaml-eslint-parser`.

`defineConfig` requires [ESLint 9.22.0 or later](https://eslint.org/blog/2025/03/eslint-v9.22.0-released/). On ESLint 9.5–9.21, export the config array directly:

```ts [eslint.config.mjs] twoslash
import pluginGitHubAction from 'eslint-plugin-github-action'

export default [...pluginGitHubAction.configs.recommended]
```

### The recommended preset

The `recommended` config enables the following rules at error level:

- [no-invalid-key](../rules/no-invalid-key.md)
- [prefer-file-extension](../rules/prefer-file-extension.md)
- [require-action-name](../rules/require-action-name.md)
- [valid-trigger-events](../rules/valid-trigger-events.md)
- [valid-timeout-minutes](../rules/valid-timeout-minutes.md)

`prefer-file-extension` defaults to `.yml`. Override it if your workflows use `.yaml`.

## Advanced Usage

### Override recommended rules

Add a config after the recommended preset to override or enable rules:

```ts [eslint.config.mjs] twoslash
import { defineConfig } from 'eslint/config'
import pluginGitHubAction from 'eslint-plugin-github-action'

export default defineConfig([
  ...pluginGitHubAction.configs.recommended,
  {
    files: ['**/.github/workflows/*.y?(a)ml'],
    rules: {
      'github-action/prefer-file-extension': ['error', 'yaml'],
      'github-action/action-name-casing': ['error', 'kebab-case'],
    },
  },
])
```

### Configure rules manually

To enable only specific rules, register the plugin and YAML parser yourself. Install `yaml-eslint-parser` as a dev dependency when importing it directly.

_See also: [ESLint configuration files](https://eslint.org/docs/latest/use/configure/configuration-files)_.

```ts [eslint.config.mjs] twoslash
// @noErrors
import { defineConfig } from 'eslint/config'
import pluginGitHubAction from 'eslint-plugin-github-action'
import * as parserYAML from 'yaml-eslint-parser'

export default defineConfig([
  // Enable only the rules you need
  {
    name: 'github-action',
    files: ['**/.github/workflows/*.y?(a)ml'],
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
