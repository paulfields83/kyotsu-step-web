import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/problems')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('skip link and modal keyboard focus work without pointer input', async ({ page }) => {
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: '本文へ移動' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()

  await page.goto('/profile')
  const trigger = page.getByRole('button', { name: /学習記録を消去/ })
  await trigger.click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog.getByRole('button', { name: 'キャンセル' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: '記録を消去', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('critical controls meet touch size and rich content stays inside the viewport', async ({ page }) => {
  for (const route of ['/problems', '/profile', '/admin']) {
    await page.goto(route)
    const undersized = await page.locator('button, a.nav-item, a.raised-link, input:not([type="checkbox"]), select, textarea').evaluateAll((elements) => elements.filter((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 1 && rect.height > 1 && (rect.width < 44 || rect.height < 44)
    }).map((element) => ({ tag: element.tagName, text: element.textContent?.trim().slice(0, 30), box: element.getBoundingClientRect().toJSON() })))
    expect(undersized).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
  }

  await page.goto('/admin')
  await page.getByLabel('プレビューする問題').selectOption('physics-motion-01')
  await expect(page.getByTestId('question-preview').getByRole('img')).toHaveAttribute('alt', /速度/)
  await page.getByLabel('プレビューする問題').selectOption('math-statistics-01')
  await expect(page.getByTestId('question-preview').getByRole('table')).toBeVisible()
  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    tableScrollsInside: Array.from(document.querySelectorAll<HTMLElement>('.table-scroll')).some((element) => element.scrollWidth > element.clientWidth),
  }))
  expect(layout).toEqual({ overflow: false, tableScrollsInside: true })
})
