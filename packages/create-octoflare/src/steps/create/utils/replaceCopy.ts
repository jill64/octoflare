import { readFile, writeFile } from 'node:fs/promises'
import { Params } from '../../../types/Params.js'
import { preReplaceStr } from './preReplaceStr.js'

export const replaceCopy = async (
  src: string,
  dist: string,
  params: Params
) => {
  const srcStr = await readFile(src, 'utf-8')

  const convert = preReplaceStr(params)

  const convertedDist = convert(dist)
  const convertedStr = convert(srcStr)

  await writeFile(convertedDist, convertedStr)
}
