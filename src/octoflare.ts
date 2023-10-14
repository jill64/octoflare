import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { CompleteCheckRun } from './types/CompleteCheckRun.js'
import { OctoflareEnv } from './types/OctoflareEnv.js'
import { OctoflareHandler } from './types/OctoflareHandler.js'
import { makeInstallation } from './utils/makeInstallation.js'
import { verify } from './utils/verify.js'

export const octoflare = <Env extends Record<string, unknown>>(
  handler: OctoflareHandler<Env & OctoflareEnv>
) => ({
  async fetch(request: Request, env: Env & OctoflareEnv): Promise<Response> {
    try {
      const result = await verify({ request, env })

      if (result instanceof Response) {
        return result
      }

      const payload = JSON.parse(result) as WebhookEvent

      const app = new App({
        appId: env.OCTOFLARE_APP_ID,
        privateKey: env.OCTOFLARE_PRIVATE_KEY_PKCS8
      })

      let completeCheckRun: CompleteCheckRun | undefined

      const installation = await makeInstallation({ payload, app }, (fn) => {
        completeCheckRun = fn
      })

      try {
        return await handler({
          request,
          env,
          app,
          payload,
          installation
        })
      } catch (e) {
        await completeCheckRun?.('failure', {
          output: {
            title: 'Octoflare Error',
            summary: e instanceof Error ? e.message : 'Unknown error'
          }
        })

        await installation?.kit.rest.apps.revokeInstallationAccessToken()

        throw e
      }
    } catch (e) {
      return new Response(JSON.stringify(e, null, 2), {
        status: 500
      })
    }
  }
})
