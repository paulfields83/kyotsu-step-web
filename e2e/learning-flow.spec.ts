import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('common-test learning uses original question, guide, retry, then original choices', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByRole('radio', { name: /問題を解く/ }).click()
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByRole('radio', { name: /詳細穴埋め/ }).click()
  await page.getByTestId('start-learning').click()
  await expect(page).toHaveURL(/\/learning\/session\/learn-/)

  await expect(page.getByTestId('common-test-original')).toBeVisible()
  await expect(page.getByText('x=2 秒のとき、最大の高さは 5 m')).toBeVisible()
  await page.getByTestId('open-guide').click()

  await page.getByTestId('blank-mq-blank-sign').click()
  await page.getByTestId('option-mq-sign-minus').click()
  await expect(page.getByTestId('answer-mq-blank-sign')).toContainText('初回正解')

  await page.getByTestId('option-mq-vertex-minus-two').click()
  await expect(page.getByTestId('answer-mq-blank-vertex')).toContainText('不正解')
  await page.getByTestId('retry-mq-blank-vertex').click()
  await page.getByTestId('option-mq-vertex-two').click()
  await expect(page.getByTestId('answer-mq-blank-vertex')).toContainText('再回答で正解')

  await page.getByTestId('option-mq-max-five').click()
  await expect(page.getByTestId('open-final-choice')).toBeEnabled()
  await page.getByTestId('open-final-choice').click()
  await expect(page.getByTestId('common-test-final')).toBeVisible()

  await page.getByTestId('final-option-mq-final-b').click()
  await expect(page.getByText('不正解です。ガイドを見直すか、もう一度選んでください。')).toBeVisible()

  await page.getByTestId('final-option-mq-final-a').click()
  await expect(page).toHaveURL(/\/learning\/result\/learn-/)
  await expect(page.getByTestId('correct-count')).toContainText('2')
})

test('self-check keeps only the configured guide blank before the final original choice', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByRole('radio', { name: /問題を解く/ }).click()
  await page.getByLabel('学習する問題').selectOption('math-quadratic-01')
  await page.getByRole('radio', { name: /自力確認/ }).click()
  await page.getByTestId('start-learning').click()
  await page.getByTestId('open-guide').click()

  await expect(page.getByTestId('blank-mq-blank-max')).toBeVisible()
  await expect(page.locator('[data-testid^="blank-"]')).toHaveCount(1)
  await expect(page.getByText('提示済み')).toHaveCount(2)
})
