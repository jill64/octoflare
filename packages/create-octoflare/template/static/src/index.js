import { octoflare } from 'octoflare'

export default octoflare(async ({ payload, installation }) => {
  if (!installation) {
    return new Response('Skip Event: No Installation', {
      status: 200
    })
  }

  if (!('commits' in payload)) {
    return new Response('Skip Event: No Push Event', {
      status: 200
    })
  }

  const { repository, after } = payload

  if (Number(after) === 0) {
    return new Response('Skip Event: Head SHA = 0', {
      status: 200
    })
  }

  const { dispatchWorkflow } = await installation.createCheckRun({
    repo: repository.name,
    owner: repository.owner.login,
    name: '--APP-NAME--',
    head_sha: after
  })

  await dispatchWorkflow()

  return new Response('--APP-NAME-- Workflow Dispatched', {
    status: 202
  })
})
