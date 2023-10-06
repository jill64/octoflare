import crypto from 'node:crypto'
import { InternalEnv } from './types/InternalEnv.js'

export const verifyRequest = ({
  request,
  body,
  env
}: {
  request: Request
  body: string
  env: InternalEnv
}): Response | null => {
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

  const headerSignature = headers.get('X-Hub-Signature-256')

  if (!headerSignature) {
    return new Response(null, {
      status: 403
    })
  }

  const signature = crypto
    .createHmac('sha256', env.OCTOFLARE_APP_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

  if (`sha256=${signature}` !== headerSignature) {
    return new Response(null, {
      status: 403
    })
  }

  return null
}
