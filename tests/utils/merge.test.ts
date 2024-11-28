import { describe, expect, it } from 'vitest'
import { deepMerge, isObjectNotArray } from '../../src/utils/merge'

describe('deepMerge', () => {
  it('should merge two objects', () => {
    const obj1 = {
      a: 1,
      b: {
        c: 2,
        d: 3,
      },
    }
    const obj2 = {
      b: {
        c: 3,
        e: 4,
      },
      f: 5,
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      a: 1,
      b: {
        c: 3,
        d: 3,
        e: 4,
      },
      f: 5,
    })
  })

  it('should merge object with array', () => {
    const obj1 = {
      a: 1,
      b: [1, 2, 3],
    }
    const obj2 = {
      b: [3, 4, 5],
      c: 2,
    }
    const result = deepMerge(obj1, obj2)
    expect(result).toEqual({
      a: 1,
      b: [3, 4, 5],
      c: 2,
    })
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
