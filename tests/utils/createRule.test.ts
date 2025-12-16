import { describe, expect, it } from 'vitest'
import { createESLintRule } from '../../src/utils/createRule'
import type { RuleContext } from '../../src/types/eslint'

describe('createRule', () => {
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
        schema: [],
      },
      defaultOptions: [{ max: 100, min: 0 }],
      create(context, options) {
        // Verify that options were merged correctly
        expect(options[0]).toEqual({ max: 50, min: 0 })
        return {}
      },
    })

    // Simulate ESLint calling the rule with partial options
    const mockContext = {
      options: [{ max: 50 }],
    } as unknown as RuleContext<TestMessageIds, TestOptions>

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
      },
      defaultOptions: [42],
      create(context, options) {
        expect(options[0]).toBe(42)
        return {}
      },
    })

    const mockContext = {
      options: [],
    } as unknown as RuleContext<TestMessageIds, TestOptions>

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
      },
      defaultOptions: ['default'],
      create(context, options) {
        expect(options[0]).toBe('custom')
        return {}
      },
    })

    const mockContext = {
      options: ['custom'],
    } as unknown as RuleContext<TestMessageIds, TestOptions>

    testRule.create(mockContext)
  })
})
