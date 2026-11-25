// The deploy service (docker compose --profile autodeploy up -d). After a push to main, GitHub Actions
// (.github/workflows/deploy.yml) POSTs to /_deploy; Caddy passes that here, and this pulls main and rebuilds.
// The request needs no secret: it only says "look at GitHub now", and what gets deployed is always GitHub's main,
// so anyone calling it can at most make the server check again (runs are queued, never parallel). The repo is public; if it turns private,
// set GITHUB_TOKEN (fine-grained: this repo, Contents read-only) and the pull uses it. Local changes on the server stop the pull; that is logged.
import { execFile } from 'node:child_process'
import { statSync } from 'node:fs'
import { createServer } from 'node:http'
import { promisify } from 'node:util'

const token = process.env.GITHUB_TOKEN

const log = (...m) => console.log(new Date().toISOString(), ...m)
const hide = (s) => (token ? String(s).replaceAll(token, '***') : String(s))
const sh = async (cmd, ...args) => (await promisify(execFile)(cmd, args, { maxBuffer: 64 << 20 })).stdout.trim()

// The project this container belongs to (named after the folder on the host), so compose here acts on the same containers.
const project = await sh('docker', 'inspect', process.env.HOSTNAME, '--format', '{{ index .Config.Labels "com.docker.compose.project" }}')
const compose = (...args) => sh('docker', 'compose', '-p', project, ...args)
// A checkout made on Windows has CRLF files that git here would count as local changes; treat them as Windows git does.
const changed = async (crlf) => (await sh('git', '-c', `core.autocrlf=${crlf}`, 'status', '--porcelain', '--untracked-files=no')) !== ''
if (await changed('false') && !(await changed('true'))) await sh('git', 'config', '--global', 'core.autocrlf', 'true')

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
    const has = await sh('git', 'merge-base', '--is-ancestor', 'FETCH_HEAD', 'HEAD').then(() => true, () => false)
    if (has) log(`already has ${next}`)
    else {
      log(`deploying ${next}: ${await sh('git', 'log', '-1', '--format=%s', 'FETCH_HEAD')}`)
      await sh('git', 'merge', '-q', '--ff-only', 'FETCH_HEAD')
      await sh('chown', '-R', `${uid}:${gid}`, '.').catch(() => {}) // not possible (nor needed) on a Windows host's folder
      // Not this service itself: recreating it would cut this run short. Restart it by hand when its own setup changes.
      // A changed sync script or record-covers/ rebuilds records, which then syncs at once.
      await compose('up', '-d', '--build', 'web', 'records')
      log(`deployed ${next}`)
    }
  } catch (e) {
    log('deploy failed:', hide(e.stderr || e.message))
  }
  running = false
  if (again) { again = false; deploy() }
}

createServer((req, res) => {
  if (req.method !== 'POST') return res.writeHead(404).end()
  res.writeHead(202).end('deploying\n')
  deploy()
}).listen(9000, () => log(`waiting for GitHub on :9000 (project ${project})`))
