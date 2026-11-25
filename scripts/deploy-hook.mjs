// The deploy service (docker compose --profile autodeploy up -d). After a push to main, GitHub Actions
// (.github/workflows/deploy.yml) POSTs to /_deploy; Caddy passes that here, and this pulls main and rebuilds.
// The request must carry "Authorization: Bearer <DEPLOY_SECRET>". The repo is public; if it turns private,
// set GITHUB_TOKEN (fine-grained: this repo, Contents read-only) and the pull uses it. Local changes on the server stop the pull; that is logged.
import { execFile } from 'node:child_process'
import { createHash, timingSafeEqual } from 'node:crypto'
import { statSync } from 'node:fs'
import { createServer } from 'node:http'
import { promisify } from 'node:util'

const secret = process.env.DEPLOY_SECRET
const token = process.env.GITHUB_TOKEN
if (!secret) { console.error('Set DEPLOY_SECRET in .env.'); process.exit(1) }

const log = (...m) => console.log(new Date().toISOString(), ...m)
const hide = (s) => (token ? String(s).replaceAll(token, '***') : String(s))
const sh = async (cmd, ...args) => (await promisify(execFile)(cmd, args, { maxBuffer: 64 << 20 })).stdout.trim()
const sameSecret = (a) => timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(`Bearer ${secret}`).digest())

const origin = await sh('git', 'remote', 'get-url', 'origin')
const url = token ? origin.replace(/^https:\/\//, `https://x-access-token:${token}@`) : origin
const { uid, gid } = statSync('.git') // what the merge writes goes back to the checkout's owner, not root

let running = false, again = false
async function deploy() {
  if (running) { again = true; return } // one more run after this one, for a push that landed meanwhile
  running = true
  try {
    await sh('git', 'fetch', '-q', url, 'main')
    const next = await sh('git', 'rev-parse', '--short', 'FETCH_HEAD')
    if (next === await sh('git', 'rev-parse', '--short', 'HEAD')) log(`already at ${next}`)
    else {
      log(`deploying ${next}: ${await sh('git', 'log', '-1', '--format=%s', 'FETCH_HEAD')}`)
      await sh('git', 'merge', '-q', '--ff-only', 'FETCH_HEAD')
      await sh('chown', '-R', `${uid}:${gid}`, '.')
      // Not this service itself: recreating it would cut this run short. Restart it by hand when its own setup changes.
      await sh('docker', 'compose', 'up', '-d', '--build', 'web', 'records')
      await sh('docker', 'compose', 'restart', 'records') // a fresh sync picks up record-covers/ and the sync script now
      log(`deployed ${next}`)
    }
  } catch (e) {
    log('deploy failed:', hide(e.stderr || e.message))
  }
  running = false
  if (again) { again = false; deploy() }
}

createServer((req, res) => {
  if (req.method !== 'POST' || !sameSecret(req.headers.authorization ?? '')) return res.writeHead(404).end()
  res.writeHead(202).end('deploying\n')
  deploy()
}).listen(9000, () => log('waiting for GitHub on :9000'))
