import core from '@actions/core'
import github from '@actions/github'
import { OctoflarePayload } from '../types/OctoflarePayload.js'
import { ActionOctokit } from './index.js'
import { Finish } from './types/Finish.js'

export const action = async (
  main: (context: {
    core: typeof core
    github: typeof github
    octokit: ActionOctokit
    payload: OctoflarePayload
    finish: Finish
  }) => unknown
) => {
  const payloadStr = core.getInput('payload', { required: true })

  const payload = JSON.parse(payloadStr) as OctoflarePayload
  const { token, check_run_id, owner, repo } = payload

  const octokit = github.getOctokit(token)

  const { context } = github
  const details_url = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`

  const finish = (async (conclusion, params) => {
    if (check_run_id) {
      await octokit.rest.checks.update({
        owner,
        repo,
        check_run_id,
        details_url,
        status: 'completed',
        conclusion,
        ...params
      })
    }
  }) as Finish

  try {
    await main({
      core,
      github,
      octokit,
      payload,
      finish
    })
  } catch (e) {
    await finish('failure', {
      output: {
        title: 'Octoflare Action Error',
        summary: e instanceof Error ? e.message : 'Unknown error'
      }
    })

    throw e
  }
}
