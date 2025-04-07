/**
 * @see {@link https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idtimeout-minutes}
 */
export const TIMEOUT_MINUTES = {
  default: 6 * 60,
  max: 24 * 60,
  min: 1,
}
