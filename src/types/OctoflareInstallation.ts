import { Octokit } from 'octokit'
import { CompleteCheckRun } from './CompleteCheckRun.js'
import { DispatchWorkflow } from './DispatchWorkflow.js'
import { InstallationGetFile } from './InstallationGetFile.js'
import { OctoflarePayload } from './OctoflarePayload.js'
import { OctoflarePayloadData } from './OctoflarePayloadData.js'
import { UpdateCheckRun } from './UpdateCheckRun.js'

export type OctoflareInstallation<Data extends OctoflarePayloadData> = {
  kit: Octokit
  createCheckRun: (
    params: NonNullable<Parameters<Octokit['rest']['checks']['create']>[0]>
  ) => Promise<{
    dispatchWorkflow: DispatchWorkflow<Data>
    completeCheckRun: CompleteCheckRun
    updateCheckRun: UpdateCheckRun
  }>
  startWorkflow: (
    payload: Omit<OctoflarePayload<Data>, 'token' | 'app_token'>
  ) => Promise<void>
  getFile: InstallationGetFile
}
