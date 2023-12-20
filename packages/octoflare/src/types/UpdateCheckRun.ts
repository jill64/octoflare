import { ChecksOutput } from './ChecksOutput.js'

export type UpdateCheckRun = (output: ChecksOutput) => Promise<void>
