import { describe, expect, it } from 'vitest'
import { getBuiltInQuestion } from '../data/questions'
import { answerSimulationItem, createSimulationSession } from './simulation'
import { remainingSimulationSeconds, scoreSimulation } from './scoring'

const statistics = getBuiltInQuestion('math-statistics-01')!

describe('simulation scoring', () => {
  it('scores multi-select only when the complete stable-id set matches', () => {
    let session = createSimulationSession([statistics], 'exam', 1000, 'sim-test')
    session = answerSimulationItem(session, 'ms-sim-item-1', ['ms-sim-opt-a'], undefined, 2000)
    expect(scoreSimulation(session, [statistics]).earnedScore).toBe(0)
    session = answerSimulationItem(session, 'ms-sim-item-1', ['ms-sim-opt-b', 'ms-sim-opt-a'], undefined, 2500)
    expect(scoreSimulation(session, [statistics]).earnedScore).toBe(4)
  })

  it('scores numeric tolerance and keeps unanswered separate from knowledge errors', () => {
    let session = createSimulationSession([statistics], 'unlimited', 1000, 'sim-number')
    session = answerSimulationItem(session, 'ms-sim-item-2', [], 18, 2000)
    const result = scoreSimulation(session, [statistics])
    expect(result.earnedScore).toBe(3)
    expect(result.unansweredCount).toBe(1)
    expect(result.errorTypes).toContain('unanswered')
    expect(result.errorTypes).not.toContain('knowledge-error')
  })

  it('derives remaining time from startedAt instead of mutable countdown state', () => {
    const session = createSimulationSession([statistics], 'exam', 1000, 'sim-time')
    expect(remainingSimulationSeconds(session, 4000)).toBe((session.durationSeconds ?? 0) - 3)
    expect(remainingSimulationSeconds({ ...session, durationSeconds: 2 }, 4000)).toBe(0)
  })
})
