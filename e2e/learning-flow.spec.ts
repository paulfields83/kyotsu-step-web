import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('wrong answer fills the correct answer, records explanation, restores, and completes', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByRole('radio', { name: /詳細穴埋め/ }).click()
  await page.getByTestId('start-learning').click()
  await expect(page).toHaveURL(/\/learning\/session\/learn-/)

  await page.getByTestId('blank-mq-blank-sign').click()
  await page.getByTestId('option-mq-sign-minus').click()
  await expect(page.getByTestId('answer-mq-blank-sign')).toContainText('初回正解')

  await page.getByTestId('option-mq-vertex-minus-two').click()
  await expect(page.getByTestId('answer-mq-blank-vertex')).toContainText('初回誤答')
  await expect(page.getByTestId('answer-mq-blank-vertex')).toContainText('2')
  await page.getByRole('button', { name: '閉じる' }).click()

  await page.getByTestId('explain-mq-blank-vertex').click()
  await expect(page.getByRole('heading', { name: 'この手順の解き方' })).toBeVisible()
  await expect(page.getByText('最初の答えが違う理由')).toBeVisible()
  await page.getByRole('button', { name: '閉じる' }).click()

  const sessionUrl = page.url()
  await page.reload()
  await expect(page).toHaveURL(sessionUrl)
  await expect(page.getByTestId('answer-mq-blank-vertex')).toContainText('初回誤答')

  await page.getByTestId('blank-mq-blank-max').click()
  await page.getByTestId('option-mq-max-five').click()
  await expect(page).toHaveURL(/\/learning\/result\/learn-/)
  await expect(page.getByTestId('correct-count')).toContainText('2')
  await expect(page.getByText('67%')).toBeVisible()
  await expect(page.getByText('maximum')).toBeVisible()
  await expect(page.getByRole('button', { name: /同類問題/ })).toBeVisible()
})

test('self-check variant exposes only its configured blank', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByRole('radio', { name: /自力確認/ }).click()
  await page.getByTestId('start-learning').click()
  await expect(page.getByTestId('blank-mq-blank-max')).toBeVisible()
  await expect(page.locator('[data-testid^="blank-"]')).toHaveCount(1)
  await expect(page.getByText('提示済み')).toHaveCount(2)
})
