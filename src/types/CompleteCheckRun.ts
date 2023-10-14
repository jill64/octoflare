import { ChecksOutput } from './ChecksOutput.js'
import { Conclusion } from './Conclusion.js'

export type CompleteCheckRun = (
  conclusion: Conclusion,
  output?: ChecksOutput
) => Promise<void>
