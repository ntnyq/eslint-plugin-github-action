import { describe, expect, it } from 'vitest'
import {
  isYAMLMapping,
  isYAMLScalar,
  isYAMLSequence,
} from '../../src/utils/ast'
import { YAML_NODES } from '../fixtures/ast/nodes'

describe('isYAMLScalar', () => {
  it('should return false for null', () => {
    expect(isYAMLScalar(null)).toBeFalsy()
  })
})

describe('isYAMLMapping', () => {
  it('should return false for null', () => {
    expect(isYAMLMapping(null)).toBeFalsy()
  })
})

describe('isYAMLSequence', () => {
  it('should return false for null', () => {
    expect(isYAMLSequence(null)).toBeFalsy()
  })

  it('should return true for sequence', () => {
    expect(isYAMLSequence(YAML_NODES.sequence)).toBeTruthy()
  })
})
