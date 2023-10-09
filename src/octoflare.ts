import { attempt } from '@jill64/attempt'
import { WebhookEvent } from '@octokit/webhooks-types'
import crypto from 'node:crypto'
import { App } from 'octokit'
import { OctoflareEnv } from './types/OctoflareEnv.js'
import { OctoflareHandler } from './types/OctoflareHandler.js'

export const octoflare = <Env extends OctoflareEnv = OctoflareEnv>(
  handler: OctoflareHandler<Env>
) => ({
  async fetch(request: Request, env: Env): Promise<Response> {
    const { headers, method } = request

    if (method === 'GET' || method === 'HEAD') {
      return new Response(null, {
        status: 204
      })
    }

    if (method !== 'POST') {
      return new Response(null, {
        status: 405,
        headers: {
          Allow: 'GET, HEAD, POST'
        }
      })
    }

    const body = await request.text()

    const signature = crypto
      .createHmac('sha256', env.OCTOFLARE_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (`sha256=${signature}` !== headers.get('X-Hub-Signature-256')) {
      return new Response(null, {
        status: 403
      })
    }

    const payload = JSON.parse(body) as WebhookEvent

    const app = new App({
      appId: env.OCTOFLARE_APP_ID,
      privateKey: env.OCTOFLARE_PRIVATE_KEY_PKCS8
    })

    const response = await attempt(
      () => handler({ request, env, app, payload }),
      (e) =>
        new Response(JSON.stringify(e, null, 2), {
          status: 500
        })
    )

    return response
  }
})
