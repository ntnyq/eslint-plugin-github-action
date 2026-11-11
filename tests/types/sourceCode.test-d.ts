import { expectTypeOf, it } from 'vitest'
import type { SourceCode } from '../../src/types/sourceCode'
import type { YAMLAst } from '../../src/types/yaml'

declare const sourceCode: SourceCode

it('allows missing first and last tokens without options', () => {
  expectTypeOf(
    sourceCode.getFirstToken(sourceCode.ast),
  ).toEqualTypeOf<YAMLAst.Token | null>()
  expectTypeOf(
    sourceCode.getLastToken(sourceCode.ast),
  ).toEqualTypeOf<YAMLAst.Token | null>()
})

it('allows comments and missing tokens when options are provided', () => {
  expectTypeOf(
    sourceCode.getFirstToken(sourceCode.ast, { includeComments: true }),
  ).toEqualTypeOf<YAMLAst.Comment | YAMLAst.Token | null>()
  expectTypeOf(
    sourceCode.getLastToken(sourceCode.ast, { includeComments: true }),
  ).toEqualTypeOf<YAMLAst.Comment | YAMLAst.Token | null>()
})

it('does not expose the removed getComments method', () => {
  expectTypeOf<SourceCode>().not.toHaveProperty('getComments')
})
