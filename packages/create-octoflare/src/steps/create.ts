import * as p from '@clack/prompts'
import { existsSync } from 'node:fs'
import { mkdir, readdir } from 'node:fs/promises'
import { Params } from '../types/Params.js'
import { dynamicTemplates } from './create/dynamicTemplates.js'
import { staticTemplates } from './create/staticTemplates.js'

export const create = async (params: Params) => {
  const { slug } = params

  if (existsSync(slug)) {
    const dir = await readdir(slug)
    if (dir.length > 0) {
      const force = await p.confirm({
        message: 'Directory not empty. Continue?',
        initialValue: true
      })

      if (!force) {
        return process.exit(1)
      }
    }
  } else {
    await mkdir(slug, { recursive: true })
  }

  await Promise.all([staticTemplates(params), dynamicTemplates(params)])
}
