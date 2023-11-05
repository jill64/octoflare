export type InstallationGetFileOptions = {
  /**
   * The name of the commit/branch/tag.
   * @default the repository’s default branch.
   */
  ref?: string

  /**
   * Get file data as raw string
   */
  raw?: boolean
}
