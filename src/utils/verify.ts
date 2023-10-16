import crypto from 'node:crypto'
import { OctoflareEnv } from '../index.js'
import { timingSafeEqual } from './timingSafeEqual.js'

export const verify = async ({
  request,
  env
}: {
  request: Request
  env: OctoflareEnv
}): Promise<string | Response> => {
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

  const headerSignature = headers.get('X-Hub-Signature-256')

  if (!headerSignature) {
    return new Response(null, {
      status: 401
    })
  }

  if (!timingSafeEqual(`sha256=${signature}`, headerSignature)) {
    return new Response(null, {
      status: 403
    })
  }

  return body
}
