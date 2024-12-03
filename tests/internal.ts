import { run as _run } from 'eslint-vitest-rule-tester'
import * as yamlParser from 'yaml-eslint-parser'
import type { RuleTesterInitOptions, TestCasesOptions } from 'eslint-vitest-rule-tester'

export function run(options: TestCasesOptions & RuleTesterInitOptions) {
  return _run({
    languageOptions: {
      parser: yamlParser,
    },
    ...options,
  })
}

export { unindent as $, unindent } from 'eslint-vitest-rule-tester'
