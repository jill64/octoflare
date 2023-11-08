import { WebhookEvent } from '@octokit/webhooks-types'
import { Buffer } from 'node:buffer'
import { App } from 'octokit'
import { ActionOctokit } from '../action/index.js'
import {
  InstallationGetFile,
  OctoflareEnv,
  OctoflarePayload,
  OctoflarePayloadData
} from '../index.js'
import { CompleteCheckRun } from '../types/CompleteCheckRun.js'
import { DispatchWorkflow } from '../types/DispatchWorkflow.js'
import { InstallationGetFileOptions } from '../types/InstallationGetFileOptions.js'
import { OctoflareInstallation } from '../types/OctoflareInstallation.js'
import { closeCheckRun } from './closeCheckRun.js'

export const makeInstallation = async <Data extends OctoflarePayloadData>(
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
  installation: OctoflareInstallation<Data> | null
  app_kit: ActionOctokit | null
}> => {
  if (!('installation' in payload && payload.installation)) {
    return {
      installation: null,
      app_kit: null
    }
  }

  const { installation } = payload

  const app_owner = env.OCTOFLARE_APP_OWNER
  const app_repo = env.OCTOFLARE_APP_REPO

  const installation_id = installation.id
  const kit = await app.getInstallationOctokit(installation_id)

  const {
    data: { id: app_installation_id }
  } = await kit.rest.apps.getRepoInstallation({
    owner: app_owner,
    repo: app_repo
  })

  const app_kit = await app.getInstallationOctokit(app_installation_id)

  const startWorkflow: OctoflareInstallation<Data>['startWorkflow'] = async (
    inputs
  ) => {
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
      repo: app_repo,
      owner: app_owner,
      workflow_id: `${app_repo}.yml`,
      ref: 'main',
      inputs: {
        payload: JSON.stringify({
          token,
          app_token,
          ...inputs
        })
      }
    })
  }

  const createCheckRun: OctoflareInstallation<Data>['createCheckRun'] = async (
    params
  ) => {
    const {
      data: { id: check_run_id }
    } = await kit.rest.checks.create({
      ...params,
      status: 'in_progress'
    })

    const completeCheckRun: CompleteCheckRun = async (conclusion, output) => {
      await closeCheckRun({
        kit,
        check_run_id,
        ...params,
        conclusion,
        output
      })
    }

    const dispatchWorkflow = ((data) =>
      startWorkflow({
        repo: params.repo,
        owner: params.owner,
        check_run_id,
        ...(data ? { data } : {})
      } as Omit<
        OctoflarePayload<Data>,
        'token' | 'app_token'
      >)) as DispatchWorkflow<Data>

    onCreateCheck({
      completeCheckRun,
      target: {
        owner: params.owner,
        repo: params.repo
      }
    })

    return {
      dispatchWorkflow,
      completeCheckRun
    }
  }

  const getFile: InstallationGetFile = async <T>(
    path: string,
    options?: InstallationGetFileOptions & {
      parser?: (content: string) => T
    }
  ) => {
    const { parser, raw, ref } = options ?? {}

    if (!('repository' in payload && payload.repository)) {
      throw new Error('No repository in payload')
    }

    const { repository } = payload

    const repo = repository.name
    const owner = repository.owner.login

    try {
      const [{ data }, rawString] = await Promise.all([
        kit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref
        }),
        raw
          ? kit.rest.repos
              .getContent({
                owner,
                repo,
                path,
                ref,
                mediaType: {
                  format: 'raw'
                }
              })
              // @ts-expect-error octokit specific media type response
              .then(({ data }) => data as string)
          : ''
      ])

      if (!('type' in data && data.type === 'file')) {
        return null
      }

      const str = raw
        ? rawString
        : Buffer.from(data.content, data.encoding as BufferEncoding).toString()

      const content = parser?.(str) ?? str

      return {
        size: data.size,
        name: data.name,
        path: data.path,
        sha: data.sha,
        data: content
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }

  return {
    installation: {
      kit,
      createCheckRun,
      startWorkflow,
      getFile
    },
    app_kit
  }
}
