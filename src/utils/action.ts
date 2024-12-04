/**
 * @file utils for GitHub action
 */

import { isNonEmptyString } from '@ntnyq/utils'
import { isYAMLScalar } from './ast'
import type { YAMLAst } from '../types/yaml'

/**
 * Get `key` value of YAMLPair.
 *
 * @param pair - YAMLPair
 * @returns - `key` value of YAMLPair or `undefined`
 */
export function getPairKeyValue(pair: YAMLAst.YAMLPair) {
  if (!isYAMLScalar(pair.key)) return
  if (!isNonEmptyString(pair.key.value)) return
  return pair.key.value
}
