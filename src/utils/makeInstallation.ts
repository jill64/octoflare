import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { OctoflareInstallation } from '../types/OctoflareInstallation.js'

export const makeInstallation = async (
  {
    payload,
    app
  }: {
    payload: WebhookEvent
    app: App
  },
  onCreateCheck: (check_run_id: string) => unknown
): Promise<OctoflareInstallation | null> => {
  if (!('installation' in payload)) {
    return null
  }

  if (!payload.installation) {
    return null
  }

  const installation_id = payload.installation.id

  const kit = await app.getInstallationOctokit(installation_id)

  const {
    data: { token }
  } = await kit.rest.apps.createInstallationAccessToken({
    installation_id
  })

  const createCheckRun = async (
    params: Parameters<OctoflareInstallation['createCheckRun']>[0]
  ) => {
    const response = await kit.rest.checks.create({
      status: 'in_progress',
      ...params
    })

    onCreateCheck(response.data.id.toString())

    return response
  }

  return {
    id: installation_id,
    token,
    kit,
    createCheckRun
  }
}
