import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, extname } from 'node:path'

const root = process.cwd()
const errors = []
const warnings = []

const rel = (p) => p.replaceAll('\\', '/')
const full = (p) => join(root, p)
const fail = (msg) => errors.push(msg)
const warn = (msg) => warnings.push(msg)

function requireFile(path) {
  if (!existsSync(full(path))) fail(`missing required file: ${path}`)
}

function read(path) {
  return existsSync(full(path)) ? readFileSync(full(path), 'utf8') : ''
}

const requiredFiles = [
  'AGENTS.md',
  'governance/CONSTITUTION.md',
  'governance/DOCUMENT_AUTHORITY.md',
  'governance/CHANGE_PROTOCOL.md',
  'navigation/MASTER_MATCH_GRAPH.md',
  'navigation/CURRENT_POSITION.md',
  'memory/PROJECT_BRIEF.md',
  'memory/ACTIVE_CONTEXT.md',
  'memory/PROGRESS.md',
  'subjects/mathematics/AGENTS.md',
  'subjects/mathematics/textbook/SPEC.md',
  'subjects/mathematics/practice/SPEC.md',
  'subjects/physics/AGENTS.md',
  'subjects/physics/textbook/SPEC.md',
  'subjects/physics/practice/SPEC.md',
]

for (const path of requiredFiles) requireFile(path)

const graph = read('navigation/MASTER_MATCH_GRAPH.md')
for (let n = 0; n <= 8; n += 1) {
  const id = `R${String(n).padStart(2, '0')}`
  if (!graph.includes(id)) fail(`MASTER_MATCH_GRAPH missing node: ${id}`)
}

const current = read('navigation/CURRENT_POSITION.md')
for (const heading of ['## Current Node', '## Current Rule', '## Next Executable Work']) {
  if (!current.includes(heading)) fail(`CURRENT_POSITION missing heading: ${heading}`)
}

const specs = [
  'subjects/mathematics/textbook/SPEC.md',
  'subjects/mathematics/practice/SPEC.md',
  'subjects/physics/textbook/SPEC.md',
  'subjects/physics/practice/SPEC.md',
]

for (const path of specs) {
  const text = read(path)
  if (!/^Status:\s+(CANONICAL|CANONICAL-CANDIDATE)\s*$/m.test(text)) {
    fail(`${path}: invalid or missing Status`)
  }
  for (const marker of ['Purpose', 'Verification gate', 'Out of scope']) {
    if (!text.toLowerCase().includes(marker.toLowerCase())) {
      fail(`${path}: missing required section "${marker}"`)
    }
  }
}

const constitution = read('governance/CONSTITUTION.md')
if (!constitution.includes('Amendment')) warn('Constitution does not mention amendment governance')
if (!constitution.includes('Canonical Truth')) fail('Constitution missing Canonical Truth principle')

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}

for (const p of walk(root)) {
  const rp = rel(relative(root, p))
  if (!rp.includes('/') && rp.toLowerCase().endsWith('.zip')) {
    warn(`root binary archive needs provenance classification: ${rp}`)
  }
}

const physicsRoot = full('backend/data/textbooks/physics')
for (const p of walk(physicsRoot)) {
  const rp = rel(relative(root, p))
  if (rp.toLowerCase().includes('1d-acceleration')) {
    warn(`retired/stale physics identifier candidate: ${rp}`)
  }
}

const textExtensions = new Set(['.md', '.ts', '.tsx', '.js', '.mjs', '.json', '.yml', '.yaml', '.css'])
for (const base of ['subjects', 'governance', 'navigation']) {
  for (const p of walk(full(base))) {
    if (!textExtensions.has(extname(p).toLowerCase())) continue
    const rp = rel(relative(root, p))
    const text = readFileSync(p, 'utf8')
    if (/\]\((?:\.\.\/|\.\/)[^)]+\)/.test(text)) {
      warn(`relative markdown link requires migration-era review: ${rp}`)
    }
  }
}

console.log('Juku repository governance check')
console.log(`errors: ${errors.length}`)
for (const message of errors) console.error(`ERROR: ${message}`)
console.log(`warnings: ${warnings.length}`)
for (const message of warnings) console.warn(`WARN: ${message}`)

if (errors.length) process.exit(1)
