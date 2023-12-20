import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { CloseCheckParam } from './CloseCheckParam.js'
import { OctoflareEnv } from './OctoflareEnv.js'
import { OctoflareInstallation } from './OctoflareInstallation.js'
import { OctoflarePayloadData } from './OctoflarePayloadData.js'

export type OctoflareHandler<
  Data extends OctoflarePayloadData,
  Env extends OctoflareEnv = OctoflareEnv
> = (context: {
  request: Request
  env: Env
  app: App
  payload: WebhookEvent
  installation: OctoflareInstallation<Data> | null
}) => Promise<Response | CloseCheckParam> | Response | CloseCheckParam
