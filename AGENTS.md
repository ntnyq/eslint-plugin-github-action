# Repository Guidelines

## Project Structure & Module Organization

This ESM TypeScript package provides ESLint rules for GitHub Actions workflows. `src/index.ts` exports the plugin. Implementations live in `src/rules/`, presets in `src/configs/`, and shared code in `src/utils/`, `src/constants/`, and `src/types/`. Tests mirror these areas under `tests/`; YAML fixtures and snapshots belong in `tests/fixtures/` and `__snapshots__/`. The VitePress site lives in `docs/`, with static assets in `docs/public/`. Treat `dist/`, `coverage/`, and VitePress build output as generated files.

## Build, Test, and Development Commands

Use a Node.js version satisfying `^22.13.0 || >=24` and the pnpm version pinned in `package.json`.

- `pnpm install --frozen-lockfile`: install locked dependencies.
- `pnpm build`: bundle the package and declarations with tsdown.
- `pnpm dev`: rebuild the package in watch mode.
- `pnpm test`: run Vitest once; build first because integration tests import the package through `dist/`.
- `pnpm coverage`: run tests with V8 coverage and enforce thresholds.
- `pnpm lint`, `pnpm format:check`, `pnpm typecheck`: check lint, formatting, and types. Use `pnpm format` to apply formatting.
- `pnpm docs:dev`: start VitePress; `pnpm docs:build`: verify the documentation build after building the package.

## Coding Style & Naming Conventions

Follow `.editorconfig` and Oxfmt: two spaces, LF endings, single quotes, no semicolons, trailing commas, and an 80-column target. ESLint uses `@ntnyq/eslint-config`. Use strict TypeScript and type-only imports. Rule filenames use kebab case, such as `require-action-name.ts`; match `RULE_NAME` to the filename. Use camelCase for helpers and variables.

## Testing Guidelines

Name tests `*.test.ts`. Rule tests use `run` from `tests/internal.ts`, which configures `yaml-eslint-parser`. Cover valid and invalid workflows, options, diagnostics, and autofixes where applicable; review snapshot changes intentionally. Coverage requires 100% statements, lines, and functions, plus 97% branches.

For a new rule, use `createESLintRule`, register it in `src/rules/index.ts`, add matching tests and `docs/rules/<rule-name>.md`, and update rule listings and relevant presets.

## Commit & Pull Request Guidelines

Follow the history's Conventional Commits style: `fix: reject non-scalar timeout values`, `feat: add ...`, or `chore(deps): update ...`. Keep commits focused. PRs should explain behavior changes, link related issues, and include relevant tests and documentation. Run formatting, lint, build, typecheck, tests, and coverage before review. Include screenshots for visible documentation changes when helpful.
