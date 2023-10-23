import { ActionOctokit } from '../action/index.js'

const limit = (str: string, num: number) =>
  error.message.length > num
    ? `${error.message.substring(0, num)}...`
    : error.message

export const errorLogging = async ({
  octokit,
  repo,
  owner,
  error,
  info
}: {
  octokit: ActionOctokit
  repo: string
  owner: string
  error: Error
  info?: string
}) => {
  try {
    const errorTitle = `Octoflare Error: ${limit(error.message, 64)}`

    const { data: list } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      per_page: 100,
      state: 'open',
      labels: 'octoflare-error'
    })

    const exists = list.find(({ title }) => title === errorTitle)

    if (exists) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: exists.number,
        body: info ?? '+1'
      })
      return
    }

    await octokit.rest.issues.create({
      owner,
      repo,
      title: errorTitle,
      body: limit(
        `# ${error.name}
## Message  
\`\`\`
${error.message}
\`\`\`

## Info  
${info ?? 'No info provided'}

## Stack Trace  
\`\`\`
${error.stack ?? 'No stack trace'}
\`\`\`
`,
        10000
      ),
      labels: ['octoflare-error']
    })
  } catch (e) {
    console.error(e)
  }
}
