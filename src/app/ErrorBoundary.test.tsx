// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function Broken(): ReactNode {
  throw new Error('test render failure')
}

describe('ErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks())

  it('shows a recoverable fallback when a route render fails', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(<ErrorBoundary><Broken /></ErrorBoundary>)
    expect(screen.getByRole('heading', { name: '表示を続けられませんでした' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '再読み込み' })).toBeTruthy()
  })
})
