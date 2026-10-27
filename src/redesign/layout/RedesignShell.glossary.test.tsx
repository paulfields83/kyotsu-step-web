// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { InlineMath } from 'react-katex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RedesignShell } from './RedesignShell'

describe('standalone study terminology reference', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
  })

  const renderLesson = (path: string) => render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<RedesignShell />}>
          <Route path="/learning/textbook/:unitId" element={
            <article data-testid="lesson-body">
              <p>集合 A の意味を確認する。</p>
              <InlineMath math="A=\\{1,2,3\\}" />
            </article>
          } />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

  it('opens only on tapping the header shortcut, never annotating the lesson body', () => {
    const { container } = renderLesson('/learning/textbook/physics-a-displacement-velocity-revised')
    const shortcut = screen.getByTestId('term-glossary-trigger')
    expect(screen.queryByTestId('term-glossary-panel')).toBeNull()
    expect(container.querySelectorAll('.symbol-glossary-trigger')).toHaveLength(0)

    fireEvent.click(shortcut)
    const panel = screen.getByTestId('term-glossary-panel')
    expect(within(panel).getByText(/変位ベクトル/)).toBeTruthy()
    expect(within(panel).queryByText('実数全体の集合')).toBeNull()
    expect(screen.getByTestId('lesson-body').textContent).toContain('集合 A')
    expect(container.querySelectorAll('.symbol-glossary-trigger')).toHaveLength(0)

    fireEvent.click(within(panel).getByRole('button', { name: '数学' }))
    expect(within(panel).getByText('実数全体の集合')).toBeTruthy()
    expect(within(panel).queryByText(/変位ベクトル/)).toBeNull()

    fireEvent.click(within(panel).getByRole('button', { name: '閉じる' }))
    expect(screen.queryByTestId('term-glossary-panel')).toBeNull()
    expect(screen.getByTestId('lesson-body').querySelectorAll('.katex')).toHaveLength(1)
  })

  it('opens directly on the conventional mathematical symbols tab in math lessons', () => {
    renderLesson('/learning/textbook/math-sets')
    fireEvent.click(screen.getByTestId('term-glossary-trigger'))
    const panel = screen.getByTestId('term-glossary-panel')
    expect(within(panel).getByText('実数全体の集合')).toBeTruthy()
    expect(within(panel).queryByText(/初速度/)).toBeNull()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTestId('term-glossary-panel')).toBeNull()
  })
})
