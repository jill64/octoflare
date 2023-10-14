import core from '@actions/core'
import github from '@actions/github'
import { CloseCheckParam } from '../../types/CloseCheckParam.js'
import { OctoflarePayload } from '../../types/OctoflarePayload.js'
import { ActionOctokit } from './ActionOctokit.js'

export type ActionHandler = (context: {
  core: typeof core
  github: typeof github
  octokit: ActionOctokit
  payload: OctoflarePayload
}) => Promise<CloseCheckParam | void> | CloseCheckParam | void
