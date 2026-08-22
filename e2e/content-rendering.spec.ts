import { expect, test } from '@playwright/test'

test('catalog preview renders LaTeX, image and table from question data', async ({ page }) => {
  await page.goto('/admin')
  const select = page.getByLabel('プレビューする問題')
  await select.selectOption('physics-motion-01')
  await expect(page.getByTestId('question-preview').locator('img')).toHaveAttribute('alt', /速度–時間グラフ/)

  await select.selectOption('math-statistics-01')
  await expect(page.getByTestId('question-preview').locator('table')).toBeVisible()

  await select.selectOption('math-quadratic-01')
  await expect(page.getByTestId('latex-block')).toBeVisible()
})
