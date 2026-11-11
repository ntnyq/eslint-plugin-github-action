/**
 * @file keys
 */

/**
 * Valid keys at the top level of a GitHub Actions workflow
 */
export const VALID_TOP_LEVEL_KEYS: string[] = [
  'name',
  'run-name',
  'on',
  'permissions',
  'env',
  'defaults',
  'concurrency',
  'cache-mode',
  'jobs',
]

/**
 * Valid keys in a GitHub Actions job definition
 */
export const VALID_JOB_KEYS: string[] = [
  'name',
  'permissions',
  'needs',
  'if',
  'runs-on',
  'snapshot',
  'cache-mode',
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

/**
 * Valid keys in a GitHub Actions step definition
 */
export const VALID_STEP_KEYS: string[] = [
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
  'background',
  'wait',
  'wait-all',
  'cancel',
  'parallel',
]

/**
 * Valid keys in a GitHub Actions service container definition
 */
export const VALID_SERVICE_KEYS: string[] = [
  'image',
  'credentials',
  'env',
  'ports',
  'volumes',
  'options',
  'command',
  'entrypoint',
]

/**
 * Valid keys in a GitHub Actions job container definition
 */
export const VALID_CONTAINER_KEYS: string[] = [
  'image',
  'credentials',
  'env',
  'ports',
  'volumes',
  'options',
]

/**
 * Valid keys in a GitHub Actions job strategy definition
 */
export const VALID_STRATEGY_KEYS: string[] = [
  'matrix',
  'fail-fast',
  'max-parallel',
]
