# Repository Guidelines

## Project Structure & Module Organization

This repository is an ESM TypeScript package for ESLint rules that validate GitHub Actions workflows. `src/index.ts` is the package entry point. Rule implementations live in `src/rules/`; shared helpers, constants, types, and presets are organized under `src/utils/`, `src/constants/`, `src/types/`, and `src/configs/`. Tests mirror the source layout under `tests/`, with snapshots in `__snapshots__/` and YAML/AST samples in `tests/fixtures/`. Documentation is a VitePress site under `docs/`; static assets belong in `docs/public/`. Treat `dist/` and `coverage/` as generated output.

## Build, Test, and Development Commands

Use Node.js 22.13+ (or 24+) and pnpm 11.

- `pnpm install --frozen-lockfile` installs the exact locked dependencies.
- `pnpm dev` rebuilds the package in watch mode; `pnpm build` creates `dist/`.
- `pnpm test` runs Vitest once; `pnpm coverage` also enforces coverage thresholds.
- `pnpm lint`, `pnpm format:check`, and `pnpm typecheck` run the same static checks expected by CI. Use `pnpm format` to apply formatting.
- `pnpm docs:dev` starts the documentation site; `pnpm docs:build` verifies its production build.

## Coding Style & Naming Conventions

Follow `.editorconfig` and Oxfmt: two-space indentation, LF endings, single quotes, no semicolons, trailing commas, and an 80-column target. ESLint uses `@ntnyq/eslint-config`; prefer type-only imports where applicable. Name rule files in kebab case (`no-unpinned-uses.ts`), keep `RULE_NAME` aligned with the filename, and use camelCase for helpers and variables. Do not hand-format around Oxfmt.

## Testing Guidelines

Vitest is the test framework. Name tests `*.test.ts` and place them beside the matching source area under `tests/`. Rule tests should use the shared `run` helper from `tests/internal.ts`, cover valid and invalid workflows, and update snapshots intentionally. Coverage requires 100% lines, statements, and functions, plus at least 97% branch coverage.

When adding a rule, register it in `src/rules/index.ts`, add its test, create `docs/rules/<rule-name>.md`, and update the rule listings or presets when relevant.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commits such as `feat: add ...`, `chore(deps): update ...`, and `feat!: drop ...`. Keep commits focused and use `!` only for breaking changes. Pull requests should explain the behavior change, link related issues, include tests, and update documentation for user-facing rules or options. Before requesting review, run formatting, linting, type checking, tests, and the build; include screenshots only for visible documentation changes.
