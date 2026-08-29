import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('textbook mode starts without difficulty and preserves retry progress', async ({ page }) => {
  await page.goto('/learning/setup')
  await expect(page.getByRole('radio', { name: /知識を学ぶ/ })).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByLabel('学習する単元')).toHaveValue('physics-a-displacement-velocity')
  await expect(page.getByRole('radiogroup', { name: '誘導レベル' })).toHaveCount(0)

  await page.getByTestId('start-learning').click()
  await expect(page).toHaveURL(/\/learning\/textbook\/physics-a-displacement-velocity$/)
  await expect(page.getByRole('heading', { name: 'A 変位と速度' })).toBeVisible()
  await expect(page.getByText('0/78')).toBeVisible()

  const firstItem = page.getByTestId('textbook-item-a-1')
  await firstItem.getByRole('button', { name: '変位' }).click()
  await expect(firstItem).toContainText('もう一度')

  await firstItem.getByRole('button', { name: '位置ベクトル' }).click()
  await expect(firstItem).toContainText('再回答で正解')

  const url = page.url()
  await page.reload()
  await expect(page).toHaveURL(url)
  await expect(page.getByTestId('textbook-item-a-1').getByRole('button', { name: '位置ベクトル' })).toBeDisabled()
})

test('future textbook sections stay locked until the current section is complete', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()
  await expect(page.getByRole('button', { name: /例題1/ })).toBeDisabled()
})
