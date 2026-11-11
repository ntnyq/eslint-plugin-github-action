import { describe, expect, it } from 'vitest'
import { createESLintRule } from '../../src/utils/createRule'
import type { Rule } from 'eslint'

describe('createRule', () => {
  it.each([
    { defaults: undefined, configured: [], expected: [] },
    { defaults: [42], configured: [], expected: [42] },
    { defaults: [42], configured: [0], expected: [0] },
    { defaults: [true], configured: [false], expected: [false] },
    { defaults: ['default'], configured: [''], expected: [''] },
    { defaults: [42], configured: [undefined], expected: [42] },
    { defaults: [42], configured: [null], expected: [42] },
    { defaults: undefined, configured: ['custom'], expected: ['custom'] },
    { defaults: [1, true], configured: [2], expected: [2, true] },
    { defaults: [1], configured: [2, false], expected: [2, false] },
    {
      defaults: [{ nested: { min: 1, max: 10 }, labels: ['default'] }],
      configured: [{ nested: { max: 5 }, labels: ['custom'] }],
      expected: [{ nested: { min: 1, max: 5 }, labels: ['custom'] }],
    },
  ])(
    'resolves options without mutating inputs: %j',
    ({ defaults, configured, expected }) => {
      const originalDefaults = structuredClone(defaults)
      const originalConfigured = structuredClone(configured)
      const rule = createESLintRule<unknown[], 'testMessage'>({
        name: 'test-options',
        meta: {
          type: 'suggestion',
          docs: { description: 'Test resolved rule options' },
          schema: [],
          defaultOptions: defaults,
          messages: { testMessage: 'Test message' },
        },
        create(context, options) {
          expect(options).toEqual(expected)
          return {}
        },
      })

      rule.create({ options: configured } as unknown as Rule.RuleContext)

      expect(defaults).toEqual(originalDefaults)
      expect(configured).toEqual(originalConfigured)
    },
  )

  it('should merge object options with object defaults', () => {
    type TestOptions = [{ max?: number; min?: number }]
    type TestMessageIds = 'testMessage'

    const testRule = createESLintRule<TestOptions, TestMessageIds>({
      name: 'test-rule',
      meta: {
        type: 'suggestion',
        docs: {
          recommended: false,
          description: 'Test rule for coverage',
        },
        messages: {
          testMessage: 'Test message',
        },
        defaultOptions: [{ max: 100, min: 0 }],
        schema: [],
      },
      create(context, options) {
        // Verify that options were merged correctly
        expect(options[0]).toEqual({ max: 50, min: 0 })
        return {}
      },
    })

    // Simulate ESLint calling the rule with partial options
    const mockContext = {
      options: [{ max: 50 }],
    } as unknown as Rule.RuleContext

    // Call the create function
    testRule.create(mockContext)
  })

  it('should use default options when context options is empty', () => {
    type TestOptions = [number]
    type TestMessageIds = 'testMessage'

    const testRule = createESLintRule<TestOptions, TestMessageIds>({
      name: 'test-rule-number',
      meta: {
        type: 'suggestion',
        docs: {
          recommended: false,
          description: 'Test rule for coverage',
        },
        messages: {
          testMessage: 'Test message',
        },
        schema: [],
        defaultOptions: [42],
      },
      create(context, options) {
        expect(options[0]).toBe(42)
        return {}
      },
    })

    const mockContext = {
      options: [],
    } as unknown as Rule.RuleContext

    testRule.create(mockContext)
  })

  it('should use context options when provided', () => {
    type TestOptions = [string]
    type TestMessageIds = 'testMessage'

    const testRule = createESLintRule<TestOptions, TestMessageIds>({
      name: 'test-rule-string',
      meta: {
        type: 'suggestion',
        docs: {
          recommended: false,
          description: 'Test rule for coverage',
        },
        messages: {
          testMessage: 'Test message',
        },
        schema: [],
        defaultOptions: ['default'],
      },
      create(context, options) {
        expect(options[0]).toBe('custom')
        return {}
      },
    })

    const mockContext = {
      options: ['custom'],
    } as unknown as Rule.RuleContext

    testRule.create(mockContext)
  })
})
