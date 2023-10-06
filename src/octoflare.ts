import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { InternalEnv } from './types/InternalEnv.js'
import { OctoflareHandler } from './types/OctoflareHandler.js'
import { verifyRequest } from './verifyRequest.js'

export const octoflare = <Env extends InternalEnv>(
  handler: OctoflareHandler<Env>
) => ({
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.text()

    const invalidResponse = verifyRequest({ body, request, env })

    if (invalidResponse) {
      return invalidResponse
    }

    const payload = JSON.parse(body) as WebhookEvent

    const app = new App({
      appId: env.OCTOFLARE_APP_ID,
      privateKey: env.OCTOFLARE_APP_PRIVATE_KEY_PKCS8
    })

    try {
      const response = await handler({ request, env, app, payload })

      return response
        ? response
        : new Response(null, {
            status: 204
          })
    } catch (e) {
      return new Response(
        JSON.stringify(e instanceof Error ? e.message : String(e), null, 2),
        {
          status: 500
        }
      )
    }
  }
})
