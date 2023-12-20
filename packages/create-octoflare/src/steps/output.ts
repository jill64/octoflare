import kleur from 'kleur'
import { Params } from '../types/Params.js'

export const output = ({ name, slug, description, owner }: Params) => {
  // https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-using-url-parameters#creating-a-custom-configuration-url-with-query-parameters
  const newAppLink = () => {
    const url = new URL('https://github.com/settings/apps/new')

    url.searchParams.set('name', name)

    if (description) {
      url.searchParams.set('description', description)
    }

    url.searchParams.set('url', `https://github.com/${owner}/${slug}`)
    url.searchParams.set('webhook_active', 'true')
    url.searchParams.set('webhook_url', 'https://example.com')
    url.searchParams.set('public', 'false')
    url.searchParams.set('actions', 'write')
    url.searchParams.set('checks', 'write')
    url.searchParams.set('issues', 'write')

    return kleur.blue(url.href)
  }

  // https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository#creating-a-new-repository-from-a-url-query
  const newRepoLink = () => {
    const url = new URL('https://github.com/new')

    url.searchParams.set('name', slug)
    url.searchParams.set('owner', owner)

    if (description) {
      url.searchParams.set('description', description)
    }

    return kleur.blue(url.href)
  }

  return `${kleur.green('✔︎ Done')}

What's next?

1. Create GitHub App: ${newAppLink()}

2. Create Repository: ${newRepoLink()}

3. Set Environment Variables: ${kleur.cyan(`cat ./${slug}/wrangler.toml`)}

4. Start Development: ${kleur.cyan(`cd ./${slug}`)}
`
}
