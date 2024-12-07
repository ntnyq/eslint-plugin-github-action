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

:apple: For advanced usaged, please check [Advanced Usage](https://eslint-plugin-github-action.ntnyq.com/guide/#advanced-usage)

## Rules

💼 Configurations enabled in.\
✅ Set in the `recommended` preset.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

| Name                                                                                                          | Description                               | 💼  | 🔧  | 💡  |
| :------------------------------------------------------------------------------------------------------------ | :---------------------------------------- | :-: | :-: | :-: |
| [action-name-casing](https://eslint-plugin-github-action.ntnyq.com/rules/action-name-casing.html)             | Enforce naming convention to action name. |     | 🔧  |     |
| [job-id-casing](https://eslint-plugin-github-action.ntnyq.com/rules/job-id-casing.html)                       | Enforce naming convention to job id.      |     |     |     |
| [max-jobs-per-action](https://eslint-plugin-github-action.ntnyq.com/rules/max-jobs-per-action.html)           | Enforce maximum jobs per action file.     |     |     |     |
| [no-external-job](https://eslint-plugin-github-action.ntnyq.com/rules/no-external-job.html)                   | Disallow using external job.              |     |     |     |
| [no-invalid-key](https://eslint-plugin-github-action.ntnyq.com/rules/no-invalid-key.html)                     | Disallow using invalid key.               | ✅  |     |     |
| [no-top-level-env](https://eslint-plugin-github-action.ntnyq.com/rules/no-top-level-env.html)                 | Disallow using top level env.             |     |     |     |
| [no-top-level-permissions](https://eslint-plugin-github-action.ntnyq.com/rules/no-top-level-permissions.html) | Disallow using top level permissions.     |     |     |     |
| [prefer-fail-fast](https://eslint-plugin-github-action.ntnyq.com/rules/prefer-fail-fast.html)                 | Disallow setting fail-fast to false.      |     |     |     |
| [prefer-file-extension](https://eslint-plugin-github-action.ntnyq.com/rules/prefer-file-extension.html)       | Enforce action file extension.            | ✅  |     |     |
| [prefer-step-uses-style](https://eslint-plugin-github-action.ntnyq.com/rules/prefer-step-uses-style.html)     | Enforce the style of job step uses.       |     |     |     |
| [require-action-name](https://eslint-plugin-github-action.ntnyq.com/rules/require-action-name.html)           | Require a string action name.             | ✅  |     |     |
| [require-action-run-name](https://eslint-plugin-github-action.ntnyq.com/rules/require-action-run-name.html)   | Require a string action run-name.         |     |     |     |
| [require-job-name](https://eslint-plugin-github-action.ntnyq.com/rules/require-job-name.html)                 | Require a string job name.                |     |     |     |
| [require-job-step-name](https://eslint-plugin-github-action.ntnyq.com/rules/require-job-step-name.html)       | Require a string job step name.           |     |     |     |

## Links

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Understanding the workflow file](https://docs.github.com/en/actions/use-cases-and-examples/creating-an-example-workflow#understanding-the-workflow-file)
- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
