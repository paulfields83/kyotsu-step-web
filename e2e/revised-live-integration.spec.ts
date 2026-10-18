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

test('GOLDEN home restores the original 数と式 3-row chapter layout', async ({page})=>{
  await page.goto('/#/learn',{waitUntil:'domcontentloaded'})
  await page.getByRole('button',{name:/数学 I・A/}).first().click()
  const card=page.locator('.v2-course-card').filter({hasText:'集合と命題'})
  await expect(card).toBeVisible({timeout:75000})
  await expect(card.locator('.v2-lesson-list > a')).toHaveCount(3)
  await expect(card.locator('.v2-lesson-list > .reading-topic-title')).toHaveCount(0)
  await expect(card.getByRole('link',{name:/第1節.*集合/})).toBeVisible()
  await expect(card.getByRole('link',{name:/第2節.*命題/})).toBeVisible()
  await expect(card.getByRole('link',{name:/第3節.*証明/})).toBeVisible()
})

test('GOLDEN group pages reuse the 数と式 knowledge tile grid, not a flat chapter list', async ({page})=>{
  const groups=[
    {name:'集合',unit:'math-sets',count:7},
    {name:'命題',unit:'math-propositions-reading',count:3},
    {name:'証明',unit:'math-propositions-proof',count:3},
  ]
  for(const group of groups){
    await page.goto('/#/learning/textbook/'+group.unit+'?target=math-golden-group-'+group.unit,{waitUntil:'domcontentloaded'})
    await expect(page.locator('.textbook-section-nav button')).toHaveCount(group.count,{timeout:75000})
    await expect(page.locator('.session-header h1')).toContainText(group.name)
    await expect(page.locator('.textbook-section-heading h2')).not.toBeEmpty()
    if(group.count>1){
      await page.locator('.textbook-section-nav button').nth(1).click()
      await expect(page.locator('.textbook-section-nav button').nth(1)).toHaveAttribute('aria-pressed','true')
    }
  }
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
  await expect(page.locator('.textbook-section-heading h2')).toHaveText('2.2～2.4 必要条件・十分条件・同値条件・否定',{timeout:75_000})
  await expect(page.getByText('レビュー中（未承認）')).toBeVisible()
  await expect(page.locator('.textbook-section')).not.toContainText('条件から真偽を判断する')
})

test('Merged 2.2–2.4: all original subsections appear inside one lesson', async ({page}) => {
  await page.goto('/#/learning/textbook/math-propositions-reading?target=math-golden-proposition-conditions', {waitUntil:'domcontentloaded'})
  await expect(page.locator('.textbook-section-heading h2')).toHaveText('2.2～2.4 必要条件・十分条件・同値条件・否定',{timeout:75_000})
  const topicButtons=page.locator('.reading-topic-nav button')
  await expect(topicButtons).toHaveCount(3)
  await expect(topicButtons.nth(0)).toContainText('2.2')
  await topicButtons.nth(1).click()
  await expect(page.locator('.reading-topic-nav button[aria-pressed="true"]')).toContainText('2.3')
  await topicButtons.nth(2).click()
  await expect(page.locator('.reading-topic-nav button[aria-pressed="true"]')).toContainText('2.4')
})

test('Merged 2.5–2.7: two original backends load in one learning screen', async ({page}) => {
  await page.goto('/#/learning/textbook/math-propositions-reading?target=math-golden-proposition-negation-quantifiers', {waitUntil:'domcontentloaded'})
  const parts=page.locator('[data-testid^="merged-part-"]')
  await expect(parts).toHaveCount(3,{timeout:75_000})
  await expect(page.getByTestId('merged-part-golden-prop-05').locator('h2')).toHaveText('「かつ」「または」の否定')
  await expect(page.getByTestId('merged-part-golden-quant-01').locator('h2')).toHaveText('「ある」を考える')
  await expect(page.getByTestId('merged-part-golden-quant-02').locator('h2')).toHaveText('「すべて」を考える')
  const quant=page.getByTestId('textbook-item-quant-a02')
  await expect(quant).toBeVisible()
  await quant.click()
  const choices=page.getByTestId('inline-choice-panel-quant-a02').locator('.reading-choice-option')
  await expect(choices.first()).toBeVisible()
  await choices.first().click()
  await expect(page.getByTestId('resolved-quant-a02')).toBeVisible()
  await page.reload()
  await expect(parts).toHaveCount(3,{timeout:75_000})
  await expect(page.getByTestId('resolved-quant-a02')).toBeVisible()
})

