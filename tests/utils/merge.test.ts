import { describe, expect, it } from 'vitest'
import { deepMerge, isObjectNotArray } from '../../src/utils/merge'

describe('deepMerge', () => {
  const OBJECT_DEEP = {
    a: 1,
    b: {
      c: 2,
      d: 3,
    },
  }
  const OBJECT_SHALLOW = {
    b: {
      c: 3,
      e: 4,
    },
    f: 5,
  }
  const OBJECT_ARRAY = {
    b: [3, 4, 5],
    c: 2,
  }
  it('should merge two objects', () => {
    expect(deepMerge(OBJECT_DEEP, OBJECT_SHALLOW)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": {
          "c": 3,
          "d": 3,
          "e": 4,
        },
        "f": 5,
      }
    `)
  })

  it('should merge object with array', () => {
    expect(deepMerge(OBJECT_DEEP, OBJECT_ARRAY)).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": [
          3,
          4,
          5,
        ],
        "c": 2,
      }
    `)
  })

  it('should merge with first empty', () => {
    expect(deepMerge({}, OBJECT_SHALLOW)).toMatchInlineSnapshot(`
      {
        "b": {
          "c": 3,
          "e": 4,
        },
        "f": 5,
      }
    `)
  })

  it('should merge with second empty', () => {
    expect(deepMerge(OBJECT_DEEP, {})).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": {
          "c": 2,
          "d": 3,
        },
      }
    `)
  })
})

describe('isObjectNotArray', () => {
  it('should return true for an object', () => {
    expect(isObjectNotArray({})).toBeTruthy()
  })
  it('should return false for an array', () => {
    expect(isObjectNotArray([])).toBeFalsy()
  })
})
