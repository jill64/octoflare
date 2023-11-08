import core from '@actions/core'
import github from '@actions/github'
import { OctoflarePayloadData } from '../index.js'
import { ChecksOutput } from '../types/ChecksOutput.js'
import { Conclusion } from '../types/Conclusion.js'
import { OctoflarePayload } from '../types/OctoflarePayload.js'
import { closeCheckRun } from '../utils/closeCheckRun.js'
import { errorLogging } from '../utils/errorLogging.js'
import { ActionHandler } from './types/ActionHandler.js'

export const action = async <Data extends OctoflarePayloadData = undefined>(
  handler: ActionHandler<Data>
) => {
  const payloadStr = core.getInput('payload', { required: true })
  const payload = JSON.parse(payloadStr) as OctoflarePayload<Data>

  const { token, app_token, check_run_id, owner, repo } = payload

  const octokit = github.getOctokit(token)
  const appkit = github.getOctokit(app_token)

  const { context } = github
  const details_url = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`

  const close = async (conclusion: Conclusion, output?: ChecksOutput) => {
    if (check_run_id) {
      await closeCheckRun({
        kit: octokit,
        owner,
        repo,
        check_run_id,
        details_url,
        conclusion,
        output
      })

      await Promise.all([
        octokit.rest.apps.revokeInstallationAccessToken(),
        appkit.rest.apps.revokeInstallationAccessToken()
      ])
    }
  }

  try {
    const result = await handler({
      octokit,
      appkit,
      payload
    })

    if (result) {
      return await (typeof result === 'string'
        ? close(result)
        : close(result.conclusion, result.output))
    }

    await close('success')
  } catch (e) {
    if (e instanceof Error) {
      await errorLogging({
        octokit: appkit,
        ...context.repo,
        error: e,
        info: `
Target Repo: [${owner}/${repo}](https://github.com/${owner}/${repo})  
Cause on Action  
[Workflow Detail](${details_url})
`
      })
    }

    await close('failure', {
      title: 'Octoflare Action Error',
      summary: e instanceof Error ? e.message : 'Unknown error'
    })

    throw e
  }
}

action(async ({ payload }) => {
  payload
})

action<{ test: 'asd' }>(async ({ payload }) => {
  payload.data.test
})
