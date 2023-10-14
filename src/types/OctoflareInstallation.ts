import { Octokit } from 'octokit'
import { CompleteCheckRun } from './CompleteCheckRun.js'
import { DispatchWorkflow } from './DispatchWorkflow.js'
import { OctoflarePayload } from './OctoflarePayload.js'

export type OctoflareInstallation = {
  id: number
  kit: Octokit
  token: string
  createCheckRun: (
    params: NonNullable<Parameters<Octokit['rest']['checks']['create']>[0]>
  ) => Promise<{
    completeCheckRun: CompleteCheckRun
    dispatchWorkflow: DispatchWorkflow
  }>
  startWorkflow: (
    params: NonNullable<
      Parameters<Octokit['rest']['actions']['createWorkflowDispatch']>[0]
    > & {
      inputs: {
        payload: Omit<OctoflarePayload, 'token'>
      }
    }
  ) => Promise<Octokit['rest']['apps']['revokeInstallationAccessToken']>
}
