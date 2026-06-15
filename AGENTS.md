# AGENTS

This repository is an ESLint plugin for GitHub Actions workflow YAML files.

## Project Scope

- Runtime: Node.js 22.13+ (or 24+), ESM package.
- Package manager: pnpm (see [package.json](package.json)).
- Primary goal: maintain rule correctness, strong tests, and synced docs.

## Fast Commands

Use these commands from the repository root.

- Install: pnpm install
- Build: pnpm build
- Test: pnpm test
- Coverage: pnpm coverage
- Lint: pnpm lint
- Typecheck: pnpm typecheck
- Format: pnpm format
- Format check: pnpm format:check
- Docs dev: pnpm docs:dev
- Docs build: pnpm docs:build
- Release check: pnpm release:check

## Important Paths

- Plugin entry: [src/index.ts](src/index.ts)
- Plugin metadata: [src/meta.ts](src/meta.ts)
- Rule registry: [src/rules/index.ts](src/rules/index.ts)
- Rule implementations: [src/rules](src/rules)
- Recommended config: [src/configs/index.ts](src/configs/index.ts)
- Rule factory helper: [src/utils/createRule.ts](src/utils/createRule.ts)
- Test harness: [tests/internal.ts](tests/internal.ts)
- Root docs overview: [README.md](README.md)
- Docs site home: [docs/index.md](docs/index.md)
- Rules docs index: [docs/rules/index.md](docs/rules/index.md)
- Usage guide: [docs/guide/index.md](docs/guide/index.md)

## Rule Development Workflow

When adding or changing a rule, keep these in sync.

1. Implement rule logic in [src/rules](src/rules).
2. Use [src/utils/createRule.ts](src/utils/createRule.ts) to define rule metadata and docs URL wiring.
3. Export/register in [src/rules/index.ts](src/rules/index.ts).
4. Add or update rule tests in [tests/rules](tests/rules).
5. If recommended status changes, update [src/configs/index.ts](src/configs/index.ts).
6. Add or update matching docs in [docs/rules](docs/rules) and update [docs/rules/index.md](docs/rules/index.md).

## Testing Conventions

- Use the shared helper from [tests/internal.ts](tests/internal.ts) for rule tests.
- YAML parsing in tests should follow the harness pattern (yaml-eslint-parser is preconfigured there).
- Keep inline snapshots accurate when asserting reported errors.
- Coverage thresholds are strict; see [vitest.config.ts](vitest.config.ts).

## Project Conventions

- ESM + TypeScript only.
- Keep rule filenames kebab-case to match rule names.
- Prefer existing utilities in [src/utils](src/utils) before adding new helpers.
- Use minimal, targeted changes; avoid broad refactors unless requested.

## Common Pitfalls

- Forgetting to register a new rule in [src/rules/index.ts](src/rules/index.ts).
- Updating rule behavior without updating docs in [docs/rules](docs/rules).
- Breaking snapshots by changing message text/locations without test updates.
- Missing release gates: run pnpm release:check before versioning.

## Validation Checklist

Before finishing substantive changes:

1. Run pnpm lint.
2. Run pnpm typecheck.
3. Run pnpm test (or pnpm coverage for rule-heavy changes).
4. If docs changed, run pnpm docs:build.
