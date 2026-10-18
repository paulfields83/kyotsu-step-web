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
  // The source square must disappear; showing "✓ -1" next to "□" is a regression.
  const filledFormula = page.getByTestId('textbook-math-filled-math-revised-n01-question-01')
  await expect(filledFormula).toContainText('-1', { timeout: 10_000 })
  await expect(filledFormula).not.toContainText('□')
  await page.reload()
  await expect(filledFormula).toContainText('-1', { timeout: 40_000 })
  await expect(filledFormula).not.toContainText('□')
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

test('GOLDEN 集合: reads mother text, selects the 24 divisors and keeps the answer after reload', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-sets', {waitUntil: 'domcontentloaded'})
  await expect(page.getByText('第1部　集合を表す')).toBeVisible({ timeout: 75_000 })
  await expect(page.getByText(/24の正の約数/).first()).toBeVisible()
  const first = page.getByTestId('textbook-item-set-a01')
  await expect(first).toBeVisible()
  await first.click()
  const panel = page.getByTestId('inline-choice-panel-set-a01')
  await expect(panel.locator('.reading-choice-option')).toHaveCount(4)
  await panel.locator('.reading-choice-option[data-choice-value="1, 2, 3, 4, 6, 8, 12, 24"]').click()
  await expect(page.getByTestId('resolved-set-a01')).toBeVisible({timeout: 15_000})
  await page.reload()
  await expect(page.getByTestId('resolved-set-a01')).toBeVisible({timeout: 50_000})
})

test('review-only proposition lesson remains accessible under its source status', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-propositions-reading')
  const first = page.locator('[data-testid^="textbook-item-"]').first()
  await expect(first).toBeVisible({timeout: 75_000})
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

test('GOLDEN knowledge taxonomy: chapter opens three subchapters with distinct links', async ({ page }) => {
  await page.goto('/#/learn', {waitUntil:'domcontentloaded'})
  await page.getByRole('button', {name:/数学 I・A/}).first().click()
  const card = page.locator('.v2-course-card').filter({hasText:'集合と命題'})
  await expect(card).toBeVisible({timeout:75_000})
  await expect(card.locator('.v2-lesson-group')).toHaveCount(3)
  await expect(card.locator('.v2-lesson-group').first().locator('a')).toHaveCount(7)
  await expect(card.locator('.v2-lesson-group').nth(1).locator('a')).toHaveCount(7)
  await expect(card.locator('.v2-lesson-group').nth(2).locator('a')).toHaveCount(3)
  await expect(card.getByText('「すべて」を考える')).toHaveCount(1)
  await card.locator('.v2-lesson-group').nth(1).locator('summary').click()
  await expect(card.getByRole('link',{name:/2.1 命題の真偽/})).toBeVisible()
})

test('GOLDEN only renders requested knowledge point and keeps other lessons accessible', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-sets?target=math-golden-math-sets-golden-set-02', {waitUntil:'domcontentloaded'})
  await expect(page.locator('.textbook-section-heading h2')).toHaveText('集合の表し方', {timeout:75_000})
  await expect(page.locator('.textbook-section')).not.toContainText('24の正の約数')
  await expect(page.locator('.textbook-section')).not.toContainText('共通部分と和集合')
  await page.goto('/#/learning/textbook/math-sets?target=math-golden-math-sets-golden-set-01')
  await expect(page.getByText(/24の正の約数/).first()).toBeVisible()
  await expect(page.getByTestId('textbook-item-set-a01')).toBeVisible()
})

test('GOLDEN proposition review preserves its own smaller section and status', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-propositions-reading?target=math-golden-math-propositions-reading-golden-prop-02')
  await expect(page.locator('.textbook-section-heading h2')).toHaveText('必要条件と十分条件',{timeout:75_000})
  await expect(page.getByText('レビュー中（未承認）')).toBeVisible()
  await expect(page.locator('.textbook-section')).not.toContainText('条件から真偽を判断する')
})
