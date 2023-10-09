import { Octokit } from 'octokit'

export type OctoflareInstallation = {
  id: number
  kit: Octokit
  token: string
  createCheckRun: (
    params: NonNullable<Parameters<Octokit['rest']['checks']['create']>[0]>
  ) => ReturnType<Octokit['rest']['checks']['create']>
}