test('GOLDEN proposition: original staged hints and choices remain operational', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-propositions-reading?target=math-golden-math-propositions-reading-golden-prop-01')
  const answerButton = page.getByTestId('textbook-item-prop-a01')
  await expect(answerButton).toBeVisible({timeout:75000})
  await answerButton.click()
  const panel = page.getByTestId('inline-choice-panel-prop-a01')
  await expect(panel.locator('.reading-choice-option').first()).toBeVisible()
  const hints = panel.getByTestId('textbook-hints-prop-a01')
  await expect(hints).toBeVisible()
  await expect(hints.locator('li')).toHaveCount(0)
  await hints.getByRole('button').click()
  await expect(hints.locator('li')).toHaveCount(1)
  await panel.locator('.reading-choice-option').first().click()
  await expect(page.getByTestId('resolved-prop-a01')).toBeVisible({timeout:15000})
})

test('GOLDEN quantifiers: test the source 「ある」 questions', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-quantifiers-all-exists?target=math-golden-math-quantifiers-all-exists-golden-quant-01')
  const first = page.getByTestId('textbook-item-quant-a02')
  await expect(first).toBeVisible({timeout:75000})
  await first.click()
  const choices = page.getByTestId('inline-choice-panel-quant-a02').locator('.reading-choice-option')
  expect(await choices.count()).toBeGreaterThanOrEqual(2)
  await choices.first().click()
  await expect(page.getByTestId('resolved-quant-a02')).toBeVisible({timeout:15000})
})

test('GOLDEN proof: 逆・裏・対偶 and 背理法 are separately accessible', async ({ page }) => {
  await page.goto('/#/learning/textbook/math-propositions-proof?target=math-golden-math-propositions-proof-golden-proof-01')
  const first = page.getByTestId('textbook-item-proof-a01')
  await expect(first).toBeVisible({timeout:75000})
  await first.click()
  const choices = page.getByTestId('inline-choice-panel-proof-a01').locator('.reading-choice-option')
  expect(await choices.count()).toBeGreaterThanOrEqual(2)
  await choices.first().click()
  await expect(page.getByTestId('resolved-proof-a01')).toBeVisible({timeout:15000})
  await page.goto('/#/learning/textbook/math-propositions-proof?target=math-golden-math-propositions-proof-golden-proof-03')
  await expect(page.locator('.textbook-section-heading h2')).toHaveText('背理法',{timeout:60000})
})

test('GOLDEN membership notation is typeset; original yes/no choices stay binary', async ({page}) => {
  await page.goto('/#/learning/textbook/math-sets?target=math-golden-math-sets-golden-set-01', {waitUntil:'domcontentloaded'})
  for (const [id,right] of [
    ['set-a01','1, 2, 3, 4, 6, 8, 12, 24'],
    ['set-a02','入っている'],
    ['set-a03','入っていない'],
  ]) {
    const trigger=page.getByTestId('textbook-item-'+id)
    await expect(trigger).toBeVisible({timeout:75000})
    await trigger.click()
    await page.locator('.reading-choice-option[data-choice-value='+JSON.stringify(right)+']').click()
  }
  await page.getByTestId('textbook-item-set-a04').click()
  const panel=page.getByTestId('inline-choice-panel-set-a04')
  await expect(panel.locator('.reading-choice-option')).toHaveCount(2)
  await expect(panel.locator('.reading-choice-option .katex')).toHaveCount(2)
  await expect(panel).not.toContainText('この条件だけでは決まらない')
  await expect(panel).not.toContainText('どの選択肢にも当てはまらない')
  await expect(panel.locator('.reading-choice-option .katex-html')).toHaveCount(2)
  const rawChoices = await panel.locator('.reading-choice-option').evaluateAll(
    nodes => nodes.map(node => node.getAttribute('data-choice-value')),
  )
  const correctIndex = rawChoices.indexOf('\\in')
  expect(correctIndex).toBeGreaterThanOrEqual(0)
  await panel.locator('.reading-choice-option').nth(correctIndex).click()
  await expect(page.getByTestId('resolved-set-a04').locator('.katex')).toBeVisible()
  await expect(page.getByTestId('resolved-set-a04').locator('.katex-html')).toBeVisible()
})
