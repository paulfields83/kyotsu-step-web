import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.goto('/admin')
})

test('valid custom JSON is validated, persisted, previewed, exported, and deleted', async ({ page }) => {
  await page.getByRole('button', { name: /選択中を編集欄へ/ }).click()
  const source = JSON.parse(await page.getByLabel('JSON 編集欄').inputValue())
  source.questionId = 'custom-quadratic-01'
  source.title = '追加した二次関数'
  await page.getByLabel('JSON 編集欄').fill(JSON.stringify(source))
  await page.getByTestId('import-json').click()
  await expect(page.getByRole('status')).toContainText('1 問')
  await expect(page.getByRole('heading', { name: '追加した二次関数' })).toBeVisible()
  await expect(page.getByTestId('question-preview')).toContainText('実数 x')

  await page.reload()
  await page.getByLabel('プレビューする問題').selectOption('custom-quadratic-01')
  await expect(page.getByText('追加問題', { exact: true })).toBeVisible()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /追加題庫を書き出す/ }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('kyotsu-step-custom-questions.json')

  await page.getByLabel('JSON 編集欄').fill('{"schemaVersion":')
  await page.getByTestId('import-json').click()
  await expect(page.getByRole('alert')).toContainText('JSON:')
  await expect(page.getByLabel('プレビューする問題').locator('option[value="custom-quadratic-01"]')).toHaveCount(1)

  await page.getByRole('button', { name: /この追加問題を削除/ }).click()
  await page.getByRole('button', { name: '追加問題を削除', exact: true }).click()
  await expect(page.getByLabel('プレビューする問題').locator('option')).toHaveCount(4)
})

test('schema errors show a path and never enter the usable catalog', async ({ page }) => {
  await page.getByRole('button', { name: /選択中を編集欄へ/ }).click()
  const source = JSON.parse(await page.getByLabel('JSON 編集欄').inputValue())
  source.questionId = 'custom-invalid-01'
  source.learning.variants.selfCheck = ['missing-blank']
  await page.getByLabel('JSON 編集欄').fill(JSON.stringify(source))
  await page.getByTestId('import-json').click()
  await expect(page.getByRole('alert')).toContainText('learning.variants.selfCheck')
  await expect(page.getByLabel('プレビューする問題').locator('option')).toHaveCount(4)
})
