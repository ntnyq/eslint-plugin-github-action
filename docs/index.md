---
layout: home

hero:
  name: ESLint Plugin
  text: GitHub Action
  tagline: Rules for consistent, readable, and valid GitHub Actions workflow files.
  image:
    light: /logo-light.svg
    dark: /logo-dark.svg
    alt: ESLint Plugin GitHub Action Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
---

<div id="package_status">

[![CI](https://github.com/ntnyq/eslint-plugin-github-action/workflows/CI/badge.svg)](https://github.com/ntnyq/eslint-plugin-github-action/actions)
[![NPM VERSION](https://img.shields.io/npm/v/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/eslint-plugin-github-action.svg)](https://www.npmjs.com/package/eslint-plugin-github-action)
[![CODECOV](https://codecov.io/github/ntnyq/eslint-plugin-github-action/branch/main/graph/badge.svg)](https://codecov.io/github/ntnyq/eslint-plugin-github-action)
[![LICENSE](https://img.shields.io/github/license/ntnyq/eslint-plugin-github-action.svg)](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/LICENSE)

</div>

## :book: Usage

See [Guide](./guide/index.md).

Quick start:

```ts
import { defineConfig } from 'eslint/config'
import pluginGitHubAction from 'eslint-plugin-github-action'

export default defineConfig([...pluginGitHubAction.configs.recommended])
```

Requires Node.js `^22.19.0 || >=24.11.0` and ESLint `^9.5.0 || ^10.0.0`. The example uses `defineConfig`, available in ESLint 9.22+. See the [Guide](./guide/index.md#basic-usage) for the ESLint 9.5–9.21 configuration.

## :white_check_mark: Rules

See [Available Rules](./rules/index.md).

## :book: Changelog

See [CHANGELOG](https://github.com/ntnyq/eslint-plugin-github-action/releases).

## :lock: License

[MIT](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
