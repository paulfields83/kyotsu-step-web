import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})


test('setup selects a math unit, then a learning item, then switches topic buttons', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByRole('button', { name: '数学 I・A' }).click()

  const chapter = page.locator('#textbook-chapter')
  await expect(chapter.locator('option')).toContainText(['集合と命題', '場合の数と確率'])
  await chapter.selectOption({ label: '集合と命題' })

  const lesson = page.locator('#textbook-lesson')
  await expect(lesson.locator('option')).toContainText(['集合', '命題', '証明'])
  await lesson.selectOption({ label: '命題' })
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/math-1a-sets-propositions\?target=math-sets-propositions-sec-propositions/)
  await expect(page.getByRole('heading', { name: '集合と命題：命題' })).toBeVisible()
  await expect(page.getByRole('button', { name: /2\.1 命題と真偽/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /2\.2 条件と集合・反例/ })).toBeDisabled()
  await expect(page.getByRole('button', { name: /2\.3 必要条件と十分条件/ })).toBeDisabled()
  await expect(page.getByRole('heading', { name: '2.1 命題と真偽' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '2.2 条件と集合・反例' })).toHaveCount(0)
})

test('setup groups physics into units and 1A/1B/1C learning items', async ({ page }) => {
  await page.goto('/learning/setup')

  const chapter = page.locator('#textbook-chapter')
  await expect(chapter.locator('option')).toContainText([
    '運動の表し方',
    '剛体にはたらく力',
    '運動量と衝突',
    '円運動と単振動',
    '万有引力と天体運動',
  ])
  await chapter.selectOption({ label: '運動の表し方' })

  const lesson = page.locator('#textbook-lesson')
  await expect(lesson.locator('option')).toContainText(['1A 変位と速度', '1B 速度の合成と分解', '1C 相対速度'])
  await lesson.selectOption({ label: '1B 速度の合成と分解' })
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/physics-1b-velocity-composition-decomposition\?target=physics-1b-velocity-composition-decomposition/)
  await expect(page.getByRole('heading', { name: '運動の表し方：1B 速度の合成と分解' })).toBeVisible()
  await expect(page.getByRole('button', { name: /1B\.1 知識点チェック/ })).toBeEnabled()
  await expect(page.getByRole('button', { name: /1B\.2 図の読み取り/ })).toBeDisabled()
})

test('textbook mode unlocks the next subsection after the current one is resolved', async ({ page }) => {
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
    await inlinePanel.getByRole('button', { name: answer, exact: true }).click()
    await expect(inlinePanel).toHaveCount(0)
  }

  await expect(page.getByText('1-2　変位')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-4')).toBeVisible()
})

test('a wrong textbook choice is resolved immediately and reveals the correct answer', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')

  await page.getByTestId('textbook-item-a-1').click()
  const panel = page.getByTestId('inline-choice-panel-a-1')
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
