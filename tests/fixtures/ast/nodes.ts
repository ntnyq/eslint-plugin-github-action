/**
 * Mock YAML AST nodes.
 */

import { YAMLAst, YAMLToken } from '../../../src/types/yaml'

const locAndRange: YAMLAst.Locations = {
  loc: {
    start: {
      line: 0,
      column: 0,
    },
    end: {
      line: 0,
      column: 0,
    },
  },
  range: [0, 0],
}

const invalid: YAMLToken = {
  type: 'String',
  value: 'FooBar',
  ...locAndRange,
}

const program: YAMLAst.YAMLProgram = {
  type: 'Program',
  body: [],
  sourceType: 'module',
  comments: [],
  tokens: [],
  parent: null,
  ...locAndRange,
}

const document: YAMLAst.YAMLDocument = {
  type: 'YAMLDocument',
  directives: [],
  content: null,
  parent: program,
  anchors: {},
  version: '1.2',
  ...locAndRange,
}

/**
 * Comment
 */
const blockComment: YAMLAst.Comment = {
  type: 'Block',
  value: '',
  ...locAndRange,
}
const lineComment: YAMLAst.Comment = {
  type: 'Line',
  value: '',
  ...locAndRange,
}

/**
 * Punctuation
 */
const question: YAMLAst.Token = {
  type: 'Punctuator',
  value: '?',
  ...locAndRange,
}
const hyphen: YAMLAst.Token = {
  type: 'Punctuator',
  value: '-',
  ...locAndRange,
}
const comma: YAMLAst.Token = {
  type: 'Punctuator',
  value: ',',
  ...locAndRange,
}
const colon: YAMLAst.Token = {
  type: 'Punctuator',
  value: ':',
  ...locAndRange,
}
const openingBracket: YAMLAst.Token = {
  type: 'Punctuator',
  value: '[',
  ...locAndRange,
}
const closingBracket: YAMLAst.Token = {
  type: 'Punctuator',
  value: ']',
  ...locAndRange,
}
const openingBrace: YAMLAst.Token = {
  type: 'Punctuator',
  value: '{',
  ...locAndRange,
}
const closingBrace: YAMLAst.Token = {
  type: 'Punctuator',
  value: '}',
  ...locAndRange,
}

const mapping: YAMLAst.YAMLMapping = {
  type: 'YAMLMapping',
  style: 'block',
  pairs: [],
  parent: document,
  ...locAndRange,
}

const sequence: YAMLAst.YAMLSequence = {
  type: 'YAMLSequence',
  style: 'block',
  entries: [],
  parent: document,
  ...locAndRange,
}

export const content: YAMLAst.YAMLContent = {
  type: 'YAMLScalar',
  style: 'plain',
  strValue: '',
  value: '',
  raw: '',
  parent: document,
  ...locAndRange,
}

export const blockLiteralScalar: YAMLAst.YAMLBlockLiteralScalar = {
  type: 'YAMLScalar',
  style: 'literal',
  chomping: 'clip',
  indent: null,
  value: '',
  parent: document,
  ...locAndRange,
}

const pair: YAMLAst.YAMLPair = {
  type: 'YAMLPair',
  key: content,
  value: content,
  parent: mapping,
  ...locAndRange,
}

const pairWithMappingKey: YAMLAst.YAMLPair = {
  type: 'YAMLPair',
  key: mapping,
  value: content,
  parent: mapping,
  ...locAndRange,
}

const pairWithBlockLiteralScalarKey: YAMLAst.YAMLPair = {
  type: 'YAMLPair',
  key: blockLiteralScalar,
  value: content,
  parent: mapping,
  ...locAndRange,
}

export const YAML_NODES = {
  invalid,

  locAndRange,

  blockComment,
  lineComment,

  question,
  hyphen,
  comma,
  colon,
  openingBracket,
  closingBracket,
  openingBrace,
  closingBrace,

  program,
  document,
  mapping,
  sequence,
  content,

  blockLiteralScalar,

  pair,
  pairWithMappingKey,
  pairWithBlockLiteralScalarKey,
}
