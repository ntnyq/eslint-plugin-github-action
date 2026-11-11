import { describe, expect, it } from 'vitest'
import { isSingleExpression } from '../../src/utils/expression'

describe('isSingleExpression', () => {
  it.each([
    `\${{ matrix.timeout }}`,
    ` \${{ fromJSON(vars.TIMEOUT) }}\n`,
    `\${{ '}}' }}`,
    `\${{ 'it''s }}' }}`,
    `\${{ '' }}`,
    `\${{ 'a' == 'b' }}`,
  ])('accepts a single expression: %s', value => {
    expect(isSingleExpression(value)).toBe(true)
  })

  it.each([
    '',
    '20',
    `prefix\${{ 1 }}`,
    `\${{ 1 }}suffix`,
    `\${{ 1 }}suffix\${{ 2 }}`,
    `\${{ 1 }}\${{ 2 }}`,
    `\${{ }}`,
    `\${{}}`,
    `\${{ 1`,
    `\${{ 'unclosed }}`,
    `\${{ '}}'`,
    `\${{ 'it''s'`,
  ])('rejects incomplete expressions or surrounding text: %s', value => {
    expect(isSingleExpression(value)).toBe(false)
  })
})
