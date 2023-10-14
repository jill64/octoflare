import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { CloseCheckParam } from './CloseCheckParam.js'
import { OctoflareEnv } from './OctoflareEnv.js'
import { OctoflareInstallation } from './OctoflareInstallation.js'

export type OctoflareHandler<Env extends OctoflareEnv = OctoflareEnv> =
  (context: {
    request: Request
    env: Env
    app: App
    payload: WebhookEvent
    installation: OctoflareInstallation | null
  }) => Promise<Response | CloseCheckParam> | Response | CloseCheckParam
