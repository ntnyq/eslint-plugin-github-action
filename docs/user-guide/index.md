# User Guide

## Install

**npm**:

```bash
npm i eslint-plugin-github-action -D
```

**yarn**

```bash
yarn add eslint-plugin-github-action -D
```

**pnpm**

```bash
pnpm add eslint-plugin-github-action -D
```

## Usage

Config in `eslint.config.mjs`

```js
import pluginGitHubAction from 'eslint-plugin-github-action'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...pluginGitHubAction.configs.recommended,
  // Or
  // ...pluginGitHubAction.configs.all,
]
```

### The recommended preset

The `recommended` config enables a subset of [the rules](#rules) that should be most useful to most users.

_See [src/configs/recommended.ts](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/configs/recommended.ts) for more details._

### The all preset

The `all` config enables all the [the rules](#rules).

_See [src/configs/all.ts](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/configs/all.ts) for more details._

### Advanced Configuration

Override/add specific rules configurations.

_See also: [http://eslint.org/docs/user-guide/configuring](http://eslint.org/docs/user-guide/configuring)_.

```js
import pluginGitHubAction from 'eslint-plugin-github-action'
import * as yamlParser from 'yaml-eslint-parser'

export default [
  {
    files: ['**/.github/workflows/*.y?(a)ml'],
    ignore: ['!**/.github/workflows/*.y?(a)ml'],
    languageOptions: {
      parser: yamlParser,
    },
    plugins: {
      'github-action': pluginGitHubAction,
    },
    rules: {
      'github-action/require-action-name': 'error',
    },
  },
]
```
