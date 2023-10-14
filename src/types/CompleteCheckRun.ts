import { Octokit } from 'octokit'
import { Conclusion } from './Conclusion.js'

type ChecksUpdate = Octokit['rest']['checks']['update']

export type CompleteCheckRun = (
  conclusion: Conclusion,
  param?: Partial<NonNullable<Parameters<ChecksUpdate>[0]>>
) => ReturnType<ChecksUpdate>
