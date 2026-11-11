---
pageClass: rule-details
sidebarDepth: 0
title: github-action/valid-job-needs
description: Disallow invalid job dependencies.
since: unreleased
---

# github-action/valid-job-needs

> Disallow invalid job dependencies.

- 💼 This rule is enabled in the ✅ `recommended` config.

## :book: Rule Details

This rule validates `jobs.<job_id>.needs` within each YAML document. It reports:

- Values other than a non-empty string or an array of non-empty strings.
- GitHub Actions expressions, including interpolation inside a string.
- References to job IDs that are not declared in the current workflow.
- Jobs that depend on themselves.
- Circular dependencies between two or more jobs.

Omitting `needs` and using `needs: []` are both allowed. Repeated dependencies
are allowed. Job IDs are matched exactly, including case and whitespace, and
forward references are supported. The job's display `name` is not its ID.

Ordinary jobs, matrix jobs, and jobs calling reusable workflows all participate
in the same graph. Matrix jobs are checked by their declared ID without expanding
the matrix. You can depend on a local job that calls a reusable workflow, but
cannot refer directly to jobs declared inside another workflow file.

YAML anchors, aliases, and explicit tags are resolved before checking values.
For example, `!!str 123` is a string while the bare number `123` is invalid.
Each job ID is checked even when multiple jobs share one aliased configuration.
Diagnostics for aliases point to the use rather than the anchor definition.

Each strongly connected group of two or more jobs produces one circular
dependency diagnostic, listing its members in declaration order. The diagnostic
points to the earliest dependency reference within that group. Downstream jobs
outside the group are not reported as members of the cycle. Self dependencies
are reported separately. Conditions such as `if: always()` and
`continue-on-error` do not remove dependency edges.

Invalid array entries are reported individually; valid entries still participate
in reference and cycle checks. Empty block entries are reported on their `-`
indicator. This rule does not inspect accesses such as
<code v-pre>${{ needs.build.outputs.result }}</code> in other fields.

::: correct

```yaml
name: CI
on: push
jobs:
  deploy:
    needs: [build, test]
    runs-on: ubuntu-latest
    steps:
      - run: echo deploy
  build:
    uses: ./.github/workflows/build.yml
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo test
```

:::

::: incorrect

```yaml
name: CI
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo build
  test:
    needs: [biuld, false, test]
    runs-on: ubuntu-latest
    steps:
      - run: echo test
```

```yaml eslint-check
name: CI
on: push
jobs:
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo build
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo test
```

:::

No automatic fix or editor suggestion is provided, since changing a dependency
can change the workflow's execution order.

## :wrench: Options

Nothing.

## :books: References

- [GitHub Actions workflow syntax for `needs`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idneeds)
- [GitHub Actions workflow schema](https://github.com/actions/languageservices/blob/main/workflow-parser/src/workflow-v1.0.json)

## :rocket: Version

This rule has not been released yet.

## :mag: Implementation

- [Rule source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/src/rules/valid-job-needs.ts)
- [Test source](https://github.com/ntnyq/eslint-plugin-github-action/blob/main/tests/rules/valid-job-needs.test.ts)
