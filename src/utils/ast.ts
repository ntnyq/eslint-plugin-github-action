/**
 * @file Utils for YAML AST
 *
 * @see {@link https://github.com/ota-meshi/yaml-eslint-parser/blob/master/docs/AST.md}
 * @copyright {@link https://github.com/ota-meshi/eslint-plugin-yml/blob/master/src/utils/ast-utils.ts}
 */

import type { YAMLAst } from '../types/yaml'

/**
 * Checks if the given value is a YAMLScalar.
 * @param value - The value to check.
 * @returns Whether the given value is a YAMLScalar.
 */
export function isYAMLScalar(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLScalar {
  return value?.type === 'YAMLScalar'
}

/**
 * Checks if the given value is a YAMLMapping.
 * @param value - The value to check.
 * @returns Whether the given value is a YAMLMapping.
 */
export function isYAMLMapping(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLMapping {
  return value?.type === 'YAMLMapping'
}

/**
 * Checks if the given value is a YAMLSequence.
 * @param value - The value to check.
 * @returns Whether the given value is a YAMLSequence.
 */
export function isYAMLSequence(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLSequence {
  return value?.type === 'YAMLSequence'
}
