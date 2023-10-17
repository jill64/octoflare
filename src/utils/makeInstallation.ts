import { WebhookEvent } from '@octokit/webhooks-types'
import { App, Octokit } from 'octokit'
import { CompleteCheckRun } from '../types/CompleteCheckRun.js'
import { DispatchWorkflow } from '../types/DispatchWorkflow.js'
import { OctoflareInstallation } from '../types/OctoflareInstallation.js'
import { OctoflarePayload } from '../types/OctoflarePayload.js'

export const makeInstallation = async (
  {
    payload,
    app
  }: {
    payload: WebhookEvent
    app: App
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
  apps?: {
    kit: Promise<Octokit>
    repo: string
    owner: string
  }
}> => {
  if (!('installation' in payload)) {
    return {
      installation: null
    }
  }

  const { installation } = payload

  if (!installation) {
    return {
      installation: null
    }
  }

  const installation_id = installation.id

  const kit = await app.getInstallationOctokit(installation_id)

  const [token, { app_slug, app_owner }] = await Promise.all([
    kit.rest.apps
      .createInstallationAccessToken({
        installation_id
      })
      .then(({ data: { token } }) => token),
    kit.rest.apps
      .getInstallation({
        installation_id
      })
      .then(({ data: { app_slug, account } }) => {
        const app_owner =
          account && 'login' in account ? account.login : account?.name ?? ''

        if (!app_owner) {
          throw new Error('Could not get app owner')
        }

        return {
          app_slug,
          app_owner
        }
      })
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
      id: installation_id,
      token,
      kit,
      createCheckRun,
      startWorkflow
    },
    apps: {
      kit: app_kit_ready,
      repo: app_slug,
      owner: app_owner
    }
  }
}
