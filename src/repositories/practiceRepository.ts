import type { PracticeAnswerResult, PracticeCatalog, PracticeQuestionSummary, PublicPracticeQuestion } from '../domain/practice'

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

function queryString(params: Record<string, string | undefined>) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value)
  })
  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}

class ApiPracticeRepository {
  private readonly baseUrl = apiBaseUrl()

  async listCatalog(params: { subject?: string; course?: string; majorUnit?: string } = {}) {
    const response = await fetch(`${this.baseUrl}/api/practice/catalog${queryString(params)}`)
    return readJson<PracticeCatalog[]>(response)
  }

  async listQuestions(params: { subject?: string; course?: string; majorUnit?: string; subcategory?: string; problemType?: string } = {}) {
    const response = await fetch(`${this.baseUrl}/api/practice/questions${queryString(params)}`)
    return readJson<PracticeQuestionSummary[]>(response)
  }

  async getQuestion(questionId: string) {
    const response = await fetch(`${this.baseUrl}/api/practice/questions/${encodeURIComponent(questionId)}`)
    if (response.status === 404) return undefined
    return readJson<PublicPracticeQuestion>(response)
  }

  async submitAnswer(questionId: string, blankId: string, optionIds: string[]) {
    const response = await fetch(
      `${this.baseUrl}/api/practice/questions/${encodeURIComponent(questionId)}/blanks/${encodeURIComponent(blankId)}/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIds }),
      },
    )
    return readJson<PracticeAnswerResult>(response)
  }
}

export const practiceRepository = new ApiPracticeRepository()
