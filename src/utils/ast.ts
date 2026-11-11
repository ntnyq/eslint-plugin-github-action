/**
 * @file Utils for YAML AST
 *
 * @see {@link https://github.com/ota-meshi/yaml-eslint-parser/blob/master/docs/AST.md}
 * @copyright {@link https://github.com/ota-meshi/eslint-plugin-yml/blob/master/src/utils/ast-utils.ts}
 */

import type { YAMLAst } from '../types/yaml'

/**
 * Unwraps metadata and resolves aliases using the nearest preceding anchor in
 * the same document. Empty values and unresolved aliases return null.
 *
 * @param node - YAML content, metadata wrapper, alias, or empty value.
 * @returns Resolved content without changing its source location.
 */
export function resolveYAMLNode(
  node: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): YAMLAst.YAMLContent | null {
  if (node?.type === 'YAMLWithMeta') {
    return node.value
  }
  if (node?.type === 'YAMLAlias') {
    let parent: YAMLAst.YAMLNode = node.parent
    while (parent.type !== 'YAMLDocument') {
      parent = parent.parent
    }
    const anchor = parent.anchors[node.name]?.findLast(
      anchor => anchor.range[0] < node.range[0],
    )
    return anchor?.parent.value ?? null
  }
  return node
}

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
