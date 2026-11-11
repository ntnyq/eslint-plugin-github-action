# eslint-plugin-github-action

[![CI](https://github.com/ntnyq/eslint-plugin-github-action/workflows/CI/badge.svg)](https://github.com/ntnyq/eslint-plugin-github-action/actions)
[![NPM VERSION](https://img.shields.io/npm/v/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![CODECOV](https://codecov.io/github/ntnyq/eslint-plugin-github-action/branch/main/graph/badge.svg)](https://codecov.io/github/ntnyq/eslint-plugin-github-action)
[![LICENSE](https://img.shields.io/github/license/ntnyq/eslint-plugin-github-action.svg)](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/LICENSE)

> Rules for consistent, readable, and valid GitHub Actions workflow files.

## Requirements

- Node.js `^22.19.0 || >=24.11.0`
- ESLint `^9.5.0 || ^10.0.0` with flat config

## Install

```shell
npm install eslint-plugin-github-action -D
```

```shell
yarn add eslint-plugin-github-action -D
```

```shell
pnpm add eslint-plugin-github-action -D
```

## Usage

Configure in ESLint config files:

```ts
import { defineConfig } from 'eslint/config'
import pluginGitHubAction from 'eslint-plugin-github-action'

export default defineConfig([
  ...pluginGitHubAction.configs.recommended,
  // Other configs...
])
```

The recommended config targets `**/.github/workflows/*.yml` and `.yaml` files and sets `yaml-eslint-parser`.

`defineConfig` requires [ESLint 9.22.0 or later](https://eslint.org/blog/2025/03/eslint-v9.22.0-released/). On ESLint 9.5–9.21, export the config array directly:

```ts
import pluginGitHubAction from 'eslint-plugin-github-action'

export default [...pluginGitHubAction.configs.recommended]
```

:apple: For advanced usage, please check [Advanced Usage](https://github-action.ntnyq.dev/guide/#advanced-usage)

## Rules

💼 Configurations enabled in.\
✅ Set in the `recommended` preset.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/use/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/extend/custom-rules#providing-suggestions).

| Name                                                                                              | Description                                            | 💼  | 🔧  | 💡  |
| :------------------------------------------------------------------------------------------------ | :----------------------------------------------------- | :-: | :-: | :-: |
| [action-name-casing](https://github-action.ntnyq.dev/rules/action-name-casing.html)               | Enforce naming convention for workflow name.           |     | 🔧  |     |
| [job-id-casing](https://github-action.ntnyq.dev/rules/job-id-casing.html)                         | Enforce naming convention for job IDs.                 |     |     |     |
| [max-jobs-per-action](https://github-action.ntnyq.dev/rules/max-jobs-per-action.html)             | Enforce maximum jobs per workflow file.                |     |     |     |
| [no-external-job](https://github-action.ntnyq.dev/rules/no-external-job.html)                     | Disallow using external jobs.                          |     |     |     |
| [no-invalid-key](https://github-action.ntnyq.dev/rules/no-invalid-key.html)                       | Disallow using invalid key.                            | ✅  |     |     |
| [no-top-level-env](https://github-action.ntnyq.dev/rules/no-top-level-env.html)                   | Disallow using top-level env.                          |     |     |     |
| [no-top-level-permissions](https://github-action.ntnyq.dev/rules/no-top-level-permissions.html)   | Disallow using top-level permissions.                  |     |     |     |
| [no-unpinned-uses](https://github-action.ntnyq.dev/rules/no-unpinned-uses.html)                   | Disallow unpinned uses references.                     |     |     |     |
| [prefer-cancel-in-progress](https://github-action.ntnyq.dev/rules/prefer-cancel-in-progress.html) | Prefer setting concurrency cancel-in-progress to true. |     |     |     |
| [prefer-fail-fast](https://github-action.ntnyq.dev/rules/prefer-fail-fast.html)                   | Disallow setting fail-fast to false.                   |     |     |     |
| [prefer-file-extension](https://github-action.ntnyq.dev/rules/prefer-file-extension.html)         | Enforce workflow file extension.                       | ✅  |     |     |
| [prefer-step-uses-style](https://github-action.ntnyq.dev/rules/prefer-step-uses-style.html)       | Enforce the style of job step `uses`.                  |     |     |     |
| [require-action-name](https://github-action.ntnyq.dev/rules/require-action-name.html)             | Require a string workflow name.                        | ✅  |     |     |
| [require-action-run-name](https://github-action.ntnyq.dev/rules/require-action-run-name.html)     | Require a string workflow run-name.                    |     |     |     |
| [require-concurrency-group](https://github-action.ntnyq.dev/rules/require-concurrency-group.html) | Require a workflow-level concurrency group.            |     |     |     |
| [require-job-name](https://github-action.ntnyq.dev/rules/require-job-name.html)                   | Require a string job name.                             |     |     |     |
| [require-job-step-name](https://github-action.ntnyq.dev/rules/require-job-step-name.html)         | Require a string job step name.                        |     |     |     |
| [valid-job-needs](https://github-action.ntnyq.dev/rules/valid-job-needs.html)                     | Disallow invalid job dependencies.                     | ✅  |     |     |
| [valid-trigger-events](https://github-action.ntnyq.dev/rules/valid-trigger-events.html)           | Disallow invalid trigger events.                       | ✅  | 🔧  |     |
| [valid-timeout-minutes](https://github-action.ntnyq.dev/rules/valid-timeout-minutes.html)         | Disallow invalid timeout-minutes.                      | ✅  |     |     |

## Links

- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [Understanding the workflow file](https://docs.github.com/en/actions/use-cases-and-examples/creating-an-example-workflow#understanding-the-workflow-file)
- [Workflow syntax for GitHub Actions](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)

## Development

This repository uses pnpm 12. Use the version pinned in the `packageManager` field of [package.json](./package.json).

```shell
pnpm install --frozen-lockfile
pnpm build
pnpm docs:dev
```

Build the plugin before starting the docs, as the docs import its built output. Run `pnpm docs:build` to build the documentation site, and `pnpm release:check` to run formatting, lint, type, and test checks.

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
