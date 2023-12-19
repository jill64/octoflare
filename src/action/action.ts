import core from '@actions/core'
import github from '@actions/github'
import { OctoflarePayloadData, UpdateCheckRun } from '../index.js'
import { ChecksOutput } from '../types/ChecksOutput.js'
import { Conclusion } from '../types/Conclusion.js'
import { OctoflarePayload } from '../types/OctoflarePayload.js'
import { errorLogging } from '../utils/errorLogging.js'
import { updateChecks } from '../utils/updateChecks.js'
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

  const close = async (
    conclusion: Conclusion,
    output?: ChecksOutput,
    skipTokenRevocation?: boolean
  ) => {
    if (check_run_id) {
      await updateChecks({
        kit: octokit,
        owner,
        repo,
        check_run_id,
        details_url,
        conclusion,
        output,
        status: 'completed'
      })

      if (!skipTokenRevocation) {
        await Promise.all([
          octokit.rest.apps.revokeInstallationAccessToken(),
          appkit.rest.apps.revokeInstallationAccessToken()
        ])
      }
    }
  }

  const updateCheckRun: UpdateCheckRun = async (output) => {
    if (check_run_id) {
      await updateChecks({
        kit: octokit,
        owner,
        repo,
        check_run_id,
        details_url,
        output,
        conclusion: 'neutral',
        status: 'in_progress'
      })
    }
  }

  try {
    const result = await handler({
      octokit,
      appkit,
      payload,
      updateCheckRun
    })

    if (result) {
      return await (typeof result === 'string'
        ? close(result)
        : close(result.conclusion, result.output, result.skipTokenRevocation))
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
