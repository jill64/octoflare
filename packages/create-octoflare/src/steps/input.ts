import * as p from '@clack/prompts'
import kleur from 'kleur'

export const input = async () => {
  const grouped = await p.group(
    {
      name: () =>
        p.text({
          message: 'App Name',
          placeholder: 'Octoflare App',
          validate: (value: string) => {
            if (!value) {
              return 'This field is required.'
            }
            if (value.length > 50) {
              return 'This field cannot be longer than 50 characters.'
            }
            if (!/^[a-zA-Z0-9-_ ]+$/.test(value)) {
              return 'This field can only contain letters, numbers, hyphens, underscores, and spaces.'
            }
          }
        }),
      description: () =>
        p.text({
          message: `Description ${kleur.gray('(Optional)')}`,
          placeholder: 'A GitHub App built with Octoflare'
        }),
      owner: () =>
        p.text({
          message: 'GitHub Username',
          placeholder: 'username',
          validate: (value: string) => {
            if (!value) {
              return 'This field is required.'
            }
          }
        }),
      typescript: () =>
        p.confirm({
          message: 'Use TypeScript?'
        })
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.')
        process.exit(0)
      }
    }
  )

  return {
    ...grouped,
    slug: grouped.name.toString().toLowerCase().replace(/ /g, '-')
  }
}
