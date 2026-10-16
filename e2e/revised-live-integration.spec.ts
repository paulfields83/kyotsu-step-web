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
  const input = page.getByTestId('textbook-free-answer-math-revised-n04-hole-01')
  await expect(input).toBeVisible()
  await input.fill('4')
  await page.locator('.reading-free-answer button[type="submit"]').click()
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
  const count = await options.count()
  if (count >= 2) {
    await options.first().click()
  } else {
    await expect(panel.locator('.reading-free-answer input')).toBeVisible()
    await panel.locator('.reading-free-answer input').fill('3')
    await panel.locator('.reading-free-answer button[type="submit"]').click()
  }
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
