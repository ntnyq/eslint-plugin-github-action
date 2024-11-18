import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'
import { resolve } from './internal'

const TEST_CWD = resolve('tests/fixtures/integrations/eslint-plugin')

describe('Integration test', () => {
  it('should lint without errors', async () => {
    const eslint = new ESLint({ cwd: TEST_CWD })
    const files = [
      '.github/workflows/valid.yml',
      '.github/workflows/invalid.yml',
      '.github/workflows/valid.yaml',
      '.github/workflows/invalid.yaml',
    ]
    const results: ESLint.LintResult[] = await eslint.lintFiles(files)

    expect(results.length).toBe(files.length)

    results.forEach(result => {
      expect(result.messages).toMatchSnapshot()
    })
  })
})
