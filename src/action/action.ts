import core from '@actions/core'
import github from '@actions/github'
import { ChecksOutput } from '../types/ChecksOutput.js'
import { Conclusion } from '../types/Conclusion.js'
import { OctoflarePayload } from '../types/OctoflarePayload.js'
import { errorLogging } from '../utils/errorLogging.js'
import { ActionHandler } from './types/ActionHandler.js'

export const action = async (handler: ActionHandler) => {
  const payloadStr = core.getInput('payload', { required: true })
  const payload = JSON.parse(payloadStr) as OctoflarePayload

  const { token, app_token, check_run_id, owner, repo } = payload

  const octokit = github.getOctokit(token)
  const app_kit = github.getOctokit(app_token)

  const { context } = github
  const details_url = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`

  const close = async (conclusion: Conclusion, output?: ChecksOutput) => {
    if (check_run_id) {
      await octokit.rest.checks.update({
        owner,
        repo,
        check_run_id,
        details_url,
        status: 'completed',
        conclusion,
        output
      })

      await Promise.all([
        octokit.rest.apps.revokeInstallationAccessToken(),
        app_kit.rest.apps.revokeInstallationAccessToken()
      ])
    }
  }

  try {
    const result = await handler({
      octokit,
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
        octokit: app_kit,
        ...context.repo,
        error: e,
        info: `
${owner}/${repo} in Action  
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
