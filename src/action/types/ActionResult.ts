import { Conclusion } from '../../types/Conclusion.js'
import { ChecksOutput } from './ChecksOutput.js'

export type ActionResult =
  | Conclusion
  | {
      conclusion: Conclusion
      output: ChecksOutput
    }
  | void
