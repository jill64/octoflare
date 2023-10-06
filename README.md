# octoflare

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
```

[Type Definition](./src/types/OctoflareHandler.ts)
