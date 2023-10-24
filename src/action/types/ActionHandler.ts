import { CloseCheckParam } from '../../types/CloseCheckParam.js'
import { ActionOctokit } from './ActionOctokit.js'

export type ActionHandler = (context: {
  octokit: ActionOctokit
  appkit: ActionOctokit
  payload: {
    /** @deprecated Use octokit */
    token: string
    /** @deprecated Use appkit */
    app_token: string
    repo: string
    owner: string
    /** @deprecated Use handler return value */
    check_run_id?: number
  }
}) => Promise<CloseCheckParam | void> | CloseCheckParam | void
