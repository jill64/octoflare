import { build } from 'esbuild'

build({
  entryPoints: ['action/src/index.--EXTENSION--'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'action/dist/index.cjs'
})
