import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { builtInTextbookUnits } from '../../src/data/textbookUnits.ts'
import { getTextbookChoices, isTextbookAnswerCorrect } from '../../src/domain/textbook.ts'
import type { TextbookUnit } from '../../src/domain/textbookSchema.ts'

const port = Number(process.env.PORT ?? 8787)
const frontendOrigin = process.env.FRONTEND_ORIGIN?.trim() || '*'

function publicUnit(unit: TextbookUnit) {
  return {
    ...unit,
    sections: unit.sections.map((section) => ({
      ...section,
      items: section.items.map((item) => {
        const { answer: _answer, acceptedAnswers: _acceptedAnswers, choices: _choices, ...publicItem } = item
        return {
          ...publicItem,
          choices: getTextbookChoices(unit, item),
        }
      }),
    })),
  }
}

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

function findUnit(unitId: string) {
  return builtInTextbookUnits.find((unit) => unit.unitId === unitId && unit.status === 'published')
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
    return sendJson(response, 200, builtInTextbookUnits.filter((unit) => unit.status === 'published').map(publicUnit))
  }

  const unitMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)$/)
  if (request.method === 'GET' && unitMatch) {
    const unit = findUnit(decodeURIComponent(unitMatch[1]))
    if (!unit) return sendJson(response, 404, { error: 'textbook unit not found' })
    return sendJson(response, 200, publicUnit(unit))
  }

  const answerMatch = url.pathname.match(/^\/api\/textbooks\/([^/]+)\/items\/([^/]+)\/answer$/)
  if (request.method === 'POST' && answerMatch) {
    const unitId = decodeURIComponent(answerMatch[1])
    const itemId = decodeURIComponent(answerMatch[2])
    const unit = findUnit(unitId)
    if (!unit) return sendJson(response, 404, { error: 'textbook unit not found' })

    const item = unit.sections.flatMap((section) => section.items).find((candidate) => candidate.id === itemId)
    if (!item) return sendJson(response, 404, { error: 'textbook item not found' })

    try {
      const body = await readJsonBody(request)
      const value = typeof body === 'object' && body !== null && 'value' in body ? String(body.value) : ''
      if (!value.trim()) return sendJson(response, 400, { error: 'answer value is required' })

      const correct = isTextbookAnswerCorrect(item, value)
      return sendJson(response, 200, {
        correct,
        resolved: true,
        ...(correct ? {} : { correctAnswer: item.answer }),
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
