export type OctoflarePayload = {
  token: string
  app_token: string
  repo: string
  owner: string
  check_run_id?: number
}
