import { OctoflarePayload } from '../../index.js'
import { CloseCheckParam } from '../../types/CloseCheckParam.js'
import { ActionOctokit } from './ActionOctokit.js'

export type ActionHandler = (context: {
  octokit: ActionOctokit
  appkit: ActionOctokit
  payload: Omit<OctoflarePayload, 'token' | 'app_token' | 'check_run_id'> & {
    /** @deprecated Use handler return value */
    check_run_id?: number
  }
}) => Promise<CloseCheckParam | void> | CloseCheckParam | void
