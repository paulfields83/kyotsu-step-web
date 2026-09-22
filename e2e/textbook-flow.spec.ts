import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})


test('setup selects a textbook section and opens only that section content', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByRole('button', { name: '数学 I・A' }).click()

  const select = page.locator('#textbook-unit')
  await expect(select.locator('option')).toContainText(['集合と命題：集合', '集合と命題：命題', '集合と命題：証明'])
  await select.selectOption({ label: '集合と命題：命題' })
  await page.getByTestId('start-learning').click()

  await expect(page).toHaveURL(/math-1a-sets-propositions\?section=sec-propositions/)
  await expect(page.getByRole('heading', { name: '集合と命題：命題' })).toBeVisible()
  await expect(page.getByRole('button', { name: /2\.1 命題と真偽/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /2\.2 条件と集合・反例/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /2\.3 必要条件と十分条件/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: '2.1 命題と真偽' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '2.2 条件と集合・反例' })).toHaveCount(0)

  await page.getByRole('button', { name: /2\.2 条件と集合・反例/ }).click()
  await expect(page.getByRole('heading', { name: '2.2 条件と集合・反例' })).toBeVisible()
  await expect(page.getByRole('heading', { name: '2.1 命題と真偽' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '1.1 集合と要素' })).toHaveCount(0)
})

test('textbook mode keeps all subsections visible from the start', async ({ page }) => {
  await page.goto('/learning/setup')
  await page.getByTestId('start-learning').click()

  await expect(page.getByTestId('textbook-reading-flow')).toContainText('1-1')
  await expect(page.getByTestId('textbook-item-a-1')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-2')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-3')).toBeVisible()
  await expect(page.getByText('1-2　変位')).toBeVisible()
  await expect(page.getByTestId('textbook-item-a-4')).toBeVisible()
})

test('a wrong textbook choice stays retryable and does not reveal the correct answer', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')

  await page.getByTestId('textbook-item-a-1').click()
  const panel = page.getByTestId('inline-choice-panel-a-1')
  await expect(panel).toBeVisible()

  const wrongOption = panel.getByRole('button', { name: '変位', exact: true })
  await wrongOption.click()

  await expect(panel).toBeVisible()
  await expect(wrongOption).toHaveClass(/reading-choice-option--wrong/)
  await expect(wrongOption).toBeEnabled()
  await expect(panel).toContainText('不正解')
  await expect(panel).not.toContainText('正解は')
  await expect(page.getByTestId('textbook-item-a-1')).toBeVisible()

  await panel.getByRole('button', { name: '位置ベクトル', exact: true }).click()
  await expect(panel).toHaveCount(0)
  await expect(page.getByTestId('resolved-a-1')).toContainText('変位')
  await expect(page.getByTestId('resolved-a-1')).toContainText('位置ベクトル')
})

test('all textbook sections are open from the start', async ({ page }) => {
  await page.goto('/learning/textbook/physics-a-displacement-velocity')
  await expect(page.getByRole('button', { name: /図の読み取り/ })).toBeEnabled()
  await expect(page.getByRole('button', { name: /例題1/ })).toBeEnabled()
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
