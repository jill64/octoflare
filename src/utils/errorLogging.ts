import { ActionOctokit } from '../action/index.js'

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
    const limitedErrorMessage =
      error.message.length > 30
        ? `${error.message.substring(0, 30)}...`
        : error.message

    const errorTitle = `Octoflare Error: ${limitedErrorMessage}`

    const { data: list } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      per_page: 100,
      state: 'all',
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
      body: `# ${error.name}
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
      labels: ['octoflare-error']
    })
  } catch (e) {
    console.error(e)
  }
}
