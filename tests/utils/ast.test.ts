import { describe, expect, it } from 'vitest'
import {
  isClosingBraceToken,
  isClosingBracketToken,
  isColon,
  isComma,
  isHyphen,
  isOpeningBraceToken,
  isOpeningBracketToken,
  isQuestion,
  isYAMLComment,
  isYAMLMapping,
  isYAMLScalar,
} from '../../src/utils/ast'

describe('isYAMLScalar', () => {
  it('should return false for null', () => {
    expect(isYAMLScalar(null)).toBeFalsy()
  })
})

describe('isYAMLComment', () => {
  it('should return false for null', () => {
    expect(isYAMLComment(null)).toBeFalsy()
  })
})

describe('isYAMLMapping', () => {
  it('should return false for null', () => {
    expect(isYAMLMapping(null)).toBeFalsy()
  })
})

describe('isQuestion', () => {
  it('should return false for null', () => {
    expect(isQuestion(null)).toBeFalsy()
  })
})

describe('isHyphen', () => {
  it('should return false for null', () => {
    expect(isHyphen(null)).toBeFalsy()
  })
})

describe('isComma', () => {
  it('should return false for null', () => {
    expect(isComma(null)).toBeFalsy()
  })
})

describe('isColon', () => {
  it('should return false for null', () => {
    expect(isColon(null)).toBeFalsy()
  })
})

describe('isOpeningBracketToken', () => {
  it('should return false for null', () => {
    expect(isOpeningBracketToken(null)).toBeFalsy()
  })
})

describe('isClosingBracketToken', () => {
  it('should return false for null', () => {
    expect(isClosingBracketToken(null)).toBeFalsy()
  })
})

describe('isOpeningBraceToken', () => {
  it('should return false for null', () => {
    expect(isOpeningBraceToken(null)).toBeFalsy()
  })
})

describe('isClosingBraceToken', () => {
  it('should return false for null', () => {
    expect(isClosingBraceToken(null)).toBeFalsy()
  })
})