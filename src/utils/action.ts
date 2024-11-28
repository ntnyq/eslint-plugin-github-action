/**
 * @file utils for GitHub action
 */

import { isYAMLMapping, isYAMLScalar } from './ast'
import type { YAMLAst } from '../types/yaml'

/**
 * Get `jobs` mapping node from given node.
 *
 * @param node - AST node of GitHub Action
 * @returns - `jobs` mapping node or `undefined`
 */
export function getNodeJobsMapping(node: YAMLAst.YAMLMapping) {
  const jobsPair = node.pairs.find(v => isYAMLScalar(v.key) && v.key.value === 'jobs')

  // action has no jobs
  if (!jobsPair) return

  // jobs is not a mapping
  if (!isYAMLMapping(jobsPair.value)) return

  return jobsPair.value
}
