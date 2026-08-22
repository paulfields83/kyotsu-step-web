import { describe, expect, it } from 'vitest'

describe('phase 00 baseline', () => {
  it('runs the unit test environment', () => {
    expect('共通 STEP').toContain('STEP')
  })
})
