import { Octokit } from 'octokit'

type ChecksCreate = Octokit['rest']['checks']['create']
type WorkflowDispatch = Octokit['rest']['actions']['createWorkflowDispatch']

export type OctoflareInstallation = {
  id: number
  kit: Octokit
  token: string
  createCheckRun: (
    params: NonNullable<Parameters<ChecksCreate>[0]>
  ) => ReturnType<ChecksCreate>
  dispatchWorkflow: (
    params: NonNullable<Parameters<WorkflowDispatch>[0]> & {
      inputs: {
        owner: string
        repo: string
      }
    }
  ) => ReturnType<WorkflowDispatch>
}
