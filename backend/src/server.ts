import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { join, normalize } from 'node:path'
import { isTextbookAnswerCorrect } from '../../src/domain/textbook'
import { findLoadedTextbook, loadedTextbookUnits, textbookDataRoot } from './textbookData'
import { publicTextbookUnit } from './publicTextbook'

const port = Number(process.env.PORT ?? 8787)
const frontendOrigin = process.env.FRONTEND_ORIGIN?.trim() || '*'

function headers() {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': frontendOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Cache-Control': 'no-store',
  }
}

function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, headers())
  response.end(JSON.stringify(value))
}

function sendAsset(response: ServerResponse, filePath: string) {
  response.writeHead(200, {
    'Content-Type': 'image/png',
    'Access-Control-Allow-Origin': frontendOrigin,
    'Cache-Control': 'public, max-age=31536000, immutable',
  })
  createReadStream(filePath).pipe(response)
}

async function readJsonBody(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > 16_384) throw new Error('request body too large')
    chunks.push(buffer)
  }
  const text = Buffer.concat(chunks).toString('utf8')
  return text ? JSON.parse(text) as unknown : {}
}

const server = createServer(async (request, response) => {
  if (!request.url) return sendJson(response, 400, { error: 'missing URL' })

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers())
    return response.end()
  }

  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`)

  if (request.method === 'GET' && url.pathname === '/health') {
    return sendJson(response, 200, { ok: true })
  }

  if (request.method === 'GET' && url.pathname === '/api/textbooks') {
    return sendJson(response, 200, loadedTextbookUnits.filter(({ unit }) => unit.status === 'published').map(({ unit, answerBook }) => publicTextbookUnit(unit, answerBook)))
  }

  const unitMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)$/)
  if (request.method === 'GET' && unitMatch) {
    const loaded = findLoadedTextbook(decodeURIComponent(unitMatch[1]))
    if (!loaded) return sendJson(response, 404, { error: 'textbook unit not found' })
    return sendJson(response, 200, publicTextbookUnit(loaded.unit, loaded.answerBook))
  }

  const assetMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)\/assets\/([^/]+)$/)
  if (request.method === 'GET' && assetMatch) {
    const unitId = decodeURIComponent(assetMatch[1])
    const fileName = decodeURIComponent(assetMatch[2])
    const loaded = findLoadedTextbook(unitId)
    if (!loaded) return sendJson(response, 404, { error: 'textbook unit not found' })
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '')
    if (safeName !== fileName) return sendJson(response, 400, { error: 'invalid asset name' })
    const subjectDir = loaded.unit.subject === 'math-1a' ? 'math-1a' : loaded.unit.subject
    const unitDir = unitId === 'math-1a-counting-permutation' ? 'counting-permutation' : unitId
    const assetPath = normalize(join(textbookDataRoot(), subjectDir, unitDir, 'assets', safeName))
    if (!assetPath.startsWith(normalize(textbookDataRoot())) || !existsSync(assetPath)) return sendJson(response, 404, { error: 'asset not found' })
    return sendAsset(response, assetPath)
  }

  const answerMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)\/items\/([^/]+)\/answer$/)
  if (request.method === 'POST' && answerMatch) {
    const unitId = decodeURIComponent(answerMatch[1])
    const itemId = decodeURIComponent(answerMatch[2])
    const loaded = findLoadedTextbook(unitId)
    if (!loaded) return sendJson(response, 404, { error: 'textbook unit not found' })

    const item = loaded.unit.sections.flatMap((section) => section.items).find((candidate) => candidate.id === itemId)
    if (!item) return sendJson(response, 404, { error: 'textbook item not found' })
    const answer = loaded.answerBook.answers[itemId]
    if (!answer) return sendJson(response, 500, { error: 'textbook answer key missing' })

    try {
      const body = await readJsonBody(request)
      const value = typeof body === 'object' && body !== null && 'value' in body ? String(body.value) : ''
      if (!value.trim()) return sendJson(response, 400, { error: 'answer value is required' })

      const correct = isTextbookAnswerCorrect(answer, value)
      return sendJson(response, 200, {
        correct,
        resolved: true,
        ...(correct ? {} : { correctAnswer: answer.answer }),
      })
    } catch (error) {
      return sendJson(response, 400, { error: error instanceof Error ? error.message : 'invalid request body' })
    }
  }

  return sendJson(response, 404, { error: 'not found' })
})

server.listen(port, () => {
  console.log(`kyotsu-step-api listening on http://localhost:${port}`)
})
