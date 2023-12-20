import { ChecksOutput } from './ChecksOutput.js'
import { Conclusion } from './Conclusion.js'

export type CloseCheckParam =
  | Conclusion
  | {
      conclusion: Conclusion
      output: ChecksOutput
    }
