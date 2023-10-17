import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { CompleteCheckRun } from '../types/CompleteCheckRun.js'
import { DispatchWorkflow } from '../types/DispatchWorkflow.js'
import { OctoflareInstallation } from '../types/OctoflareInstallation.js'
import { OctoflarePayload } from '../types/OctoflarePayload.js'

const app_owner = 'jill64'

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

  const { installation } = payload

  if (!installation) {
    return null
  }

  const installation_id = installation.id

  const kit = await app.getInstallationOctokit(installation_id)

  const [token, app_slug] = await Promise.all([
    kit.rest.apps
      .createInstallationAccessToken({
        installation_id
      })
      .then(({ data }) => data.token),
    kit.rest.apps
      .getInstallation({ installation_id })
      .then(({ data }) => data.app_slug)
  ])

  const app_kit_ready = kit.rest.apps
    .getRepoInstallation({
      owner: app_owner,
      repo: app_slug
    })
    .then(({ data }) => data.id)
    .then((installation_id) => app.getInstallationOctokit(installation_id))

  const startWorkflow = (async (inputs) => {
    const app_kit = await app_kit_ready
    await app_kit.rest.actions.createWorkflowDispatch({
      repo: app_slug,
      owner: app_owner,
      workflow_id: `${app_slug}.yml`,
      ref: 'main',
      inputs: {
        ...inputs,
        payload: JSON.stringify({
          token,
          ...inputs.payload
        } satisfies OctoflarePayload)
      }
    })
    await app_kit.rest.apps.revokeInstallationAccessToken()
  }) satisfies OctoflareInstallation['startWorkflow']

  const createCheckRun = (async (params) => {
    const {
      data: { id }
    } = await kit.rest.checks.create({
      ...params,
      status: 'in_progress'
    })

    const check_run_id = id.toString()

    const completeCheckRun = (async (conclusion, output) => {
      await kit.rest.checks.update({
        check_run_id,
        owner: params.owner,
        repo: params.repo,
        status: 'completed',
        conclusion,
        output
      })

      await kit.rest.apps.revokeInstallationAccessToken()
    }) satisfies CompleteCheckRun

    const dispatchWorkflow = ((inputs) =>
      startWorkflow({
        ...inputs,
        payload: {
          repo: params.repo,
          owner: params.owner,
          check_run_id: id
        }
      })) satisfies DispatchWorkflow

    onCreateCheck(completeCheckRun)

    return {
      completeCheckRun,
      dispatchWorkflow
    }
  }) satisfies OctoflareInstallation['createCheckRun']

  return {
    id: installation_id,
    token,
    kit,
    createCheckRun,
    startWorkflow
  }
}
