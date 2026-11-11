import { describe, expect, it } from 'vitest'
import { configs, plugin } from '../../src'

describe('configs', () => {
  it('should have recommended config', () => {
    expect(configs.recommended).toBeDefined()
    expect(Array.isArray(configs.recommended)).toBe(true)
    expect(configs.recommended.length).toBeGreaterThan(0)
  })

  it('should have correct structure', () => {
    const config = configs.recommended[0]
    expect(config.name).toBe('github-action/recommended')
    expect(config.files).toEqual(['**/.github/workflows/*.y?(a)ml'])
    expect(config.plugins).toBeDefined()
    expect(config.languageOptions).toBeDefined()
    expect(config.rules).toBeDefined()
  })

  it('uses the exported plugin instance', () => {
    expect(configs.recommended[0].plugins?.['github-action']).toBe(plugin)
  })
})
