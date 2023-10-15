import { CloseCheckParam } from '../../types/CloseCheckParam.js'
import { OctoflarePayload } from '../../types/OctoflarePayload.js'
import { ActionOctokit } from './ActionOctokit.js'

export type ActionHandler = (context: {
  octokit: ActionOctokit
  payload: OctoflarePayload
}) => Promise<CloseCheckParam | void> | CloseCheckParam | void
