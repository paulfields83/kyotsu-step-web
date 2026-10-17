import { test, expect } from '@playwright/test'

const mathUrl = '/#/learning/textbook/math-1a-numbers-expressions-revised'
test.setTimeout(90_000)

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => console.log('BROWSER_PAGE_ERROR', String(error)))
  page.on('requestfailed', (request) => console.log('BROWSER_REQUEST_FAILED', request.url(), request.failure()?.errorText))
  page.on('response', (response) => {
    if (response.url().includes('/api/textbooks') && !response.ok()) {
      console.log('BROWSER_TEXTBOOK_API_ERROR', response.status(), response.url())
    }
  })
  await page.goto('/#/health')
  await page.evaluate(() => localStorage.clear())
})

test('N01 revised: the formerly passive equation square is now a real clickable blank', async ({ page }) => {
  await page.goto(mathUrl + '?section=revised-n01', { waitUntil: 'domcontentloaded' })
  const firstFormula = page.getByTestId('textbook-math-item-math-revised-n01-question-01')
  await expect(firstFormula).toBeVisible({ timeout: 60_000 })
  await firstFormula.click()
  const options = page.locator('.reading-inline-choice-panel .reading-choice-option')
  await expect(options).toHaveCount(4)
  await page.locator('.reading-choice-option[data-choice-value="-1"]').click()
  await expect(page.locator('.reading-math-answered').first()).toContainText('-1', { timeout: 10_000 })
  await page.reload()
  await expect(page.locator('.reading-math-answered').first()).toContainText('-1', { timeout: 40_000 })
})

test('N04 revised: manuscript blank opens an answer field, accepts an answer, unlocks and survives reload', async ({ page }) => {
  await page.goto(mathUrl + '?section=revised-n04', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  console.log('N04_BROWSER_PAGE', page.url(), (await page.locator('body').innerText()).slice(0, 400))
  const first = page.getByTestId('textbook-item-math-revised-n04-hole-01')
  await expect(first).toBeVisible({ timeout: 95_000 })
  const image = page.locator('.reading-figure img[src*="N04-F01"]').first()
  await expect(image).toBeVisible({ timeout: 15_000 })
  await expect.poll(() => image.evaluate((img) => (img as HTMLImageElement).naturalWidth), { timeout: 15_000 }).toBeGreaterThan(0)
  await first.click()
  const options = page.locator('.reading-inline-choice-panel .reading-choice-option')
  await expect(options).toHaveCount(4)
  await page.locator('.reading-choice-option[data-choice-value="4"]').click()
  await expect(page.getByTestId('resolved-math-revised-n04-hole-01')).toBeVisible({ timeout: 15_000 })
  await page.reload()
  await expect(page.getByTestId('resolved-math-revised-n04-hole-01')).toBeVisible({ timeout: 60_000 })
})

test('sets-and-propositions: the first guided blank can be opened and answered', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-1a-sets-propositions?section=sec-sets')
  await page.waitForTimeout(4000)
  console.log('SETS_BROWSER_PAGE', page.url(), (await page.locator('body').innerText()).slice(0, 400))
  const first = page.locator('[data-testid^="textbook-item-"]').first()
  await expect(first).toBeVisible({ timeout: 95_000 })
  await first.click()
  const panel = page.locator('[data-testid^="inline-choice-panel-"]').first()
  await expect(panel).toBeVisible()
  const options = panel.locator('.reading-choice-option')
  await expect(options.first()).toBeVisible()
  expect(await options.count()).toBeGreaterThanOrEqual(2)
  await options.first().click()
  await expect(page.locator('[data-testid^="resolved-"]').first()).toBeVisible({ timeout: 15_000 })
})

test('physics textbook: a choice remains answerable after the revised math import', async ({ page }) => {
  await page.goto('/#/learning/textbook/physics-a-displacement-velocity')
  await page.waitForTimeout(4000)
  console.log('PHYS_BROWSER_PAGE', page.url(), (await page.locator('body').innerText()).slice(0, 400))
  const first = page.getByTestId('textbook-item-a-1')
  await expect(first).toBeVisible({ timeout: 95_000 })
  await first.click()
  const panel = page.getByTestId('inline-choice-panel-a-1')
  await expect(panel).toBeVisible()
  await expect(panel.locator('.reading-choice-option').first()).toBeVisible()
  await panel.locator('.reading-choice-option').first().click()
  await expect(page.getByTestId('resolved-a-1')).toBeVisible({ timeout: 15_000 })
})
