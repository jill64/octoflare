import { attach as lang_attach } from '$lib/i18n'
import { init } from '@jill64/sentry-sveltekit-cloudflare/server'
import { ogpAttach, onRender } from '@jill64/svelte-suite'
import { sequence } from '@sveltejs/kit/hooks'

const { onHandle, onError } = init('')

export const handle = onHandle(sequence(lang_attach, onRender(), ogpAttach))
export const handleError = onError()
