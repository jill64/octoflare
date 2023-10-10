# Octoflare

[![npm](https://img.shields.io/npm/v/octoflare)](https://npmjs.com/package/octoflare)
[![CI](https://github.com/jill64/octoflare/actions/workflows/ci.yml/badge.svg)](https://github.com/jill64/octoflare/actions/workflows/ci.yml)

A framework for building GitHub Apps with Cloudflare Worker

## Installation

```sh
npm i octoflare
```

## Example

```js
// src/index.js
import { octoflare } from 'octoflare'

export default octoflare(({ request, env, app, payload }) => {
  // Application Code
})
```

```toml
# wrangler.toml
name = "YOUR_APP_NAME"
main = "src/index.js"
compatibility_date = "YYYY-MM-DD"
compatibility_flags = ["nodejs_compat"]

# ... Other Configs

```

The following must be set as environment variables for Cloudflare Workers

| Key                         | Value                                            |
| --------------------------- | ------------------------------------------------ |
| OCTOFLARE_APP_ID            | GitHub App ID                                    |
| OCTOFLARE_PRIVATE_KEY_PKCS8 | GitHub App private key converted to PKCS8 format |
| OCTOFLARE_WEBHOOK_SECRET    | GitHub App Webhook Secret                        |

[Type Definition](./src/types/OctoflareHandler.ts)

## Convert Privatekey

Before using the private key provided by GitHub, you need to convert it to PKCS8 format with the command below.

```sh
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private-key.pem -out private-key-pkcs8.key
```
