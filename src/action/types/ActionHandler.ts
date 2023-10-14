import core from '@actions/core'
import github from '@actions/github'
import { OctoflarePayload } from '../../types/OctoflarePayload.js'
import { ActionOctokit } from './ActionOctokit.js'
import { ActionResult } from './ActionResult.js'

export type ActionHandler = (context: {
  core: typeof core
  github: typeof github
  octokit: ActionOctokit
  payload: OctoflarePayload
}) => Promise<ActionResult> | ActionResult
