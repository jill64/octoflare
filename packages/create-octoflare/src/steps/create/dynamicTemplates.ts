import deepmerge from 'deepmerge'
import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Params } from '../../types/Params.js'
import { listup } from './utils/listup.js'
import { preReplaceStr } from './utils/preReplaceStr.js'
import { replaceCopy } from './utils/replaceCopy.js'
import { templateDir } from './utils/templateDir.js'

export const dynamicTemplates = async (params: Params) => {
  const { slug, typescript } = params

  const dynamicDir = path.join(templateDir, 'dynamic')

  const files = await listup('file', dynamicDir, { recursive: false })

  const convert = preReplaceStr(params)

  const results = files.map(async (file) => {
    const src = path.join(dynamicDir, file)
    const dist = path.join(slug, file)

    const extDir = typescript ? 'ts' : 'js'
    const addFileSrc = path.join(dynamicDir, extDir, file)

    if (!existsSync(addFileSrc)) {
      await replaceCopy(src, dist, params)
      return
    }

    const [baseObj, addObj] = await Promise.all([
      readFile(src, 'utf-8').then((data) => JSON.parse(data)),
      readFile(addFileSrc, 'utf-8').then((data) => JSON.parse(data))
    ])

    const mergedObj = deepmerge(baseObj, addObj, {
      customMerge: (key) => {
        console.log('file', file, 'key', key)
        if (key === 'scripts') {
          return (a, b) => ({
            ...a,
            ...b,
            lint: a.lint && b.lint ? `${a.lint} && ${b.lint}` : a.lint ?? b.lint
          })
        }
      }
    })

    const str = convert(JSON.stringify(mergedObj, null, 2))

    await writeFile(dist, str)
  })

  await Promise.all(results)
}
