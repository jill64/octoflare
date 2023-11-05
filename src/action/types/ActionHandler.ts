import { OctoflarePayload } from '../../index.js'
import { CloseCheckParam } from '../../types/CloseCheckParam.js'
import { ActionOctokit } from './ActionOctokit.js'

export type ActionHandler = (context: {
  octokit: ActionOctokit
  appkit: ActionOctokit
  payload: Omit<OctoflarePayload, 'token' | 'app_token' | 'check_run_id'>
}) => Promise<CloseCheckParam | void> | CloseCheckParam | void
