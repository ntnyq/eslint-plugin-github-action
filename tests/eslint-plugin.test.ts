import { ESLint } from 'eslint'
import { configs } from 'eslint-plugin-github-action'
import { glob } from 'tinyglobby'
import { expect, it } from 'vitest'
import { resolve } from '../scripts/utils'

const TEST_CWD = resolve('tests/fixtures/eslint-plugin')

it('should lint without error', async () => {
  const files = await glob('.github/workflows/*.{yml,yaml}', { cwd: TEST_CWD, onlyFiles: true })
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [...configs.recommended],
    cwd: TEST_CWD,
    ignore: false,
  })
  const results: ESLint.LintResult[] = await eslint.lintFiles(files)

  expect(results.length).toBe(files.length)

  results.forEach((result, idx) => {
    expect(result.messages).toMatchSnapshot(files[idx])
  })
})
