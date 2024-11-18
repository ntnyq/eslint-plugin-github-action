# eslint-plugin-github-action

[![CI](https://github.com/ntnyq/eslint-plugin-github-action/workflows/CI/badge.svg)](https://github.com/ntnyq/eslint-plugin-github-action/actions)
[![NPM VERSION](https://img.shields.io/npm/v/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![CODECOV](https://codecov.io/github/ntnyq/eslint-plugin-github-action/branch/main/graph/badge.svg)](https://codecov.io/github/ntnyq/eslint-plugin-github-action)
[![LICENSE](https://img.shields.io/github/license/ntnyq/eslint-plugin-github-action.svg)](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/LICENSE)

> Rules for consistent, readable and valid GitHub action files.

## Install

```bash
npm install eslint-plugin-github-action -D
```

```bash
yarn add eslint-plugin-github-action -D
```

```bash
pnpm add eslint-plugin-github-action -D
```

## Usage

Config in ESLint config files:

```ts
import pluginGitHubAction from 'eslint-plugin-github-action'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...pluginGitHubAction.configs.recommended,
  // Other configs...
]
```

## Rules

- 💼 Configurations enabled in.
- 🌐 Set in the all preset.
- ✅ Set in the recommended preset.
- 🔧 Automatically fixable by the --fix CLI option.
- 💡 Manually fixable by editor suggestions.

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
