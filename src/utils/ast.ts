import type { YAMLAst } from '../types/yaml'

/**
 * Check if the given value is a YAMLScalar.
 * @param value The value to check.
 * @returns Whether the given value is a YAMLScalar.
 *
 * @see {@link https://github.com/ota-meshi/yaml-eslint-parser/blob/master/docs/AST.md#yamlscalar}
 */
export function isYAMLScalar(
  value: YAMLAst.YAMLContent | YAMLAst.YAMLWithMeta | null,
): value is YAMLAst.YAMLScalar {
  return value?.type === 'YAMLScalar'
}
