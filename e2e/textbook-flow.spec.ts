import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('textbook mode shows a full subsection and unlocks the next subsection after each blank is resolved', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByTestId('start-learning').click()

  await expect(page.getByTestId('textbook-reading-flow')).toContainText('1-1')
  await expect(page.getByTestId('textbook-item-a-1')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-2')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-3')).toBeVisible()
  await expect(page.getByText('1-2　変位')).toHaveCount(0)

  for (const [itemId, answer] of [
    ['a-1', '位置ベクトル'],
    ['a-2', '位置'],
    ['a-3', '位置'],
  ] as const) {
    await page.getByTestId(`textbook-item-${itemId}`).click()
    const inlinePanel = page.getByTestId(`inline-choice-panel-${itemId}`)
    await expect(inlinePanel).toBeVisible()
    await inlinePanel.getByRole('button', { name: answer, exact: true }).click()
    await expect(inlinePanel).toHaveCount(0)
  }

  await expect(page.getByText('1-2　変位')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-4')).toBeVisible()
})

test('a wrong textbook choice stays red, cannot be retried, and reveals the correct answer immediately', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')

  await page.getByTestId('textbook-item-a-1').click()
  const panel = page.getByTestId('inline-choice-panel-a-1')
  await expect(panel).toBeVisible()

  const wrongOption = panel.getByRole('button', { name: '変位', exact: true })
  await wrongOption.click()

  await expect(panel).toBeVisible()
  await expect(wrongOption).toHaveClass(/reading-choice-option--wrong/)
  await expect(wrongOption).toBeDisabled()
  await expect(panel.getByRole('button', { name: '位置ベクトル', exact: true })).toHaveClass(/textbook-choice--correct/)
  await expect(panel.getByRole('button', { name: '位置ベクトル', exact: true })).toBeDisabled()
  await expect(page.getByTestId('answer-reveal-a-1')).toContainText('正解は「位置ベクトル」')
  await expect(page.getByTestId('resolved-a-1')).toContainText('変位')
  await expect(page.getByTestId('resolved-a-1')).toContainText('位置ベクトル')
  await expect(page.getByTestId('textbook-item-a-1')).toHaveCount(0)
})

test('future textbook sections stay locked until the current section is complete', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeDisabled()
  await expect(page.getByRole('button', { name: /例題1/ })).toBeDisabled()
})

test('opening a textbook blank keeps the sentence visible and expands choices directly underneath', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')

  const blank = page.getByTestId('textbook-item-a-1')
  await blank.click()

  await expect(page.getByText('原点 O から点')).toBeVisible()
  const panel = page.getByTestId('inline-choice-panel-a-1')
  await expect(panel).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
