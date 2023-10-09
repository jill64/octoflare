import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { OctoflareEnv } from './OctoflareEnv.js'

export type OctoflareHandler<Env extends OctoflareEnv = OctoflareEnv> =
  (context: {
    request: Request
    env: Env
    app: App
    payload: WebhookEvent
  }) => Promise<Response> | Response
