---
sidebarDepth: 0
---

# Available Rules

💼 Configurations enabled in.\
✅ Set in the `recommended` preset.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

All rules target GitHub Actions workflow files under `.github/workflows/` unless configured otherwise.

| Name                                                     | Description                                            | 💼  | 🔧  | 💡  |
| :------------------------------------------------------- | :----------------------------------------------------- | :-: | :-: | :-: |
| [action-name-casing](./action-name-casing)               | Enforce naming convention to action name.              |     | 🔧  |     |
| [job-id-casing](./job-id-casing)                         | Enforce naming convention to job id.                   |     |     |     |
| [max-jobs-per-action](./max-jobs-per-action)             | Enforce maximum jobs per action file.                  |     |     |     |
| [no-external-job](./no-external-job)                     | Disallow using external job.                           |     |     |     |
| [no-invalid-key](./no-invalid-key)                       | Disallow using invalid key.                            | ✅  |     |     |
| [no-top-level-env](./no-top-level-env)                   | Disallow using top level env.                          |     |     |     |
| [no-top-level-permissions](./no-top-level-permissions)   | Disallow using top level permissions.                  |     |     |     |
| [no-unpinned-uses](./no-unpinned-uses)                   | Disallow unpinned uses references.                     |     |     |     |
| [prefer-cancel-in-progress](./prefer-cancel-in-progress) | Prefer setting concurrency cancel-in-progress to true. |     |     |     |
| [prefer-fail-fast](./prefer-fail-fast)                   | Disallow setting fail-fast to false.                   |     |     |     |
| [prefer-file-extension](./prefer-file-extension)         | Enforce action file extension.                         | ✅  |     |     |
| [prefer-step-uses-style](./prefer-step-uses-style)       | Enforce the style of job step uses.                    |     |     |     |
| [require-action-name](./require-action-name)             | Require a string action name.                          | ✅  |     |     |
| [require-action-run-name](./require-action-run-name)     | Require a string action run-name.                      |     |     |     |
| [require-concurrency-group](./require-concurrency-group) | Require a workflow-level concurrency group.            |     |     |     |
| [require-job-name](./require-job-name)                   | Require a string job name.                             |     |     |     |
| [require-job-step-name](./require-job-step-name)         | Require a string job step name.                        |     |     |     |
| [valid-timeout-minutes](./valid-timeout-minutes)         | Disallow invalid timeout-minutes.                      | ✅  |     |     |
| [valid-trigger-events](./valid-trigger-events)           | Disallow invalid trigger events.                       | ✅  | 🔧  |     |
