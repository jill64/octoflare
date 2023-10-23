import { ActionOctokit } from '../action/index.js'
import { ChecksOutput } from '../index.js'
import { Conclusion } from '../types/Conclusion.js'
import { limitStr } from './limitStr.js'

export const closeCheckRun = ({
  kit,
  check_run_id,
  owner,
  repo,
  conclusion,
  output,
  details_url
}: {
  kit: ActionOctokit
  check_run_id: number
  owner: string
  repo: string
  conclusion: Conclusion
  output?: ChecksOutput
  details_url?: string
}) =>
  kit.rest.checks.update({
    check_run_id: check_run_id.toString(),
    owner,
    repo,
    status: 'completed',
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
