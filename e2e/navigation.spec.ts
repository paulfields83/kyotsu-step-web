import { expect, test } from '@playwright/test'

const routes = [
  '/problems', '/learning/setup', '/learning/session/demo', '/learning/result/demo', '/learning/textbook/physics-a-displacement-velocity',
  '/simulation/setup', '/simulation/session/demo', '/simulation/result/demo', '/analysis',
  '/analysis/knowledge/vector', '/mistakes', '/history', '/ranking', '/profile', '/admin',
]

test('all declared routes render meaningful content', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('main')).not.toHaveText('')
    await expect(page.locator('body')).not.toContainText('APP READY')
  }
})

test('bottom navigation exposes four reachable destinations', async ({ page }) => {
  await page.goto('/problems')
  const nav = page.getByRole('navigation', { name: '主要ナビゲーション' })
  await expect(nav.getByRole('link')).toHaveCount(4)
  await nav.getByRole('link', { name: /分析/ }).click()
  await expect(page).toHaveURL(/\/analysis$/)
  await expect(page.getByRole('heading', { name: '分析', level: 1 })).toBeVisible()
})

test('unknown route has a useful recovery path', async ({ page }) => {
  await page.goto('/missing-route')
  await expect(page.getByRole('heading', { name: 'ページが見つかりません' })).toBeVisible()
  await expect(page.getByRole('link', { name: '問題ページへ' })).toBeVisible()
})


test('secondary screens expose a hierarchical back button while top-level tabs do not', async ({ page }) => {
  await page.goto('/problems')
  await expect(page.getByTestId('app-back-button')).toHaveCount(0)

  await page.goto('/learning/setup')
  const learningBack = page.getByTestId('app-back-button')
  await expect(learningBack).toBeVisible()
  await expect(learningBack).toHaveAttribute('href', '#/problems')

  await page.goto('/simulation/setup')
  await expect(page.getByTestId('app-back-button')).toHaveAttribute('href', '#/problems')

  await page.goto('/history')
  await expect(page.getByTestId('app-back-button')).toHaveAttribute('href', '#/profile')

  await page.goto('/admin')
  await expect(page.getByTestId('app-back-button')).toHaveAttribute('href', '#/profile')
})
