import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { InternalEnv } from './InternalEnv.js'

export type OctoflareHandler<Env extends InternalEnv = InternalEnv> =
  (context: {
    request: Request
    env: Env
    app: App
    payload: WebhookEvent
  }) => Promise<Response> | Response
