import actionNameCasing from './action-name-casing'
import jobIdCasing from './job-id-casing'
import maxJobsPerAction from './max-jobs-per-action'
import noTopLevelEnv from './no-top-level-env'
import noTopLevelPermissions from './no-top-level-permissions'
import requireActionName from './require-action-name'

export const rules = {
  'action-name-casing': actionNameCasing,
  'job-id-casing': jobIdCasing,
  'max-jobs-per-action': maxJobsPerAction,
  'no-top-level-env': noTopLevelEnv,
  'no-top-level-permissions': noTopLevelPermissions,
  'require-action-name': requireActionName,
}
