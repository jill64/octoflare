import { readdir } from 'node:fs/promises'
import path from 'node:path'

export const listup = async (
  type: 'file' | 'dir',
  dir: string,
  options: {
    recursive?: boolean
  } = {
    recursive: true
  }
) => {
  const { recursive } = options

  const files = await readdir(dir, {
    withFileTypes: true,
    recursive
  })

  return files
    .filter((item) => (type === 'dir' ? item.isDirectory() : item.isFile()))
    .map((item) => path.relative(dir, path.join(item.path, item.name)))
}
