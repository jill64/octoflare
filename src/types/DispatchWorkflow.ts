import { Octokit } from 'octokit'

type createWorkflowDispatch =
  Octokit['rest']['actions']['createWorkflowDispatch']

export type DispatchWorkflow = (
  dispatch_params: NonNullable<Parameters<createWorkflowDispatch>[0]>
) => ReturnType<createWorkflowDispatch>
