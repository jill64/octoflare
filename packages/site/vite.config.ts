import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // @ts-expect-error
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['@jill64/sentry-sveltekit-cloudflare']
  },
  test: {
    include: ['**/*.test.ts']
  }
})
