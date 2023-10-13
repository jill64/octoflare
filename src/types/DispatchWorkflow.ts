import { Octokit } from 'octokit'

export type DispatchWorkflow = (
  dispatch_params: NonNullable<
    Parameters<Octokit['rest']['actions']['createWorkflowDispatch']>[0]
  >
) => Promise<Octokit['rest']['apps']['revokeInstallationAccessToken']>
