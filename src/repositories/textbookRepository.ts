import type { PublicTextbookUnit, TextbookAnswerResult } from '../domain/textbookPublic'

export interface TextbookRepository {
  listPublished(): Promise<PublicTextbookUnit[]>
  getById(unitId: string): Promise<PublicTextbookUnit | undefined>
  submitAnswer(unitId: string, itemId: string, value: string): Promise<TextbookAnswerResult>
}

function apiBaseUrl() {
  const env = (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env
  const configured = env?.VITE_API_BASE_URL?.trim()
  return configured ? configured.replace(/\/$/, '') : ''
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `API request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

class ApiTextbookRepository implements TextbookRepository {
  private readonly baseUrl = apiBaseUrl()

  async listPublished() {
    const response = await fetch(`${this.baseUrl}/api/textbooks`)
    return readJson<PublicTextbookUnit[]>(response)
  }

  async getById(unitId: string) {
    const response = await fetch(`${this.baseUrl}/api/textbooks/${encodeURIComponent(unitId)}`)
    if (response.status === 404) return undefined
    return readJson<PublicTextbookUnit>(response)
  }

  async submitAnswer(unitId: string, itemId: string, value: string) {
    const response = await fetch(`${this.baseUrl}/api/textbooks/${encodeURIComponent(unitId)}/items/${encodeURIComponent(itemId)}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    })
    return readJson<TextbookAnswerResult>(response)
  }
}

// Textbook pages depend only on this contract. Content and answer keys now come from the backend API.
export const textbookRepository: TextbookRepository = new ApiTextbookRepository()
