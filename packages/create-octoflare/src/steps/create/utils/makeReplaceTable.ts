import { Params } from '../../../types/Params.js'

export const makeReplaceTable = ({
  name,
  slug,
  description,
  typescript,
  owner
}: Params) => ({
  '--APP-NAME--': name,
  '--app-slug--': slug,
  '--APP-DESCRIPTION--': description ?? '',
  '--GITHUB-REPO-OWNER--': owner,
  '--EXTENSION--': typescript ? 'ts' : 'js',
  '--YYYY-MM-DD--': new Date().toISOString().split('T')[0],
  '--dot-file--': '.'
})
