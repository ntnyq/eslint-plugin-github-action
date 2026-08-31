/**
 * Mock YAML AST nodes.
 */

import type { YAMLAst } from '../../../src/types/yaml'

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
  locAndRange,

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
