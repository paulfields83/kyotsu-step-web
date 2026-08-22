import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('analysis, mistakes, and history are derived from a real completed attempt', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByRole('radio', { name: /自力確認/ }).click()
  await page.getByTestId('start-learning').click()
  await page.getByTestId('blank-mq-blank-max').click()
  await page.getByTestId('option-mq-max-one').click()
  await expect(page).toHaveURL(/\/learning\/result\/learn-/)

  await page.goto('/analysis')
  await expect(page.getByRole('heading', { name: '分析' })).toBeVisible()
  await expect(page.getByText('0%', { exact: true }).first()).toBeVisible()
  await page.getByRole('link', { name: /maximum/ }).click()
  await expect(page.getByRole('heading', { name: 'maximum' })).toBeVisible()
  await expect(page.getByText('反復誤答', { exact: true })).toBeVisible()

  await page.goto('/mistakes')
  await expect(page.getByText('復習中', { exact: true })).toBeVisible()
  await expect(page.getByText('二次関数の最大値')).toBeVisible()

  await page.goto('/history')
  await expect(page.getByRole('heading', { name: '学習履歴' })).toBeVisible()
  await expect(page.getByText('rev.1')).toBeVisible()
  await expect(page.getByText('0/1 初回正解')).toBeVisible()
})

test('empty analytics states do not fabricate progress', async ({ page }) => {
  await page.goto('/analysis')
  await expect(page.getByText('分析できる記録がありません')).toBeVisible()
  await page.goto('/mistakes')
  await expect(page.getByText('復習する誤答はありません')).toBeVisible()
  await page.goto('/history')
  await expect(page.getByText('履歴はまだありません')).toBeVisible()
})
