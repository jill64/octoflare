import { OctoflarePayloadData } from './OctoflarePayloadData.js'

export type DispatchWorkflow<Data extends OctoflarePayloadData> =
  Data extends undefined ? () => Promise<void> : (data: Data) => Promise<void>
