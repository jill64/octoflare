import { WebhookEvent } from '@octokit/webhooks-types'
import memoize from 'lodash/memoize.js'
import { App } from 'octokit'
import { CompleteCheckRun } from '../types/CompleteCheckRun.js'
import { DispatchWorkflow } from '../types/DispatchWorkflow.js'
import { OctoflareInstallation } from '../types/OctoflareInstallation.js'

export const makeInstallation = async (
  {
    payload,
    app
  }: {
    payload: WebhookEvent
    app: App
  },
  onCreateCheck: (completeCheckRun: CompleteCheckRun) => unknown
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

  const getRepoInstallation = memoize(
    async ({ owner, repo }: { owner: string; repo: string }) => {
      const {
        data: { id: installation_id }
      } = await kit.rest.apps.getRepoInstallation({
        owner,
        repo
      })

      return await app.getInstallationOctokit(installation_id)
    }
  )

  return {
    id: installation_id,
    token,
    kit,
    createCheckRun: async (params) => {
      const {
        data: { id }
      } = await kit.rest.checks.create({
        ...params,
        status: 'in_progress'
      })

      const check_run_id = id.toString()

      const completeCheckRun = ((conclusion, complete_params) =>
        kit.rest.checks.update({
          check_run_id,
          owner: params.owner,
          repo: params.repo,
          status: 'completed',
          conclusion,
          ...complete_params
        })) satisfies CompleteCheckRun

      const dispatchWorkflow = (async (dispatch_params) => {
        const octokit = await getRepoInstallation(dispatch_params)

        await octokit.rest.actions.createWorkflowDispatch({
          ...dispatch_params,
          inputs: {
            token,
            repo: params.repo,
            owner: params.owner,
            check_run_id,
            ...dispatch_params.inputs
          }
        })

        return octokit.rest.apps.revokeInstallationAccessToken
      }) satisfies DispatchWorkflow

      onCreateCheck(completeCheckRun)

      return {
        completeCheckRun,
        dispatchWorkflow
      }
    }
  }
}
