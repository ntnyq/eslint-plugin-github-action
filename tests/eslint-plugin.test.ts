import { ESLint } from 'eslint'
import { configs, plugin } from 'eslint-plugin-github-action'
import { glob } from 'tinyglobby'
import { describe, expect, it } from 'vitest'
import { resolve } from '../scripts/utils'

const TEST_CWD = resolve('tests/fixtures/eslint-plugin')

describe('eslint-plugin', () => {
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

    // Explicitly access the getter to trigger line 18
    const githubActionPlugin = plugins['github-action']
    expect(githubActionPlugin).toBe(plugin)
  })
})
