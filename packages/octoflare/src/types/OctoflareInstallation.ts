import { Octokit } from 'octokit'
import { ChecksOutput } from './ChecksOutput.js'
import { CompleteCheckRun } from './CompleteCheckRun.js'
import { DispatchWorkflow } from './DispatchWorkflow.js'
import { InstallationGetFile } from './InstallationGetFile.js'
import { OctoflarePayload } from './OctoflarePayload.js'
import { OctoflarePayloadData } from './OctoflarePayloadData.js'
import { UpdateCheckRun } from './UpdateCheckRun.js'

export type OctoflareInstallation<Data extends OctoflarePayloadData> = {
  /**
   * Octokit instance with installation access token.
   */
  kit: Octokit
  id: number
  createCheckRun: (params: {
    owner: string
    repo: string
    name: string
    head_sha: string
    output: ChecksOutput
  }) => Promise<{
    /**
     * Dispatch workflow run.
     * It inherits `owner`, `repo`, `check_run_id` of `createCheckRun`.
     */
    dispatchWorkflow: DispatchWorkflow<Data>

    /**
     * Update check run status as `complete`.
     * It inherits `owner`, `repo`, `check_run_id` of `createCheckRun`.
     */
    completeCheckRun: CompleteCheckRun

    /**
     * Update check run status.
     * It inherits `owner`, `repo`, `check_run_id` of `createCheckRun`.
     */
    updateCheckRun: UpdateCheckRun
  }>

  /**
   * Dispatch workflow run without check_run_id.
   * If a workflow is started with this function, the automatic check-run control in the action is disabled.
   */
  startWorkflow: (
    payload: Omit<OctoflarePayload<Data>, 'token' | 'app_token'>
  ) => Promise<void>

  getFile: InstallationGetFile
}
