import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { isTextbookAnswerCorrect } from '../../src/domain/textbook'
import { findLoadedTextbook, loadedTextbookUnits, textbookImportDiagnostics } from './textbookData'
import { publicTextbookUnit } from './publicTextbook'

const port = Number(process.env.PORT ?? 8787)
const allowedOrigins = (process.env.FRONTEND_ORIGIN?.trim() || '*')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

function headerValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function requestOrigin(request: IncomingMessage) {
  const forwardedProto = headerValue(request.headers['x-forwarded-proto'])?.split(',')[0]?.trim()
  const forwardedHost = headerValue(request.headers['x-forwarded-host'])?.split(',')[0]?.trim()
  const protocol = forwardedProto || 'http'
  const host = forwardedHost || request.headers.host || `localhost:${port}`
  return `${protocol}://${host}`
}

function corsOrigin(request: IncomingMessage) {
  if (allowedOrigins.includes('*')) return '*'
  const origin = request.headers.origin?.replace(/\/$/, '')
  if (origin && allowedOrigins.includes(origin)) return origin
  return allowedOrigins[0] ?? '*'
}

function headers(request: IncomingMessage) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': corsOrigin(request),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Cache-Control': 'no-store',
    Vary: 'Origin',
  }
}

function sendJson(request: IncomingMessage, response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, headers(request))
  response.end(JSON.stringify(value))
}

function assetContentType(fileName: string) {
  switch (extname(fileName).toLowerCase()) {
    case '.svg': return 'image/svg+xml; charset=utf-8'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    default: return 'image/png'
  }
}

function assetHeaders(request: IncomingMessage, fileName: string) {
  return {
    'Content-Type': assetContentType(fileName),
    'Access-Control-Allow-Origin': corsOrigin(request),
    'Cache-Control': 'public, max-age=31536000, immutable',
    Vary: 'Origin',
  }
}

function sendAsset(request: IncomingMessage, response: ServerResponse, filePath: string, fileName: string) {
  response.writeHead(200, assetHeaders(request, fileName))
  createReadStream(filePath).pipe(response)
}

function sendAssetBuffer(request: IncomingMessage, response: ServerResponse, data: Buffer, fileName: string) {
  response.writeHead(200, assetHeaders(request, fileName))
  response.end(data)
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
  if (!request.url) return sendJson(request, response, 400, { error: 'missing URL' })

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers(request))
    return response.end()
  }

  const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`)
  const apiOrigin = requestOrigin(request)

  if (request.method === 'GET' && url.pathname === '/health') {
    return sendJson(request, response, 200, {
      ok: true,
      publishedTextbooks: loadedTextbookUnits.filter(({ unit }) => unit.status === 'published').length,
      mathTextbooks: loadedTextbookUnits
        .filter(({ unit }) => unit.status === 'published' && unit.subject === 'math-1a')
        .map(({ unit }) => ({
          unitId: unit.unitId,
          title: unit.title,
          sections: unit.sections.length,
          items: unit.sections.reduce((total, section) => total + section.items.length, 0),
          figures: unit.sections.reduce((total, section) => total + section.figures.length, 0),
        })),
      textbookImportWarnings: textbookImportDiagnostics,
    })
  }

  if (request.method === 'GET' && url.pathname === '/api/textbooks') {
    return sendJson(
      request,
      response,
      200,
      loadedTextbookUnits
        .filter(({ unit }) => unit.status === 'published')
        .map(({ unit, answerBook }) => publicTextbookUnit(unit, answerBook, apiOrigin)),
    )
  }

  const unitMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)$/)
  if (request.method === 'GET' && unitMatch) {
    const loaded = findLoadedTextbook(decodeURIComponent(unitMatch[1]))
    if (!loaded) return sendJson(request, response, 404, { error: 'textbook unit not found' })
    return sendJson(request, response, 200, publicTextbookUnit(loaded.unit, loaded.answerBook, apiOrigin))
  }

  const assetMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)\/assets\/([^/]+)$/)
  if (request.method === 'GET' && assetMatch) {
    const unitId = decodeURIComponent(assetMatch[1])
    const fileName = decodeURIComponent(assetMatch[2])
    const loaded = findLoadedTextbook(unitId)
    if (!loaded) return sendJson(request, response, 404, { error: 'textbook unit not found' })
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '')
    if (safeName !== fileName || safeName === '.' || safeName === '..') {
      return sendJson(request, response, 400, { error: 'invalid asset name' })
    }

    const importedAsset = loaded.assetMap?.get(safeName)
    if (importedAsset) return sendAssetBuffer(request, response, importedAsset, safeName)

    if (!loaded.dataDir) return sendJson(request, response, 404, { error: 'textbook asset not found' })
    const assetPath = normalize(join(loaded.dataDir, 'assets', safeName))
    if (!existsSync(assetPath)) return sendJson(request, response, 404, { error: 'asset not found' })
    return sendAsset(request, response, assetPath, safeName)
  }

  const answerMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)\/items\/([^/]+)\/answer$/)
  if (request.method === 'POST' && answerMatch) {
    const unitId = decodeURIComponent(answerMatch[1])
    const itemId = decodeURIComponent(answerMatch[2])
    const loaded = findLoadedTextbook(unitId)
    if (!loaded) return sendJson(request, response, 404, { error: 'textbook unit not found' })

    const item = loaded.unit.sections.flatMap((section) => section.items).find((candidate) => candidate.id === itemId)
    if (!item) return sendJson(request, response, 404, { error: 'textbook item not found' })
    const answer = loaded.answerBook.answers[itemId]
    if (!answer) return sendJson(request, response, 500, { error: 'textbook answer key missing' })

    try {
      const body = await readJsonBody(request)
      const value = typeof body === 'object' && body !== null && 'value' in body ? String(body.value) : ''
      if (!value.trim()) return sendJson(request, response, 400, { error: 'answer value is required' })

      const correct = isTextbookAnswerCorrect(answer, value)
      return sendJson(request, response, 200, {
        correct,
        resolved: true,
        ...(correct ? {} : { correctAnswer: answer.answer }),
      })
    } catch (error) {
      return sendJson(request, response, 400, { error: error instanceof Error ? error.message : 'invalid request body' })
    }
  }

  return sendJson(request, response, 404, { error: 'not found' })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`kyotsu-step-api listening on 0.0.0.0:${port}`)
})
