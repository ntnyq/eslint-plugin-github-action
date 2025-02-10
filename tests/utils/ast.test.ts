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
  isTokenOnSameLine,
  isYAMLComment,
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

describe('isYAMLComment', () => {
  it('should return false for null', () => {
    expect(isYAMLComment(null)).toBeFalsy()
  })

  it('should return true for comment', () => {
    expect(isYAMLComment(YAML_NODES.blockComment)).toBeTruthy()
    expect(isYAMLComment(YAML_NODES.lineComment)).toBeTruthy()
  })
})

describe('isQuestion', () => {
  it('should return false for null', () => {
    expect(isQuestion(null)).toBeFalsy()
  })

  it('should return true for question', () => {
    expect(isQuestion(YAML_NODES.question)).toBeTruthy()
  })
})

describe('isHyphen', () => {
  it('should return false for null', () => {
    expect(isHyphen(null)).toBeFalsy()
  })

  it('should return true for hyphen', () => {
    expect(isHyphen(YAML_NODES.hyphen)).toBeTruthy()
  })
})

describe('isComma', () => {
  it('should return false for null', () => {
    expect(isComma(null)).toBeFalsy()
  })

  it('should return true for comma', () => {
    expect(isComma(YAML_NODES.comma)).toBeTruthy()
  })
})

describe('isColon', () => {
  it('should return false for null', () => {
    expect(isColon(null)).toBeFalsy()
  })

  it('should return true for colon', () => {
    expect(isColon(YAML_NODES.colon)).toBeTruthy()
  })
})

describe('isOpeningBracketToken', () => {
  it('should return false for null', () => {
    expect(isOpeningBracketToken(null)).toBeFalsy()
  })

  it('should return true for opening bracket token', () => {
    expect(isOpeningBracketToken(YAML_NODES.openingBracket)).toBeTruthy()
  })
})

describe('isClosingBracketToken', () => {
  it('should return false for null', () => {
    expect(isClosingBracketToken(null)).toBeFalsy()
  })

  it('should return true for closing bracket token', () => {
    expect(isClosingBracketToken(YAML_NODES.closingBracket)).toBeTruthy()
  })
})

describe('isOpeningBraceToken', () => {
  it('should return false for null', () => {
    expect(isOpeningBraceToken(null)).toBeFalsy()
  })

  it('should return true for opening brace token', () => {
    expect(isOpeningBraceToken(YAML_NODES.openingBrace)).toBeTruthy()
  })
})

describe('isClosingBraceToken', () => {
  it('should return false for null', () => {
    expect(isClosingBraceToken(null)).toBeFalsy()
  })

  it('should return true for closing brace token', () => {
    expect(isClosingBraceToken(YAML_NODES.closingBrace)).toBeTruthy()
  })
})

describe('isTokenOnSameLine', () => {
  it('should return false for null', () => {
    expect(
      isTokenOnSameLine(YAML_NODES.invalid, YAML_NODES.invalid),
    ).toBeTruthy()
  })
})
