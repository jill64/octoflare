import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { Params } from '../../types/Params.js'
import { listup } from './utils/listup.js'
import { replaceCopy } from './utils/replaceCopy.js'
import { templateDir } from './utils/templateDir.js'

export const staticTemplates = async (params: Params) => {
  const { slug, typescript } = params

  const staticDir = path.join(templateDir, 'static')

  const [allDirs, allFiles] = await Promise.all([
    listup('dir', staticDir),
    listup('file', staticDir)
  ])

  await Promise.all(
    allDirs.map((dir) => mkdir(path.join(slug, dir), { recursive: true }))
  )

  const results = allFiles.map(async (file) => {
    const src = path.join(staticDir, file)
    const target = path.join(slug, file)
    const dist = typescript ? target.replace('.js', '.ts') : target
    await replaceCopy(src, dist, params)
  })

  await Promise.all(results)
}
