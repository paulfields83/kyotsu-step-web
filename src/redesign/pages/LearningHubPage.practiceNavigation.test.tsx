// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PracticeCatalog, PracticeQuestionSummary } from '../../domain/practice'
import { practiceRepository } from '../../repositories/practiceRepository'
import { textbookRepository } from '../../repositories/textbookRepository'
import { useAppStore } from '../../stores/useAppStore'
import { LearningHubPage } from './LearningHubPage'

vi.mock('../../repositories/practiceRepository', () => ({
  practiceRepository: { listCatalog: vi.fn(), listQuestions: vi.fn() },
}))
vi.mock('../../repositories/textbookRepository', () => ({
  textbookRepository: { listPublished: vi.fn() },
}))

const categories = [
  { id: 'sets', label: '集合を整理する', order: 0, questionCount: 11, problemTypes: [] },
  { id: 'conditions', label: '条件から命題を読む', order: 1, questionCount: 11, problemTypes: [] },
  { id: 'proofs', label: '命題を証明する', order: 2, questionCount: 9, problemTypes: [] },
]

const catalog: PracticeCatalog = {
  schemaVersion: '1.0',
  subject: 'math-1a',
  course: 'math-i',
  majorUnit: { id: 'sets-and-logic', label: '集合と命題', order: 1 },
  subcategories: categories,
}

const questions: PracticeQuestionSummary[] = categories.flatMap((category, categoryIndex) =>
  Array.from({ length: category.questionCount }, (_, index) => ({
    questionId: `4step-${category.id}-${index + 1}`,
    revision: 1,
    subject: 'math-1a',
    course: 'math-i',
    majorUnit: catalog.majorUnit.id,
    subcategory: category.id,
    problemType: 'basic',
    title: `4STEP ${87 + categoryIndex * 11 + index} | ${category.label}の問題`,
    difficulty: 'basic',
    source: { type: 'original', label: '4STEP' },
  })),
)

describe('practice category navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.setState((state) => ({
      settings: { ...state.settings, defaultSubject: 'math-1a' },
    }))
    vi.mocked(textbookRepository.listPublished).mockResolvedValue([])
    vi.mocked(practiceRepository.listCatalog).mockResolvedValue([catalog])
    vi.mocked(practiceRepository.listQuestions).mockResolvedValue(questions)
  })

  it('shows only three section titles outside, and a textbook-style grid after selecting one', async () => {
    render(<MemoryRouter><LearningHubPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /問題練習|题目练习/ }))

    const navigation = await screen.findByTestId('practice-category-list')
    expect(navigation.querySelectorAll('.v2-practice-category-row')).toHaveLength(3)
    expect(screen.queryByTestId('practice-question-tiles')).toBeNull()
    expect(screen.queryByText(/4STEP 87/)).toBeNull()

    fireEvent.click(screen.getByTestId('practice-category-1'))
    const tiles = await screen.findByTestId('practice-question-tiles')
    expect(tiles.querySelectorAll('.v2-practice-topic-tile')).toHaveLength(11)
    expect(screen.queryByTestId('practice-category-list')).toBeNull()
    expect(tiles.querySelector('a')?.getAttribute('href')).toContain('/practice/session/')

    fireEvent.click(screen.getByRole('button', { name: /分野一覧へ戻る|返回分类列表/ }))
    await waitFor(() => {
      expect(screen.getByTestId('practice-category-list').querySelectorAll('.v2-practice-category-row')).toHaveLength(3)
      expect(screen.queryByTestId('practice-question-tiles')).toBeNull()
    })

    fireEvent.click(screen.getByTestId('practice-category-3'))
    expect((await screen.findByTestId('practice-question-tiles'))
      .querySelectorAll('.v2-practice-topic-tile')).toHaveLength(9)
  })
})
