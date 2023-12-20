import { Params } from '../../../types/Params.js'
import { makeReplaceTable } from './makeReplaceTable.js'

export const preReplaceStr = (params: Params) => {
  const table = makeReplaceTable(params)
  return (str: string) =>
    Object.entries(table).reduce(
      (prev, [key, value]) => prev.replaceAll(key, value),
      str
    )
}
