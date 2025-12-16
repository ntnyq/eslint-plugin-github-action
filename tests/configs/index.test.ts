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

  it('should access plugin through getter', () => {
    const config = configs.recommended[0]
    const plugins = config.plugins!

    // This should trigger the getter
    const keys = Object.keys(plugins)
    expect(keys).toContain('github-action')

    // Direct property access
    const prop = Object.getOwnPropertyDescriptor(plugins, 'github-action')
    expect(prop).toBeDefined()
    expect(prop?.get).toBeDefined()

    // Actual getter invocation
    const githubActionPlugin = (plugins as Record<string, unknown>)[
      'github-action'
    ]
    expect(githubActionPlugin).toBe(plugin)
  })
})
