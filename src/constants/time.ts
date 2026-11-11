/**
 * Timeout defaults and validation bounds in minutes
 */
export const TIMEOUT_MINUTES = {
  /**
   * Default rule maximum for jobs and steps, matching GitHub's job timeout default
   *
   * @see {@link https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes}
   */
  default: 6 * 60,
  /**
   * Maximum job timeout accepted by this rule (24 hours)
   * Actual execution limits depend on the runner
   *
   * @see {@link https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idtimeout-minutes}
   */
  max: 24 * 60,
  /**
   * Minimum job and step timeout, enforcing positive integer minutes
   *
   * @see {@link https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepstimeout-minutes}
   */
  min: 1,
  /**
   * Maximum step timeout on GitHub-hosted and self-hosted runners (6 hours)
   *
   * @see {@link https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepstimeout-minutes}
   */
  stepMax: 6 * 60,
}
