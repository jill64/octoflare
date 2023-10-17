import { Octokit } from 'octokit'

export type WorkflowInputs = NonNullable<
  NonNullable<
    Parameters<Octokit['rest']['actions']['createWorkflowDispatch']>[0]
  >['inputs']
>
