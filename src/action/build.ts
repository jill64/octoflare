import { build as esbuild } from 'esbuild'

export const build = (
  /** @example 'action/src/index.ts'  */
  source: string,
  /** @example 'action/dist/index.cjs'  */
  dist: string
) =>
  esbuild({
    entryPoints: [source],
    bundle: true,
    platform: 'node',
    target: 'node16',
    outfile: dist
  })
