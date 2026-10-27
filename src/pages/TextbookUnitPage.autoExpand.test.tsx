// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicTextbookUnit } from '../domain/textbookPublic'
import { textbookRepository } from '../repositories/textbookRepository'
import { useAppStore } from '../stores/useAppStore'
import { TextbookUnitPage } from './TextbookUnitPage'

vi.mock('../repositories/textbookRepository', () => ({
  textbookRepository: {
    getById: vi.fn(),
    listPublished: vi.fn(),
    submitAnswer: vi.fn(),
  },
}))

const unit: PublicTextbookUnit = {
  schemaVersion: '1.0',
  unitId: 'math-auto-expand-test',
  revision: 1,
  status: 'published',
  subject: 'math-1a',
  title: '数学Ⅰ テスト',
  source: { type: 'original', label: 'test' },
  objectives: ['選択肢の展開'],
  sections: [{
    id: 'section-one',
    number: '1',
    title: '選択肢の表示',
    figures: [],
    items: [
      { id: 'choice-one', label: '①', prompt: '最初の質問', answerType: 'text', choices: ['正しい', '誤り'] },
      { id: 'choice-two', label: '②', prompt: '次の質問', answerType: 'text', choices: ['続行', '終了'] },
    ],
    readingFlow: [
      { id: 'block-one', type: 'paragraph', parts: [
        { type: 'text', text: '最初の質問：' }, { type: 'choice', itemId: 'choice-one' },
      ] },
      { id: 'block-two', type: 'paragraph', parts: [
        { type: 'text', text: '次の質問：' }, { type: 'choice', itemId: 'choice-two' },
      ] },
    ],
  }],
}

describe('textbook choice auto-expand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAppStore.setState({ textbookProgress: {} })
    vi.mocked(textbookRepository.getById).mockResolvedValue(unit)
    vi.mocked(textbookRepository.submitAnswer).mockImplementation(async (_unitId, itemId, value) => {
      const answer = itemId === 'choice-one' ? '正しい' : '続行'
      return { correct: value === answer, resolved: true, correctAnswer: answer }
    })
  })

  it('breaks long set options and successive definitions into safe mobile-width fragments', async () => {
    const longSets = '∅,{1},{2},{3},{1,2},{1,3},{2,3},{1,2,3}'
    vi.mocked(textbookRepository.getById).mockResolvedValue({
      ...unit,
      sections: [{
        ...unit.sections[0],
        items: [{ ...unit.sections[0].items[0], choices: [longSets, '∅'] }],
        readingFlow: [{
          id: 'long-sets-formula',
          type: 'formula',
          parts: [
            { type: 'math', latex: 'A=\\{1,2,3\\}, B=\\{1,3\\}, C=\\{1,4\\}' },
            { type: 'choice', itemId: 'choice-one' },
          ],
        }],
      }],
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/learning/textbook/math-auto-expand-test']}>
        <Routes><Route path="/learning/textbook/:unitId" element={<TextbookUnitPage />} /></Routes>
      </MemoryRouter>,
    )

    await screen.findByTestId('inline-choice-panel-choice-one')
    expect(container.querySelectorAll('.reading-math-assignment').length).toBe(3)
    expect(container.querySelectorAll('.reading-math-set-entry').length).toBe(8)
    expect(container.querySelector('.reading-choice-options')).not.toBeNull()
  })

  it('shows the current choice without clicking and advances even after a wrong answer', async () => {
    render(
      <MemoryRouter initialEntries={['/learning/textbook/math-auto-expand-test']}>
        <Routes><Route path="/learning/textbook/:unitId" element={<TextbookUnitPage />} /></Routes>
      </MemoryRouter>,
    )

    const first = await screen.findByTestId('inline-choice-panel-choice-one')
    expect(within(first).getByTestId('textbook-choice-choice-one-1')).toBeTruthy()
    expect(screen.queryByTestId('inline-choice-panel-choice-two')).toBeNull()

    fireEvent.click(within(first).getByTestId('textbook-choice-choice-one-1'))

    await waitFor(() => {
      expect(screen.getByTestId('answer-reveal-choice-one')).toBeTruthy()
      expect(screen.getByTestId('inline-choice-panel-choice-two')).toBeTruthy()
    })

    fireEvent.click(within(screen.getByTestId('inline-choice-panel-choice-two')).getByTestId('textbook-choice-choice-two-0'))
    await waitFor(() => expect(screen.queryByTestId('inline-choice-panel-choice-two')).toBeNull())
  })
})
