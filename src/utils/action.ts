/**
 * @file utils for GitHub action
 */

import { isYAMLMapping, isYAMLScalar, isYAMLSequence } from './ast'
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

/**
 * Get `steps` sequence node from given job node.
 *
 * @param node - job node of `jobs` sequence
 * @returns - `steps` sequence node or `undefined`
 */
export function getNodeStepsSequence(node: YAMLAst.YAMLPair) {
  // job is not a mapping
  if (!isYAMLMapping(node.value)) return

  const stepsPair = node.value.pairs.find(v => isYAMLScalar(v.key) && v.key.value === 'steps')

  // job has no steps
  if (!stepsPair) return

  // steps is not a sequence
  if (!isYAMLSequence(stepsPair.value)) return

  return stepsPair.value
}
