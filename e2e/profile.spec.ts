import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('profile settings persist and affect the local demo ranking', async ({ page }) => {
  await page.goto('/profile')
  await page.getByLabel('表示名').fill('私の記録')
  await page.getByLabel('既定の科目').selectOption('physics')
  await page.getByRole('checkbox', { name: /動きを減らす/ }).check()
  await page.getByRole('checkbox', { name: /模擬テストの時計/ }).uncheck()
  await page.reload()
  await expect(page.getByLabel('表示名')).toHaveValue('私の記録')
  await expect(page.getByLabel('既定の科目')).toHaveValue('physics')
  await expect(page.locator('.app-frame')).toHaveClass(/app-frame--reduce-motion/)
  await expect(page.getByRole('checkbox', { name: /模擬テストの時計/ })).not.toBeChecked()

  await page.goto('/ranking')
  await expect(page.getByText('ローカル演示', { exact: true })).toBeVisible()
  await expect(page.getByText('私の記録')).toBeVisible()
  await expect(page.getByText('全国順位ではありません')).toBeVisible()
})

test('progress reset requires confirmation and preserves settings', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByRole('radio', { name: /自力確認/ }).click()
  await page.getByTestId('start-learning').click()
  await page.getByTestId('blank-mq-blank-max').click()
  await page.getByTestId('option-mq-max-five').click()
  await page.goto('/profile')
  await expect(page.getByText(/1 学習・0 模擬/)).toBeVisible()
  await page.getByRole('button', { name: /学習記録を消去/ }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await page.getByRole('button', { name: '記録を消去', exact: true }).click()
  await expect(page.getByText(/0 学習・0 模擬/)).toBeVisible()
  await page.goto('/history')
  await expect(page.getByText('履歴はまだありません')).toBeVisible()
})
