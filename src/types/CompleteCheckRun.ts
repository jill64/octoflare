import { Octokit } from 'octokit'

type ChecksUpdate = Octokit['rest']['checks']['update']

export type CompleteCheckRun = (
  conclusion: 'success' | 'failure' | 'skipped',
  param?: Partial<NonNullable<Parameters<ChecksUpdate>[0]>>
) => ReturnType<ChecksUpdate>
