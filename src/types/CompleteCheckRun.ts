import { Octokit } from 'octokit'

type ChecksUpdate = Octokit['rest']['checks']['update']

export type CompleteCheckRun = (
  param: Omit<
    NonNullable<Parameters<ChecksUpdate>[0]>,
    'check_run_id' | 'status' | 'owner' | 'repo'
  > & {
    conclusion: 'success' | 'failure' | 'skipped'
  }
) => ReturnType<ChecksUpdate>
