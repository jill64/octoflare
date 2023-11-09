import {
  OctoflarePayload,
  OctoflarePayloadData,
  UpdateCheckRun
} from '../../index.js'
import { CloseCheckParam } from '../../types/CloseCheckParam.js'
import { ActionOctokit } from './ActionOctokit.js'

export type ActionHandler<Data extends OctoflarePayloadData> = (context: {
  octokit: ActionOctokit
  appkit: ActionOctokit
  payload: OctoflarePayload<Data>
  updateCheckRun: UpdateCheckRun
}) => Promise<CloseCheckParam | void> | CloseCheckParam | void
