import { init } from '@jill64/sentry-sveltekit-cloudflare/client'
import { toast } from '@jill64/svelte-suite'
import { get } from 'svelte/store'

const onError = init('')

export const handleError = onError((e) => {
  if (e.error instanceof Error) {
    get(toast).error(e.error.message)
  }
})
