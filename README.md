# eslint-plugin-github-action

[![CI](https://github.com/ntnyq/eslint-plugin-github-action/workflows/CI/badge.svg)](https://github.com/ntnyq/eslint-plugin-github-action/actions)
[![NPM VERSION](https://img.shields.io/npm/v/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![CODECOV](https://codecov.io/github/ntnyq/eslint-plugin-github-action/branch/main/graph/badge.svg)](https://codecov.io/github/ntnyq/eslint-plugin-github-action)
[![LICENSE](https://img.shields.io/github/license/ntnyq/eslint-plugin-github-action.svg)](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/LICENSE)

> Rules for consistent, readable and valid GitHub action files.

> [!WARNING]
> This plugin is Work In Progress. API may change at every release. Please use with caution.

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

:apple: For advanced usaged, please check [Advanced Usage](https://eslint-plugin-github-action.ntnyq.com/user-guide/#advanced-usage)

## Rules

💼 Configurations enabled in.\
✅ Set in the `recommended` preset.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                                                          | Description                               | 💼  | 🔧  | 💡  |
| :------------------------------------------------------------------------------------------------------------ | :---------------------------------------- | :-: | :-: | :-: |
| [action-name-casing](https://eslint-plugin-github-action.ntnyq.com/rules/action-name-casing.html)             | enforce naming convention to action name. |     | 🔧  |     |
| [job-id-casing](https://eslint-plugin-github-action.ntnyq.com/rules/job-id-casing.html)                       | enforce naming convention to job id.      |     |     |     |
| [max-jobs-per-action](https://eslint-plugin-github-action.ntnyq.com/rules/max-jobs-per-action.html)           | enforce maximum jobs per action file.     |     |     |     |
| [no-top-level-permissions](https://eslint-plugin-github-action.ntnyq.com/rules/no-top-level-permissions.html) | Disallow using top level permissions.     |     |     |     |
| [require-action-name](https://eslint-plugin-github-action.ntnyq.com/rules/require-action-name.html)           | require action name to be set.            | ✅  |     |     |

## Links

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Understanding the workflow file](https://docs.github.com/en/actions/use-cases-and-examples/creating-an-example-workflow#understanding-the-workflow-file)
- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
