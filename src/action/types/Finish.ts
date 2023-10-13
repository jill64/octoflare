import { ActionOctokit } from './ActionOctokit.js'

type CheckUpdate = ActionOctokit['rest']['checks']['update']

export type Finish = (
  conclusion: 'failure' | 'success' | 'skipped',
  params?: Partial<Parameters<CheckUpdate>[0]>,
  skipRevokeToken?: boolean
) => ReturnType<CheckUpdate> | Promise<void>
