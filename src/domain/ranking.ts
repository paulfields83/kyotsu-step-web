import type { LearningAttempt, SimulationAttempt } from './attempts'

export type RankingEntry = { name: string; points: number; isCurrentUser: boolean }

const demoPeers = [
  { name: '演示 A', points: 92 },
  { name: '演示 B', points: 78 },
  { name: '演示 C', points: 61 },
  { name: '演示 D', points: 35 },
]

export function localPerformancePoints(learningAttempts: LearningAttempt[], simulationAttempts: SimulationAttempt[]) {
  const learningAnswers = learningAttempts.flatMap((attempt) => Object.values(attempt.answers))
  const learningPoints = learningAnswers.reduce((total, answer) => total + (answer.isFirstCorrect ? 10 : 2), 0)
  const simulationPoints = simulationAttempts.reduce((total, attempt) => total + Math.round((attempt.result.earnedScore / Math.max(1, attempt.result.maxScore)) * 30), 0)
  return Math.min(999, learningPoints + simulationPoints)
}

export function buildLocalRanking(name: string, learningAttempts: LearningAttempt[], simulationAttempts: SimulationAttempt[]): RankingEntry[] {
  const current = { name: name.trim() || '学習者', points: localPerformancePoints(learningAttempts, simulationAttempts), isCurrentUser: true }
  return [...demoPeers.map((entry) => ({ ...entry, isCurrentUser: false })), current]
    .sort((left, right) => right.points - left.points || Number(right.isCurrentUser) - Number(left.isCurrentUser))
}
