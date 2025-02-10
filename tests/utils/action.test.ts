import { describe, expect, it } from 'vitest'
import { getPairKeyValue } from '../../src/utils/action'
import { YAML_NODES } from '../fixtures/ast/nodes'

describe('getPairKeyValue', () => {
  it('should pass', () => {
    expect(getPairKeyValue(YAML_NODES.pairWithMappingKey)).toBeUndefined()
    expect(
      getPairKeyValue(YAML_NODES.pairWithBlockLiteralScalarKey),
    ).toBeUndefined()
  })
})
