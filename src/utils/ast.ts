/**
 * @file Utils for YAML AST
 *
 * @see {@link https://github.com/ota-meshi/yaml-eslint-parser/blob/master/docs/AST.md}
 * @copyright {@link https://github.com/ota-meshi/eslint-plugin-yml/blob/master/src/utils/ast-utils.ts}
 */

import { getStaticYAMLValue, traverseNodes } from 'yaml-eslint-parser'
import type { YAMLAst } from '../types/yaml'

/**
 * Finds the document that owns a YAML node.
 * @param node - Node within a parsed document.
 * @returns The containing document.
 */
function getYAMLDocument(node: Exclude<YAMLAst.YAMLNode, YAMLAst.YAMLProgram>) {
  let parent: YAMLAst.YAMLNode = node
  while (parent.type !== 'YAMLDocument') {
    parent = parent.parent
  }
  return parent
}

/**
 * Finds the nearest preceding anchor without reading inherited object keys.
 * @param node - Alias to resolve in its own document.
 * @returns The matching anchor, or undefined for an unresolved alias.
 */
function getYAMLAnchor(node: YAMLAst.YAMLAlias) {
  const document = getYAMLDocument(node)
  if (!Object.hasOwn(document.anchors, node.name)) {
    return
  }
  return document.anchors[node.name].findLast(
    anchor => anchor.range[0] < node.range[0],
  )
}

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
    const anchor = getYAMLAnchor(node)
    return anchor?.parent.value ?? null
  }
  return node
}

/**
 * Reads a scalar's effective value, including its enclosing explicit YAML tag.
 * Keep the original scalar node for source ranges and style information.
 * @param node - Structurally resolved scalar node.
 * @returns The parser's static value after applying metadata.
 */
export function getYAMLScalarValue(node: YAMLAst.YAMLScalar): unknown {
  return getStaticYAMLValue(
    node.parent.type === 'YAMLWithMeta' ? node.parent : node,
  )
}

/**
 * Checks whether editing a node could affect aliases outside the edited range.
 * This includes anchors nested inside it and anchors on enclosing collections.
 * @param node - Node whose source range would be changed or removed.
 * @returns Whether an external alias depends on an overlapping anchor definition.
 */
export function hasExternalYAMLAlias(
  node: Exclude<YAMLAst.YAMLNode, YAMLAst.YAMLProgram>,
): boolean {
  let hasReference = false
  traverseNodes(getYAMLDocument(node), {
    enterNode(alias) {
      if (
        alias.type !== 'YAMLAlias' ||
        (node.range[0] <= alias.range[0] && alias.range[1] <= node.range[1])
      ) {
        return
      }
      const anchor = getYAMLAnchor(alias)
      if (
        anchor &&
        anchor.parent.range[0] < node.range[1] &&
        node.range[0] < anchor.parent.range[1]
      ) {
        hasReference = true
      }
    },
    leaveNode() {},
  })
  return hasReference
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
