import { Octokit } from 'octokit'
import { CompleteCheckRun } from './CompleteCheckRun.js'
import { DispatchWorkflow } from './DispatchWorkflow.js'
import { OctoflarePayload } from './OctoflarePayload.js'
import { WorkflowInputs } from './WorkflowInputs.js'

export type OctoflareInstallation = {
  kit: Octokit
  createCheckRun: (
    params: NonNullable<Parameters<Octokit['rest']['checks']['create']>[0]>
  ) => Promise<{
    /** @deprecated Use to handler return value */
    completeCheckRun: CompleteCheckRun
    dispatchWorkflow: DispatchWorkflow
  }>
  startWorkflow: (
    inputs: WorkflowInputs & {
      payload: Omit<OctoflarePayload, 'token' | 'app_token'>
    }
  ) => Promise<void>
}
