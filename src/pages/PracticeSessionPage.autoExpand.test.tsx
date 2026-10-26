// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicPracticeQuestion } from '../domain/practice'
import { practiceRepository } from '../repositories/practiceRepository'
import { PracticeSessionPage } from './PracticeSessionPage'

vi.mock('../repositories/practiceRepository', () => ({
  practiceRepository: {
    getQuestion: vi.fn(),
    submitAnswer: vi.fn(),
  },
}))

const question: PublicPracticeQuestion = {
  schemaVersion: '1.0',
  questionId: 'practice-auto-open',
  revision: 1,
  status: 'published',
  subject: 'math-1a',
  course: 'math-i',
  majorUnit: 'sets-and-logic',
  subcategory: '命題',
  problemType: 'basic',
  title: 'Auto-open regression',
  difficulty: 'basic',
  source: { type: 'original', label: 'test' },
  stem: [{ id: 'stem-1', type: 'text', text: '問題を解いてください。' }],
  solutionSteps: [
    { id: 'step-1', dependsOn: [], basis: [], purpose: '', operation: '第一歩', content: [], blankIds: ['blank-1'] },
    { id: 'step-2', dependsOn: ['step-1'], basis: [], purpose: '', operation: '第二歩', content: [], blankIds: ['blank-2'] },
  ],
  blanks: [
    { id: 'blank-1', stepId: 'step-1', prompt: '第一の空欄【①】', answerType: 'single-choice', options: [
      { id: 'option-1', label: '第一正解' }, { id: 'option-2', label: '第一不正解' },
    ] },
    { id: 'blank-2', stepId: 'step-2', prompt: '第二の空欄【②】', answerType: 'single-choice', options: [
      { id: 'option-3', label: '第二正解' }, { id: 'option-4', label: '第二不正解' },
    ] },
  ],
  interaction: { reveal: 'sequential', options: 'inline-expand', substituteCorrectAnswer: true, lockFutureSteps: true },
}

describe('practice auto-expanded current choice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(practiceRepository.getQuestion).mockResolvedValue(question)
    vi.mocked(practiceRepository.submitAnswer).mockImplementation(async (_questionId, blankId, optionIds) => ({
      correct: true, resolved: true, selectedOptionIds: optionIds, correctOptionIds: optionIds,
    }))
  })

  it('shows the first choice immediately and opens only the next after answering', async () => {
    render(
      <MemoryRouter initialEntries={['/practice/session/practice-auto-open']}>
        <Routes><Route path="/practice/session/:questionId" element={<PracticeSessionPage />} /></Routes>
      </MemoryRouter>,
    )

    const first = await screen.findByRole('group', { name: '第一の空欄【①】' })
    expect(within(first).getByText('第一正解')).toBeTruthy()
    expect(screen.queryByRole('group', { name: '第二の空欄【②】' })).toBeNull()
    fireEvent.click(within(first).getByText('第一正解'))

    const second = await screen.findByRole('group', { name: '第二の空欄【②】' })
    expect(within(second).getByText('第二正解')).toBeTruthy()
    expect(screen.queryByRole('group', { name: '第一の空欄【①】' })).toBeNull()
  })
})
