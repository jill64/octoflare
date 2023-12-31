import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { OctoflarePayloadData } from './index.js'
import { CompleteCheckRun } from './types/CompleteCheckRun.js'
import { OctoflareEnv } from './types/OctoflareEnv.js'
import { OctoflareHandler } from './types/OctoflareHandler.js'
import { errorLogging } from './utils/errorLogging.js'
import { makeInstallation } from './utils/makeInstallation.js'
import { verify } from './utils/verify.js'

export const octoflare = <
  Data extends OctoflarePayloadData = undefined,
  Env extends Record<string, unknown> = Record<string, never>
>(
  handler: OctoflareHandler<Data, Env & OctoflareEnv>
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
      let checkTarget:
        | {
            repo: string
            owner: string
          }
        | undefined

      const { installation, app_kit } = await makeInstallation(
        { payload, app, env },
        ({ completeCheckRun: fn, target }) => {
          completeCheckRun = fn
          checkTarget = target
        }
      )

      try {
        const result = await handler({
          request,
          env,
          app,
          payload,
          installation
        })

        if (result instanceof Response) {
          return result
        }

        await (typeof result === 'string'
          ? completeCheckRun?.(result)
          : completeCheckRun?.(result.conclusion, result.output))

        const body =
          typeof result === 'string' ? result : JSON.stringify(result, null, 2)

        return new Response(body, {
          status: 200
        })
      } catch (e) {
        if (app_kit && e instanceof Error) {
          const repo_fullname = checkTarget
            ? `${checkTarget.owner}/${checkTarget.repo}`
            : ''

          await errorLogging({
            octokit: app_kit,
            owner: env.OCTOFLARE_APP_OWNER,
            repo: env.OCTOFLARE_APP_REPO,
            error: e,
            info: repo_fullname
              ? `
Target Repo: [${repo_fullname}](https://github.com/${repo_fullname})  
Cause in Worker
`
              : 'Cause in Worker'
          })
        }

        await completeCheckRun?.('failure', {
          title: 'Octoflare Worker Error',
          summary: e instanceof Error ? e.message : 'Unknown error'
        })

        throw e
      }
    } catch (e) {
      return new Response(JSON.stringify(e, null, 2), {
        status: 500
      })
    }
  }
})
