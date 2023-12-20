<script lang="ts">
  import { translate } from '$lib/i18n'
  import {
    LanguageManager,
    LocaleAlternates,
    OGP,
    ThemeManager,
    Toaster,
    theme
  } from '@jill64/svelte-suite'
  import '../app.postcss'

  $: title = $translate({
    en: 'Title',
    ja: 'タイトル'
  })

  $: description = $translate({
    en: 'Description',
    ja: '説明'
  })

  $: suffix = $theme === 'dark' ? '-dark' : ''
  $: suffix
</script>

<Toaster dark={$theme === 'dark'} />
<LanguageManager />
<LocaleAlternates />
<ThemeManager />
<OGP
  {title}
  {description}
  site_name={title}
  image="https://example.com/og-image.png"
/>
<svelte:head>
  <!-- 
    <link rel="icon" href="{base}/favicon{suffix}.png" />
    <link rel="icon" href="{base}/favicon{suffix}.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="{base}/apple-touch-icon{suffix}.png" />
  -->
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>
<slot />
