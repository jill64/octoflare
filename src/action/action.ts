import core from '@actions/core'
import github from '@actions/github'
import { ActionOctokit } from './index.js'
import { Finish } from './types/Finish.js'

export const action = async (
  main: (context: {
    core: typeof core
    github: typeof github
    octokit: ActionOctokit
    owner: string
    repo: string
    finish: Finish
  }) => unknown
) => {
  const token = core.getInput('token', { required: true })
  const octokit = github.getOctokit(token)

  const cid = core.getInput('check_run_id')
  const check_run_id = cid ? parseInt(cid) : null

  const { context } = github
  const details_url = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`

  const owner = core.getInput('owner', { required: true })
  const repo = core.getInput('repo', { required: true })

  const finish = (async (conclusion, params, revokeToken) => {
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
    if (revokeToken) {
      await octokit.rest.apps.revokeInstallationAccessToken()
    }
  }) as Finish

  try {
    await main({
      core,
      github,
      octokit,
      owner,
      repo,
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
