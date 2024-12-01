/**
 * @file keys
 */

export const validTopLevelKeys = [
  'name',
  'run-name',
  'on',
  'permissions',
  'env',
  'defaults',
  'concurrency',
  'jobs',
]

export const validJobKeys = [
  'name',
  'permissions',
  'needs',
  'if',
  'runs-on',
  'environment',
  'concurrency',
  'outputs',
  'env',
  'defaults',
  'steps',
  'timeout-minutes',
  'strategy',
  'continue-on-error',
  'container',
  'services',
  'uses',
  'with',
  'secrets',
]

export const validStepKeys = [
  'id',
  'if',
  'name',
  'uses',
  'run',
  'working-directory',
  'shell',
  'with',
  'env',
  'continue-on-error',
  'timeout-minutes',
]

export const validServiceKeys = ['image', 'credentials', 'env', 'ports', 'volumes', 'options']

export const validContainerKeys = [...validServiceKeys]

export const validStrategyKeys = ['matrix', 'fail-fast', 'max-parallel']
