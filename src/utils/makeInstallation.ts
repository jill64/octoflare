import { WebhookEvent } from '@octokit/webhooks-types'
import { App } from 'octokit'
import { ActionOctokit } from '../action/index.js'
import { OctoflareEnv } from '../index.js'
import { CompleteCheckRun } from '../types/CompleteCheckRun.js'
import { DispatchWorkflow } from '../types/DispatchWorkflow.js'
import { OctoflareInstallation } from '../types/OctoflareInstallation.js'
import { OctoflarePayload } from '../types/OctoflarePayload.js'

export const makeInstallation = async (
  {
    payload,
    app,
    env
  }: {
    payload: WebhookEvent
    app: App
    env: OctoflareEnv
  },
  onCreateCheck: (args: {
    completeCheckRun: CompleteCheckRun
    target: {
      owner: string
      repo: string
    }
  }) => unknown
): Promise<{
  installation: OctoflareInstallation | null
  app_kit: ActionOctokit | null
}> => {
  if (!('installation' in payload)) {
    return {
      installation: null,
      app_kit: null
    }
  }

  const { installation } = payload

  if (!installation) {
    return {
      installation: null,
      app_kit: null
    }
  }

  const owner = env.OCTOFLARE_APP_OWNER
  const repo = env.OCTOFLARE_APP_REPO

  const installation_id = installation.id
  const kit = await app.getInstallationOctokit(installation_id)

  const {
    data: { id: app_installation_id }
  } = await kit.rest.apps.getRepoInstallation({
    owner,
    repo
  })
  
  const app_kit = await app.getInstallationOctokit(app_installation_id)

  const startWorkflow = (async (inputs) => {
    const [token, app_token] = await Promise.all([
      kit.rest.apps
        .createInstallationAccessToken({
          installation_id
        })
        .then(({ data: { token } }) => token),
      app_kit.rest.apps
        .createInstallationAccessToken({
          installation_id: app_installation_id
        })
        .then(({ data: { token } }) => token)
    ])

    await app_kit.rest.actions.createWorkflowDispatch({
      repo,
      owner,
      workflow_id: `${repo}.yml`,
      ref: 'main',
      inputs: {
        ...inputs,
        payload: JSON.stringify({
          token,
          app_token,
          ...inputs.payload
        } satisfies OctoflarePayload)
      }
    })
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

      await Promise.all([
        kit.rest.apps.revokeInstallationAccessToken(),
        app.octokit.rest.apps.revokeInstallationAccessToken()
      ])
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

    onCreateCheck({
      completeCheckRun,
      target: {
        owner: params.owner,
        repo: params.repo
      }
    })

    return {
      completeCheckRun,
      dispatchWorkflow
    }
  }) satisfies OctoflareInstallation['createCheckRun']

  return {
    installation: {
      kit,
      createCheckRun,
      startWorkflow
    },
    app_kit
  }
}
