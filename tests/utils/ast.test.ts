import { describe, expect, it } from 'vitest'
import { parseYAML } from 'yaml-eslint-parser'
import {
  findYAMLPair,
  getPairKeyValue,
  getYAMLScalarValue,
  hasExternalYAMLAlias,
  isYAMLMapping,
  isYAMLScalar,
  isYAMLSequence,
  resolveYAMLNode,
} from '../../src/utils/ast'

function parseMapping(code: string) {
  const node = resolveYAMLNode(parseYAML(code).body[0].content)
  if (!isYAMLMapping(node)) {
    throw new Error('Expected a YAML mapping')
  }
  return node
}

function parsePair(code: string, key = 'value') {
  const pair = findYAMLPair(parseMapping(code), key)
  if (!pair) {
    throw new Error(`Expected a YAML pair named ${key}`)
  }
  return pair
}

describe('YAML type guards', () => {
  it.each([
    { code: '', scalar: false, mapping: false, sequence: false },
    { code: 'text', scalar: true, mapping: false, sequence: false },
    { code: '{}', scalar: false, mapping: true, sequence: false },
    { code: '[]', scalar: false, mapping: false, sequence: true },
  ])('identifies parsed content: $code', testCase => {
    const node = parseYAML(testCase.code).body[0].content
    expect(isYAMLScalar(node)).toBe(testCase.scalar)
    expect(isYAMLMapping(node)).toBe(testCase.mapping)
    expect(isYAMLSequence(node)).toBe(testCase.sequence)
  })
})

describe('getPairKeyValue', () => {
  it.each([
    { code: 'name: CI', key: 'name' },
    { code: '!!str false: CI', key: 'false' },
    { code: 'false: CI', key: undefined },
    { code: '1: CI', key: undefined },
    { code: 'null: CI', key: undefined },
    { code: "'': CI", key: undefined },
    { code: '? [name]\n: CI', key: undefined },
    { code: '? |\n\n: CI', key: undefined },
  ])('reads only effective non-empty string keys: $code', ({ code, key }) => {
    expect(getPairKeyValue(parseMapping(code).pairs[0])).toBe(key)
  })

  it('resolves aliased keys', () => {
    const node = parseMapping('first: &key name\n? *key\n: CI')
    expect(getPairKeyValue(node.pairs[1])).toBe('name')
  })
})

describe('findYAMLPair', () => {
  it('returns the first effective matching key without resolving its value', () => {
    const node = parseMapping(
      'first: &key name\n? *key\n: &value CI\n!!str name: other',
    )
    expect(findYAMLPair(node, 'name')).toBe(node.pairs[1])
    expect(findYAMLPair(node, 'name')?.value?.type).toBe('YAMLWithMeta')
  })

  it('returns undefined for an absent key', () => {
    expect(findYAMLPair(parseMapping('name: CI'), 'missing')).toBeUndefined()
  })
})

describe('resolveYAMLNode', () => {
  it.each(['value:', 'value: &empty', 'value: *missing'])(
    'returns null for an empty or unresolved value: %s',
    code => {
      expect(resolveYAMLNode(parsePair(code).value)).toBeNull()
    },
  )

  it('preserves the identity and range of unwrapped nodes', () => {
    const plain = parsePair('value: CI').value
    expect(resolveYAMLNode(plain)).toBe(plain)

    const wrapped = parsePair('value: &name !!str false').value
    if (wrapped?.type !== 'YAMLWithMeta') {
      throw new Error('Expected YAML metadata')
    }
    expect(resolveYAMLNode(wrapped)).toBe(wrapped.value)
    expect(resolveYAMLNode(wrapped)?.range).toEqual(wrapped.value?.range)
  })

  it('resolves the nearest preceding anchor to its original node', () => {
    const node = parseMapping(
      'first: &name first\nvalue: *name\nsecond: &name second\ncopy: *name',
    )
    expect(resolveYAMLNode(node.pairs[1].value)).toBe(
      resolveYAMLNode(node.pairs[0].value),
    )
    expect(resolveYAMLNode(node.pairs[3].value)).toBe(
      resolveYAMLNode(node.pairs[2].value),
    )
  })

  it.each(['constructor', 'toString', '__proto__'])(
    'does not resolve inherited anchor names: %s',
    name => {
      expect(resolveYAMLNode(parsePair(`value: *${name}`).value)).toBeNull()
    },
  )

  it('does not resolve a later anchor or an anchor from another document', () => {
    expect(
      resolveYAMLNode(parsePair('value: *name\nlater: &name CI').value),
    ).toBeNull()

    const documents = parseYAML('value: &name CI\n---\nvalue: *name').body
    const node = documents[1].content
    if (!isYAMLMapping(node)) {
      throw new Error('Expected a YAML mapping')
    }
    expect(resolveYAMLNode(node.pairs[0].value)).toBeNull()
  })
})

describe('getYAMLScalarValue', () => {
  it.each([
    { source: 'false', value: false },
    { source: '!!str false', value: 'false' },
    { source: '!!int "10"', value: 10 },
    { source: '!!str 10', value: '10' },
    { source: '!!bool "true"', value: true },
    { source: '&name !!str false', value: 'false' },
  ])('preserves explicit tag semantics: $source', ({ source, value }) => {
    const node = resolveYAMLNode(parsePair(`value: ${source}`).value)
    if (!isYAMLScalar(node)) {
      throw new Error('Expected a YAML scalar')
    }
    expect(getYAMLScalarValue(node)).toBe(value)
  })
})

describe('hasExternalYAMLAlias', () => {
  it.each([
    { code: 'value: &name CI\ncopy: *name', external: true },
    { code: 'value: { nested: &name CI }\ncopy: *name', external: true },
    { code: '&root\nvalue: CI\ncopy: *root', external: true },
    { code: 'value: [&name CI, *name]', external: false },
    { code: 'value: &name CI', external: false },
    {
      code: 'value: &name CI\nother: &name other\ncopy: *name',
      external: false,
    },
    { code: 'value: CI\ncopy: *missing', external: false },
    { code: 'value: &name CI\n---\ncopy: *name', external: false },
  ])(
    'detects references outside the edited pair: $code',
    ({ code, external }) => {
      expect(hasExternalYAMLAlias(parsePair(code))).toBe(external)
    },
  )
})
