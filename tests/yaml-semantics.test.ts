import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import * as yamlParser from 'yaml-eslint-parser'
import { plugin } from '../src'
import { $ } from './internal'
import type { Linter as LinterTypes } from 'eslint'

function createConfig(rules: LinterTypes.RulesRecord): LinterTypes.Config[] {
  return [
    {
      files: ['**/*.yml'],
      languageOptions: { parser: yamlParser },
      plugins: { 'github-action': plugin },
      rules,
    },
  ]
}

const filename = 'ci.yml'

describe('YAML workflow semantics', () => {
  it.each([
    {
      rule: 'no-external-job',
      code: 'jobs: &jobs { test: &job { !!str uses: org/repo/workflow.yml@main }, copy: *job }',
      messageIds: ['disallowExternalJob'],
    },
    {
      rule: 'max-jobs-per-action',
      code: 'jobs: &jobs { test: &job {}, copy: *job, third: {}, fourth: {} }',
      messageIds: ['toManyJobs'],
    },
    {
      rule: 'job-id-casing',
      code: '!!str jobs: &jobs { !!str BadJob: {} }',
      messageIds: ['jobIdNotMatch'],
    },
    {
      rule: 'no-top-level-env',
      code: '!!str env: &env { NODE_ENV: test }',
      messageIds: ['disallowTopLevelEnv'],
    },
    {
      rule: 'no-top-level-permissions',
      code: '!!str permissions: &permissions { contents: read }',
      messageIds: ['disallowTopLevelPermissions'],
    },
    {
      rule: 'prefer-cancel-in-progress',
      code: 'concurrency: &concurrency { !!str cancel-in-progress: &flag false }\njobs: { test: &job { concurrency: *concurrency }, copy: *job }',
      messageIds: ['preferCancelInProgress', 'preferCancelInProgress'],
    },
    {
      rule: 'require-concurrency-group',
      code: 'concurrency: &concurrency { !!str group: &group ci, !!str cancel-in-progress: true }',
      messageIds: [],
    },
    {
      rule: 'require-job-name',
      code: 'jobs: &jobs { test: &job { runs-on: ubuntu-latest }, copy: *job }',
      messageIds: ['noName', 'noName'],
    },
    {
      rule: 'require-job-name',
      code: 'jobs: &jobs { test: &job { name: &name 1 }, copy: *job }',
      messageIds: ['invalidName', 'invalidName'],
    },
    {
      rule: 'valid-trigger-events',
      code: 'on: &events { !!str image_version: {} }',
      messageIds: [],
    },
    {
      rule: 'valid-trigger-events',
      code: 'on: *missing',
      messageIds: ['invalidPair'],
    },
    {
      rule: 'valid-trigger-events',
      code: 'on: &events\n  !!str unknown_event: {}',
      messageIds: ['invalidEvent'],
    },
    {
      rule: 'valid-trigger-events',
      code: 'on: &events\n  1: {}',
      messageIds: ['invalidPair'],
    },
  ])(
    'checks $rule in a metadata-wrapped workflow: $code',
    ({ rule, code, messageIds }) => {
      const messages = new Linter().verify(
        `&workflow\n${code}`,
        createConfig({ [`github-action/${rule}`]: 'error' }),
        { filename },
      )
      expect(messages.map(message => message.messageId)).toEqual(messageIds)
    },
  )

  it('accepts aliased concurrency values and empty permissions', () => {
    const messages = new Linter().verify(
      $`
        name: &group CI
        concurrency: &concurrency
          !!str group: *group
          !!str cancel-in-progress: &flag true
        !!str permissions: &permissions {}
        jobs:
          test: &job
            concurrency: *concurrency
          copy: *job
          other:
            concurrency:
              group: *group
              cancel-in-progress: *flag
      `,
      createConfig({
        'github-action/require-concurrency-group': 'error',
        'github-action/prefer-cancel-in-progress': 'error',
        'github-action/no-top-level-permissions': [
          'error',
          { allowEmpty: true },
        ],
      }),
      { filename },
    )
    expect(messages).toEqual([])
  })

  it('reports aliased event mappings without modifying the anchor definition', () => {
    const code = 'env: &events\n  unknown_event: value\non: *events'
    const result = new Linter().verifyAndFix(
      code,
      createConfig({
        'github-action/valid-trigger-events': 'error',
      }),
      { filename },
    )
    expect(result.output).toBe(code)
    expect(result.fixed).toBe(false)
    expect(result.messages.map(message => message.messageId)).toEqual([
      'invalidEvent',
    ])
  })

  it.each([
    'image_version',
    '[push, image_version]',
    'image_version:\n    types: [created]',
  ])('preserves the image_version trigger: %s', event => {
    const code = `on: ${event.includes(':') ? `\n  ${event}` : event}`
    const result = new Linter().verifyAndFix(
      code,
      createConfig({
        'github-action/valid-trigger-events': 'error',
      }),
      { filename },
    )
    expect(result.messages).toEqual([])
    expect(result.output).toBe(code)
    expect(result.fixed).toBe(false)
  })

  it.each(['false!', 'null!', '123!', 'on!'])(
    'preserves string type and converges when fixing name: %s',
    name => {
      const config = createConfig({
        'github-action/action-name-casing': 'error',
        'github-action/require-action-name': 'error',
      })
      const code = `name: ${name}`
      const result = new Linter().verifyAndFix(code, config, { filename })
      const value = yamlParser.getStaticYAMLValue(
        yamlParser.parseYAML(result.output),
      )
      expect(value).toHaveProperty('name', expect.any(String))
      expect(
        new Linter().verifyAndFix(result.output, config, { filename }).fixed,
      ).toBe(false)
      expect(result.messages).toEqual([])
    },
  )

  it.each(['!!str', '&key'])(
    'checks metadata keys throughout workflow traversal: %s',
    metadata => {
      const messages = new Linter().verify(
        `${metadata} jobs:\n  test:\n    steps:\n      - ${metadata === '&key' ? '&uses' : metadata} uses: actions/checkout@main`,
        createConfig({ 'github-action/no-unpinned-uses': 'error' }),
        { filename },
      )
      expect(messages.map(message => message.messageId)).toEqual([
        'disallowUnpinnedUses',
      ])
    },
  )

  it('accepts names and events through anchors, aliases, and metadata keys', () => {
    const messages = new Linter().verify(
      $`
        &nameKey name: &name Unit Test
        run-name: *name
        on: &events [push, &event image_version, *event]
        jobs: &jobs
          test: &test
            name: *name
            steps:
              - &step
                !!str name: *name
                run: echo test
              - *step
          copy: *test
      `,
      createConfig({
        'github-action/require-action-name': 'error',
        'github-action/require-action-run-name': 'error',
        'github-action/action-name-casing': 'error',
        'github-action/require-job-name': 'error',
        'github-action/require-job-step-name': 'error',
        'github-action/valid-trigger-events': 'error',
      }),
      { filename },
    )
    expect(messages).toEqual([])
  })

  it('checks anchored strategies once even when the job is reused', () => {
    const messages = new Linter().verify(
      $`
        jobs:
          test: &test
            strategy: &strategy
              fail-fast: &flag false
          copy: *test
          other:
            strategy:
              fail-fast: *flag
      `,
      createConfig({ 'github-action/prefer-fail-fast': 'error' }),
      { filename },
    )
    expect(messages.map(message => message.messageId)).toEqual([
      'unexpected',
      'unexpected',
    ])
  })

  it.each([
    { value: `\${{ 1 }}suffix\${{ 2 }}`, errors: ['notInteger'] },
    { value: `\${{ 1 }}\${{ 2 }}`, errors: ['notInteger'] },
    { value: `\${{ 1 }} `, errors: [] },
    { value: `\${{ fromJSON('}}') }}`, errors: [] },
    { value: `\${{ fromJSON('it''s }}') }}`, errors: [] },
  ])('distinguishes expression boundaries: $value', ({ value, errors }) => {
    const messages = new Linter().verify(
      `jobs: { test: { timeout-minutes: ${JSON.stringify(value)} } }`,
      createConfig({ 'github-action/valid-timeout-minutes': 'error' }),
      { filename },
    )
    expect(messages.map(message => message.messageId)).toEqual(errors)
  })

  it('leaves a punctuation-only name intact when casing would empty it', () => {
    const code = "name: '!'"
    const result = new Linter().verifyAndFix(
      code,
      createConfig({
        'github-action/action-name-casing': 'error',
        'github-action/require-action-name': 'error',
      }),
      { filename },
    )
    expect(result.output).toBe(code)
    expect(result.fixed).toBe(false)
    expect(result.messages.map(message => message.messageId)).toEqual([
      'actionNameNotMatch',
    ])
  })

  it('fixes an aliased name at its use without changing other anchor consumers', () => {
    const result = new Linter().verifyAndFix(
      'run-name: &name unit-test\nname: *name',
      createConfig({
        'github-action/action-name-casing': 'error',
      }),
      { filename },
    )
    expect(result.output).toBe('run-name: &name unit-test\nname: "Unit Test"')
    expect(result.messages).toEqual([])
  })
})
