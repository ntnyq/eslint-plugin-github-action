import { expectTypeOf, it } from 'vitest'
import type { Rule } from 'eslint'
import type { ReportDescriptor } from '../../src/types/eslint'

type ReportWithSuggestion<Suggestion> = {
  loc: { column: number; line: number }
  messageId: 'known'
  suggest: Suggestion[]
}

it('accepts suggestions with a declared message ID', () => {
  expectTypeOf<
    ReportWithSuggestion<{ fix: Rule.ReportFixer; messageId: 'suggested' }>
  >().toExtend<ReportDescriptor<'known' | 'suggested'>>()
})

it('rejects suggestions with an undeclared message ID', () => {
  expectTypeOf<
    ReportWithSuggestion<{ fix: Rule.ReportFixer; messageId: 'unknown' }>
  >().not.toExtend<ReportDescriptor<'known' | 'suggested'>>()
})

it('preserves suggestions with a literal description', () => {
  expectTypeOf<
    ReportWithSuggestion<{
      data: { name: string }
      desc: string
      fix: Rule.ReportFixer
    }>
  >().toExtend<ReportDescriptor<'known'>>()
})

it('requires suggestions to provide a fix', () => {
  expectTypeOf<ReportWithSuggestion<{ messageId: 'known' }>>().not.toExtend<
    ReportDescriptor<'known'>
  >()
})
