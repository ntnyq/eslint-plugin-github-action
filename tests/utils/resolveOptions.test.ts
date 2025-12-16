import { describe, expect, it } from 'vitest'
import { resolveOptions } from '../../src/utils/resolveOptions'

describe('resolveOptions', () => {
  it('should return options[0] when options is provided', () => {
    const options: [string] = ['test-value']
    const defaultOptions = 'default-value'
    expect(resolveOptions(options, defaultOptions)).toBe('test-value')
  })

  it('should return defaultOptions when options is undefined', () => {
    const defaultOptions = 'default-value'
    expect(resolveOptions(undefined, defaultOptions)).toBe('default-value')
  })

  it('should return defaultOptions when options[0] is falsy', () => {
    const options: [string | undefined] = [undefined]
    const defaultOptions = 'default-value'
    expect(resolveOptions(options, defaultOptions)).toBe('default-value')
  })

  it('should work with object options', () => {
    const options: [{ key: string }] = [{ key: 'value' }]
    const defaultOptions = { key: 'default' }
    expect(resolveOptions(options, defaultOptions)).toEqual({ key: 'value' })
  })

  it('should return undefined when both options and defaultOptions are undefined', () => {
    expect(resolveOptions(undefined, undefined)).toBeUndefined()
  })
})
