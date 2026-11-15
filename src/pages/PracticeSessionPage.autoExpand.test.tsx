// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
    vi.mocked(practiceRepository.submitAnswer).mockImplementation(async (_questionId, _blankId, optionIds) => ({
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
  it('settles a wrong choice once, preserves it, displays correct value and explanation, and advances', async () => {
    vi.mocked(practiceRepository.submitAnswer).mockImplementation(async (_questionId, blankId, optionIds) => {
      if (blankId === 'blank-1') {
        return {
          correct: false, resolved: true, selectedOptionIds: optionIds,
          correctOptionIds: ['option-1'], wrongReason: '第一の選択肢を見直します。',
          explanation: '最初のステップはこの考え方を使います。',
        }
      }
      return {
        correct: true, resolved: true, selectedOptionIds: optionIds,
        correctOptionIds: ['option-3'], explanation: '第二のステップを確認します。',
        fullExplanation: 'この問題の解法をまとめます。',
      }
    })

    render(
      <MemoryRouter initialEntries={['/practice/session/practice-auto-open']}>
        <Routes><Route path="/practice/session/:questionId" element={<PracticeSessionPage />} /></Routes>
      </MemoryRouter>,
    )

    const first = await screen.findByRole('group', { name: '第一の空欄【①】' })
    fireEvent.click(within(first).getByText('第一不正解'))

    const feedback = await screen.findByTestId('practice-answer-feedback-blank-1')
    expect(feedback.textContent).toContain('不正解')
    expect(screen.getByTestId('practice-selected-answer-blank-1').textContent).toContain('第一不正解')
    expect(screen.getByTestId('practice-correct-answer-blank-1').textContent).toContain('第一正解')
    expect(screen.getByTestId('practice-explanation-blank-1').textContent).toContain('最初のステップ')
    expect(within(feedback).getByText(/第一の選択肢を見直します/)).toBeTruthy()
    expect(screen.getByTestId('practice-blank-resolved-blank-1').textContent).toContain('第一不正解')
    // The correct value must also appear directly after the wrong answer,
    // not only in the explanation card below the step.
    const inlineCorrect = screen.getByTestId('practice-inline-correct-blank-1')
    expect(inlineCorrect.textContent).toContain('第一正解')
    expect(inlineCorrect.previousElementSibling?.textContent).toContain('第一不正解')
    expect(screen.queryByRole('group', { name: '第一の空欄【①】' })).toBeNull()

    const second = await screen.findByRole('group', { name: '第二の空欄【②】' })
    fireEvent.click(within(second).getByText('第二正解'))
    await waitFor(() => expect(screen.getByTestId('practice-full-explanation').textContent)
      .toContain('この問題の解法をまとめます'))
    expect(screen.getByTestId('practice-explanation-blank-2').textContent).toContain('第二のステップ')
  })

  it('shows a correct-answer chip even when the prompt has no bracketed marker', async () => {
    vi.mocked(practiceRepository.getQuestion).mockResolvedValue({
      ...question,
      blanks: question.blanks.map((blank) => blank.id === 'blank-1'
        ? { ...blank, prompt: 'マーカーのない空欄' }
        : blank),
    })
    vi.mocked(practiceRepository.submitAnswer).mockResolvedValue({
      correct: false,
      resolved: true,
      selectedOptionIds: ['option-2'],
      correctOptionIds: ['option-1'],
      explanation: '正答の考え方を説明します。',
    })

    render(
      <MemoryRouter initialEntries={['/practice/session/practice-auto-open']}>
        <Routes><Route path="/practice/session/:questionId" element={<PracticeSessionPage />} /></Routes>
      </MemoryRouter>,
    )

    const first = await screen.findByRole('group', { name: 'マーカーのない空欄' })
    fireEvent.click(within(first).getByText('第一不正解'))

    const inline = await screen.findByTestId('practice-inline-correct-blank-1')
    expect(inline.textContent).toContain('第一正解')
    expect(inline.previousElementSibling?.textContent).toContain('第一不正解')
    expect(screen.getByTestId('practice-explanation-blank-1').textContent).toContain('正答の考え方')
  })

})
