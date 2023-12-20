import { i18nInit } from '@jill64/svelte-suite'

export const { match, attach, translate } = i18nInit({
  locales: ['en', 'ja'],
  slug: '[locale=locale]',
  defaultLocale: 'en'
})
