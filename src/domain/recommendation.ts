import type { SimulationAttempt } from './attempts'
import type { Question } from './questionSchema'

export type ReinforcementRecommendation = {
  questionId: string
  reason: string
  sourceItemIds: string[]
}

export function generateReinforcement(attempt: SimulationAttempt, catalog: Question[], recentlyUsedIds: string[] = []): ReinforcementRecommendation[] {
  const excluded = new Set([...attempt.questionIds, ...recentlyUsedIds])
  const wrongItems = attempt.result.items.filter((item) => !item.isCorrect)
  const candidateScores = new Map<string, { score: number; sourceItemIds: Set<string> }>()
  for (const wrong of wrongItems) {
    const source = catalog.find((question) => question.questionId === wrong.questionId)
    const directIds = source ? Object.values(source.relatedQuestions).flat() : []
    for (const candidate of catalog) {
      if (excluded.has(candidate.questionId)) continue
      if (source && candidate.subject !== source.subject) continue
      let score = directIds.includes(candidate.questionId) ? 4 : 0
      score += candidate.taxonomy.knowledgeTags.filter((tag) => wrong.knowledgeTags.includes(tag)).length * 2
      score += candidate.taxonomy.skillTags.filter((tag) => wrong.skillTags.includes(tag)).length
      if (score <= 0) continue
      const current = candidateScores.get(candidate.questionId) ?? { score: 0, sourceItemIds: new Set<string>() }
      current.score += score
      current.sourceItemIds.add(wrong.itemId)
      candidateScores.set(candidate.questionId, current)
    }
  }
  return [...candidateScores.entries()]
    .sort((left, right) => right[1].score - left[1].score || left[0].localeCompare(right[0]))
    .slice(0, 3)
    .map(([questionId, value]) => ({ questionId, reason: '誤答した知識・解き方に近い既存問題', sourceItemIds: [...value.sourceItemIds] }))
}
