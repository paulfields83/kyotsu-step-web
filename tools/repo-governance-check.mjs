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
  'governance/INSTRUCTION_DICTIONARY.md',
  'governance/COMMAND_WORDS.md',
  'governance/WORK_SYSTEM.md',
  'navigation/MASTER_MATCH_GRAPH.md',
  'navigation/CURRENT_POSITION.md',
  'memory/PROJECT_BRIEF.md',
  'memory/ACTIVE_CONTEXT.md',
  'memory/PROGRESS.md',
  'work/README.md',
  'work/templates/WORK.md',
  'work/templates/PROPOSAL.md',
  'work/templates/ACTION_LOG.md',
  'work/templates/FINDINGS.md',
  'work/templates/VERIFICATION.md',
  'subjects/mathematics/AGENTS.md',
  'subjects/mathematics/textbook/SPEC.md',
  'subjects/mathematics/practice/SPEC.md',
  'subjects/physics/AGENTS.md',
  'subjects/physics/textbook/SPEC.md',
  'subjects/physics/practice/SPEC.md',
]

for (const path of requiredFiles) requireFile(path)

const instructionDictionary = read('governance/INSTRUCTION_DICTIONARY.md')
if (!instructionDictionary.includes('CMD-ROOT-001')) fail('instruction dictionary missing CMD-ROOT-001')
if (!instructionDictionary.includes('Canonical Phrase: **憲法から**')) fail('CMD-ROOT-001 missing canonical phrase 憲法から')
if (!instructionDictionary.includes('live `main`')) fail('CMD-ROOT-001 missing live main verification')
if (!instructionDictionary.includes('Priority: HIGHEST')) fail('CMD-ROOT-001 is not marked highest priority')
if (!instructionDictionary.includes('## Instruction Matching Rule')) fail('instruction dictionary missing matching rule')
if (!instructionDictionary.includes('## CMD-WORK-001 — 修正')) fail('instruction dictionary missing CMD-WORK-001 修正')
if (!instructionDictionary.includes('### 2. SIMILAR')) fail('instruction dictionary missing SIMILAR confirmation rule')
if (!instructionDictionary.includes('今回この指示として扱いますか？')) fail('SIMILAR rule missing explicit user confirmation prompt')
if (!instructionDictionary.includes('REVIEW-FEEDBACK ≠ APPROVAL')) fail('instruction dictionary missing review-feedback approval separation')
if (!instructionDictionary.includes('修正版Proposalをユーザーへ全文提示する')) fail('CMD-WORK-001 missing revised-proposal presentation gate')
if (!instructionDictionary.includes('### Review-link handoff')) fail('CMD-WORK-001 missing review-link handoff')
if (!instructionDictionary.includes('rendered app / preview / directly reviewable screen')) fail('CMD-WORK-001 missing review-link priority')


const workSystem = read('governance/WORK_SYSTEM.md')
if (!workSystem.includes('REVIEW-FEEDBACK ≠ APPROVAL')) fail('WORK_SYSTEM missing review-feedback approval separation')
if (!workSystem.includes('### Proposal review loop')) fail('WORK_SYSTEM missing proposal review loop')
if (!workSystem.includes('The revised proposal must be shown before implementation.')) fail('WORK_SYSTEM missing revised-proposal-before-implementation rule')
if (!workSystem.includes('## 12A. User review handoff')) fail('WORK_SYSTEM missing user review handoff rule')
if (!workSystem.includes('A correction handoff must not end as prose-only')) fail('WORK_SYSTEM missing correction review-link requirement')


const proposalTemplate = read('work/templates/PROPOSAL.md')
if (!proposalTemplate.includes('### Review History')) fail('PROPOSAL template missing review history')



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


const commandWords = read('governance/COMMAND_WORDS.md')
if (!commandWords.includes('Approval Check')) fail('COMMAND_WORDS missing approval-state gate')
if (!commandWords.includes('governance/WORK_SYSTEM.md')) fail('COMMAND_WORDS does not route to WORK_SYSTEM')

const agents = read('AGENTS.md')
if (!agents.includes('governance/WORK_SYSTEM.md')) fail('AGENTS does not route concrete work to WORK_SYSTEM')

const allowedWorkStatuses = new Set([
  'UNDEFINED',
  'PROPOSED',
  'APPROVED',
  'IMPLEMENTING',
  'VERIFYING',
  'DONE',
  'BLOCKED',
  'REVISE-PROPOSAL',
  'FAILED-VERIFICATION',
])

const requiredWorkRecords = [
  'WORK.md',
  'PROPOSAL.md',
  'ACTION_LOG.md',
  'FINDINGS.md',
  'VERIFICATION.md',
]

const workItemsRoot = full('work/items')
if (existsSync(workItemsRoot)) {
  for (const name of readdirSync(workItemsRoot)) {
    const itemDir = join(workItemsRoot, name)
    if (!statSync(itemDir).isDirectory()) continue

    for (const record of requiredWorkRecords) {
      const path = rel(relative(root, join(itemDir, record)))
      if (!existsSync(join(itemDir, record))) fail(`${name}: missing Work record ${record}`)
    }

    const workPath = rel(relative(root, join(itemDir, 'WORK.md')))
    const workText = read(workPath)
    const statusMatch = workText.match(/^Status:\s+([A-Z-]+)\s*$/m)
    if (!statusMatch) {
      fail(`${name}: WORK.md missing Status`)
      continue
    }

    const status = statusMatch[1]
    if (!allowedWorkStatuses.has(status)) fail(`${name}: invalid Work status ${status}`)

    const proposalPath = rel(relative(root, join(itemDir, 'PROPOSAL.md')))
    const proposalText = read(proposalPath)
    if (['APPROVED', 'IMPLEMENTING', 'VERIFYING', 'DONE'].includes(status) && !/^Status:\s+APPROVED\s*$/m.test(proposalText)) {
      fail(`${name}: executable Work status requires an APPROVED proposal`)
    }

    const verificationPath = rel(relative(root, join(itemDir, 'VERIFICATION.md')))
    const verificationText = read(verificationPath)
    if (status === 'DONE' && !/^Status:\s+PASS\s*$/m.test(verificationText)) {
      fail(`${name}: DONE requires VERIFICATION Status: PASS`)
    }
  }
}

const physicsChapterArchitecture = 'src/data/textbook/ch01/chapter1Architecture.ts'
if (!existsSync(full(physicsChapterArchitecture))) {
  warn('Physics Chapter 1 three-chunk learner architecture is not yet implemented on this tree')
}

const textbookCatalog = read('src/domain/textbookCatalog.ts')
if (
  textbookCatalog.includes('function physicsUnitLabel')
  && textbookCatalog.includes('${code} ')
) {
  warn('Physics learner lesson labels still expose internal 1A-1G codes; internal IDs may remain, learner-facing major labels should not')
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
