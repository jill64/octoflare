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

  let check_run_id: string | null = null

  return {
    id: installation_id,
    token,
    kit,
    createCheckRun: async (params) => {
      const response = await kit.rest.checks.create({
        status: 'in_progress',
        ...params
      })

      check_run_id = response.data.id.toString()
      onCreateCheck(check_run_id)

      return response
    },
    dispatchWorkflow: async (params) => {
      const {
        data: { id: installation_id }
      } = await app.octokit.rest.apps.getRepoInstallation({
        owner: params.owner,
        repo: params.repo
      })

      const kit = await app.getInstallationOctokit(installation_id)

      return kit.rest.actions.createWorkflowDispatch({
        ...params,
        inputs: {
          ...params.inputs,
          ...(check_run_id ? { check_run_id } : {}),
          token
        }
      })
    }
  }
}
