import { ChecksOutput } from '../../types/ChecksOutput.js'
import { Conclusion } from '../../types/Conclusion.js'

export type ActionResult =
  | Conclusion
  | {
      conclusion: Conclusion
      output: ChecksOutput
    }
  | void
