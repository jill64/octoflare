import { ActionOctokit } from '../action/index.js'
import { ChecksOutput } from '../index.js'
import { CheckRunStatus } from '../types/CheckRunStatus.js'
import { Conclusion } from '../types/Conclusion.js'
import { limitStr } from './limitStr.js'

export const updateChecks = ({
  kit,
  check_run_id,
  owner,
  repo,
  conclusion,
  output,
  details_url,
  status
}: {
  kit: ActionOctokit
  check_run_id: number
  owner: string
  repo: string
  conclusion: Conclusion | 'neutral'
  status: CheckRunStatus
  output?: ChecksOutput
  details_url?: string
}): Promise<unknown> =>
  kit.rest.checks.update({
    check_run_id,
    owner,
    repo,
    status,
    conclusion,
    details_url,
    output: output
      ? {
          ...output,
          title: limitStr(output.title, 1000),
          summary: limitStr(output.summary, 60000),
          ...(output.text ? { text: limitStr(output.text, 60000) } : {})
        }
      : undefined
  })
