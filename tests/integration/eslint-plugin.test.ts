import { ESLint, Linter } from 'eslint'
import { configs, plugin } from 'eslint-plugin-github-action'
import { glob } from 'tinyglobby'
import { describe, expect, it } from 'vitest'
import { getStaticYAMLValue, parseYAML } from 'yaml-eslint-parser'
import { resolveProjectPath } from '../../scripts/paths'
import { $ } from '../helpers/rule-tester'

const TEST_CWD = resolveProjectPath('tests/fixtures/eslint-plugin')

describe('eslint-plugin', () => {
  it.each([
    { step: 361 },
    { step: { min: 361 } },
    { step: { max: 361 } },
    { min: 361 },
  ])('rejects timeout options beyond the step limit: %j', options => {
    const linter = new Linter()
    expect(() =>
      linter.verify(
        'jobs: {}',
        [
          ...configs.recommended,
          {
            rules: {
              'github-action/valid-timeout-minutes': ['error', options],
            },
          },
        ],
        { filename: '.github/workflows/ci.yml' },
      ),
    ).toThrow()
  })

  it.each(['|-', '>-', '|', '>'])(
    'preserves string values when fixing a %s workflow name',
    style => {
      const linter = new Linter()
      const config = [
        ...configs.recommended,
        { rules: { 'github-action/action-name-casing': 'error' as const } },
      ]
      const result = linter.verifyAndFix(
        `name: ${style}\n  false\non: push\njobs: {}`,
        config,
        { filename: '.github/workflows/ci.yml' },
      )
      expect(result.fixed).toBe(true)
      expect(result.messages).toEqual([])
      expect(getStaticYAMLValue(parseYAML(result.output))).toMatchObject({
        name: 'False',
      })
      expect(
        linter.verifyAndFix(result.output, config, {
          filename: '.github/workflows/ci.yml',
        }).fixed,
      ).toBe(false)
    },
  )

  it('checks anchored parallel steps through the built plugin', () => {
    const linter = new Linter()
    const messages = linter.verify(
      $`
        name: CI
        on: push
        cache-mode: read-only
        jobs:
          test: &test
            runs-on: ubuntu-latest
            snapshot: test-image
            cache-mode: read-write
            timeout-minutes: \${{ matrix.timeout }}
            steps:
              - parallel:
                  - uses: &uses actions/checkout@main
                    timeout-minutes: 0
                    invalid: true
                  - uses: *uses
      `,
      [
        ...configs.recommended,
        { rules: { 'github-action/no-unpinned-uses': 'error' } },
      ],
      { filename: '.github/workflows/ci.yml' },
    )
    expect(messages.map(message => message.messageId)).toEqual([
      'disallowUnpinnedUses',
      'notInteger',
      'invalidStepKey',
      'disallowUnpinnedUses',
    ])
  })

  it('should lint without error', async () => {
    const files = await glob('.github/workflows/*.{yml,yaml}', {
      cwd: TEST_CWD,
      onlyFiles: true,
    })
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: [...configs.recommended],
      cwd: TEST_CWD,
      ignore: false,
    })
    const results = await eslint.lintFiles(files)

    expect(results.length).toBe(files.length)

    results.forEach((result, idx) => {
      expect(result.messages).toMatchSnapshot(files[idx])
    })
  })

  it('should access plugin through getter', () => {
    const plugins = configs.recommended[0].plugins ?? {}

    expect(plugins).toBeDefined()
    expect(plugins).toHaveProperty('github-action')

    const githubActionPlugin = plugins['github-action']
    expect(githubActionPlugin).toBe(plugin)
  })
})
