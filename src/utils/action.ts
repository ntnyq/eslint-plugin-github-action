/**
 * @file utils for GitHub action
 */

import { isNonEmptyString } from '@ntnyq/utils'
import { isYAMLScalar, resolveYAMLNode } from './ast'
import type { YAMLAst } from '../types/yaml'

/**
 * Get `key` value of YAMLPair.
 *
 * @param pair - YAMLPair
 * @returns - `key` value of YAMLPair or `undefined`
 */
export function getPairKeyValue(pair: YAMLAst.YAMLPair) {
  const key = resolveYAMLNode(pair.key)
  if (!isYAMLScalar(key) || !isNonEmptyString(key.value)) {
    return
  }
  return key.value
}

/**
 * Checks whether a value consists of one complete GitHub Actions expression.
 * Quoted expression strings may contain closing delimiters and escaped quotes.
 *
 * @param value - String to inspect without evaluating its expression.
 * @returns Whether there is a non-empty expression with no surrounding text.
 */
export function isSingleExpression(value: string): boolean {
  const source = value.trim()
  if (!source.startsWith('${{')) {
    return false
  }
  let inString = false
  for (let index = 3; index < source.length; index++) {
    if (source[index] === "'") {
      if (inString && source[index + 1] === "'") {
        index++
      } else {
        inString = !inString
      }
    } else if (!inString && source.startsWith('}}', index)) {
      return (
        source.slice(3, index).trim().length > 0 && index + 2 === source.length
      )
    }
  }
  return false
}
