import { InstallationGetFileOptions } from './InstallationGetFileOptions.js'

type FileData<T> = {
  size: number
  name: string
  path: string
  sha: string
  data: T
}

export type InstallationGetFile = {
  <T>(
    path: string,
    options: InstallationGetFileOptions & {
      parser: (content: string) => T
    }
  ): Promise<FileData<T> | null>
  (path: string, options?: InstallationGetFileOptions): Promise<string | null>
}
