import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('simulation hides feedback, restores answers, supports cancel, and scores on submit', async ({ page }) => {
  await page.goto('/simulation/setup')
  await page.getByLabel('問題数').selectOption('1')
  await page.getByTestId('start-simulation').click()
  await expect(page).toHaveURL(/\/simulation\/session\/sim-/)
  await expect(page.locator('main')).not.toContainText('正解')
  await expect(page.locator('main')).not.toContainText('得点')
  await expect(page.locator('main')).not.toContainText('解き方')

  await page.getByTestId('sim-option-mq-sim-x-two').click()
  await page.getByTestId('number-mq-sim-item-2').fill('5')
  await page.getByTestId('review-mq-sim-item-1').click()
  const sessionUrl = page.url()
  await page.reload()
  await expect(page).toHaveURL(sessionUrl)
  await expect(page.getByTestId('sim-option-mq-sim-x-two')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('number-mq-sim-item-2')).toHaveValue('5')

  await page.getByTestId('open-submit').click()
  await expect(page.getByRole('alertdialog')).toContainText('未回答は 0 個')
  await page.getByRole('button', { name: 'キャンセル' }).click()
  await expect(page).toHaveURL(sessionUrl)
  await page.getByTestId('open-submit').click()
  await page.getByRole('button', { name: '提出を確定' }).click()
  await expect(page).toHaveURL(/\/simulation\/result\/sim-/)
  await expect(page.getByTestId('simulation-score')).toContainText('6')
  await expect(page.getByText('失点はありません')).toBeVisible()
})

test('multi-select uses all-or-nothing scoring and wrong answer creates a real reinforcement', async ({ page }) => {
  await page.goto('/simulation/setup')
  await page.getByLabel('難易度').selectOption('basic')
  await page.getByTestId('start-simulation').click()
  await page.getByTestId('sim-option-ms-sim-opt-a').click()
  await page.getByTestId('number-ms-sim-item-2').fill('18')
  await page.getByTestId('open-submit').press('Enter')
  await page.getByRole('button', { name: '提出を確定' }).click()
  await expect(page.getByTestId('simulation-score')).toContainText('3')
  await expect(page.getByText('計算')).toBeVisible()
  await expect(page.getByRole('button', { name: '自力確認へ' })).toBeVisible()
})

test('expired persisted timer auto-submits and records timeout separately', async ({ page }) => {
  await page.goto('/simulation/setup')
  await page.getByRole('radio', { name: '本番時間' }).click()
  await page.getByTestId('start-simulation').click()
  const sessionId = page.url().split('/').at(-1)!
  await page.evaluate(({ id }) => {
    const raw = localStorage.getItem('kyotsu-step-store')!
    const persisted = JSON.parse(raw)
    persisted.state.simulationSessions[id].durationSeconds = 1
    persisted.state.simulationSessions[id].startedAt = Date.now() - 3000
    localStorage.setItem('kyotsu-step-store', JSON.stringify(persisted))
  }, { id: sessionId })
  await page.reload()
  await expect(page).toHaveURL(/\/simulation\/result\/sim-/)
  await expect(page.getByText('時間切れで自動提出しました。')).toBeVisible()
  await expect(page.getByText('時間不足')).toBeVisible()
  await expect(page.getByText('未回答', { exact: true })).toBeVisible()
})
