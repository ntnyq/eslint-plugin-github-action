import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { run as _run } from 'eslint-vitest-rule-tester'
import * as yamlParser from 'yaml-eslint-parser'
import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const resolve = (...args: string[]) => path.resolve(__dirname, '..', ...args)

export function run(options: TestCasesOptions & RuleTesterInitOptions) {
  return _run({
    languageOptions: {
      parser: yamlParser,
    },
    ...options,
  })
}

export { unindent as $ } from 'eslint-vitest-rule-tester'
