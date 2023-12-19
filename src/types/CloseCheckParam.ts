import { ChecksOutput } from './ChecksOutput.js'
import { Conclusion } from './Conclusion.js'

export type CloseCheckParam =
  | Conclusion
  | {
      conclusion: Conclusion
      output: ChecksOutput
      /**
       * Skip automatic token expiration when handler execution is complete.
       * Due to security concerns, please avoid enabling this option if at all possible.
       * @default false
       */
      skipTokenRevocation?: boolean
    }
