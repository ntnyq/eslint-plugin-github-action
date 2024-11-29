import actionNameCasing from './action-name-casing'
import jobIdCasing from './job-id-casing'
import maxJobsPerAction from './max-jobs-per-action'
import noExternalJob from './no-external-job'
import noTopLevelEnv from './no-top-level-env'
import noTopLevelPermissions from './no-top-level-permissions'
import preferJobStepUses from './prefer-job-step-uses'
import requireActionName from './require-action-name'
import requireJobName from './require-job-name'
import requireJobStepName from './require-job-step-name'

export const rules = {
  'action-name-casing': actionNameCasing,
  'job-id-casing': jobIdCasing,
  'max-jobs-per-action': maxJobsPerAction,
  'no-external-job': noExternalJob,
  'no-top-level-env': noTopLevelEnv,
  'no-top-level-permissions': noTopLevelPermissions,
  'perfer-job-step-uses': preferJobStepUses,
  'require-action-name': requireActionName,
  'require-job-name': requireJobName,
  'require-job-step-name': requireJobStepName,
}
