import { describe, expect, it } from 'vitest'
import { getPairKeyValue, isSingleExpression } from '../../src/utils/action'
import { YAML_NODES } from '../fixtures/ast/nodes'

describe('getPairKeyValue', () => {
  it('should pass', () => {
    expect(getPairKeyValue(YAML_NODES.pairWithMappingKey)).toBeUndefined()
    expect(
      getPairKeyValue(YAML_NODES.pairWithBlockLiteralScalarKey),
    ).toBeUndefined()
  })
})

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
