import { Octokit } from 'octokit'
import { DispatchWorkflow } from './DispatchWorkflow.js'

export type OctoflareInstallation = {
  id: number
  kit: Octokit
  token: string
  createCheckRun: (
    params: NonNullable<Parameters<Octokit['rest']['checks']['create']>[0]>
  ) => Promise<DispatchWorkflow>
}
