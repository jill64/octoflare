import { OctoflarePayloadData } from './OctoflarePayloadData.js'

export type OctoflarePayload<Data extends OctoflarePayloadData> = {
  token: string
  app_token: string
  repo: string
  owner: string
  check_run_id?: number
} & (Data extends undefined ? unknown : { data: Data })
