import actionNameCasing from './action-name-casing'
import jobIdCasing from './job-id-casing'
import maxJobsPerAction from './max-jobs-per-action'
import noExternalJob from './no-external-job'
import noInvalidKey from './no-invalid-key'
import noTopLevelEnv from './no-top-level-env'
import noTopLevelPermissions from './no-top-level-permissions'
import preferFileExtension from './prefer-file-extension'
import preferStepUsesStyle from './prefer-step-uses-style'
import requireActionName from './require-action-name'
import requireActionRunName from './require-action-run-name'
import requireJobName from './require-job-name'
import requireJobStepName from './require-job-step-name'
import validTimeoutMinutes from './valid-timeout-minutes'
import validTriggerEvents from './valid-trigger-events'

export const rules = {
  'action-name-casing': actionNameCasing,
  'job-id-casing': jobIdCasing,
  'max-jobs-per-action': maxJobsPerAction,
  'no-external-job': noExternalJob,
  'no-invalid-key': noInvalidKey,
  'no-top-level-env': noTopLevelEnv,
  'no-top-level-permissions': noTopLevelPermissions,
  'prefer-file-extension': preferFileExtension,
  'prefer-step-uses-style': preferStepUsesStyle,
  'require-action-name': requireActionName,
  'require-action-run-name': requireActionRunName,
  'require-job-name': requireJobName,
  'require-job-step-name': requireJobStepName,
  'valid-trigger-events': validTriggerEvents,
  'valid-timeout-minutes': validTimeoutMinutes,
}
