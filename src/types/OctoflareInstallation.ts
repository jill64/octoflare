import { Octokit } from 'octokit'
import { CompleteCheckRun } from './CompleteCheckRun.js'
import { DispatchWorkflow } from './DispatchWorkflow.js'
import { InstallationGetFile } from './InstallationGetFile.js'
import { OctoflarePayload } from './OctoflarePayload.js'
import { WorkflowInputs } from './WorkflowInputs.js'

export type OctoflareInstallation = {
  kit: Octokit
  createCheckRun: (
    params: NonNullable<Parameters<Octokit['rest']['checks']['create']>[0]>
  ) => Promise<{
    dispatchWorkflow: DispatchWorkflow
    completeCheckRun: CompleteCheckRun
  }>
  startWorkflow: (
    inputs: WorkflowInputs & {
      payload: Omit<OctoflarePayload, 'token' | 'app_token'>
    }
  ) => Promise<void>
  getFile: InstallationGetFile
}
