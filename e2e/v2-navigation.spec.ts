import { expect, test } from '@playwright/test'

test('legacy top-level routes redirect into the V2 information architecture', async ({ page }) => {
  await page.goto('/learn')
  await expect(page).toHaveURL(/\/courses/)

  await page.goto('/problems')
  await expect(page).toHaveURL(/\/practice/)

  await page.goto('/profile')
  await expect(page).toHaveURL(/\/settings/)

  await page.goto('/learning/setup')
  await expect(page).toHaveURL(/\/practice/)
})

test('primary navigation exposes only home, courses, practice, and progress', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.v2-bottom-nav a')).toHaveCount(4)
  await expect(page.locator('.v2-bottom-nav a[href="#/"]')).toHaveCount(1)
  await expect(page.locator('.v2-bottom-nav a[href="#/courses"]')).toHaveCount(1)
  await expect(page.locator('.v2-bottom-nav a[href="#/practice"]')).toHaveCount(1)
  await expect(page.locator('.v2-bottom-nav a[href="#/progress"]')).toHaveCount(1)
  await expect(page.locator('.v2-bottom-nav a[href="#/settings"]')).toHaveCount(0)
})

test('internal catalog is not exposed in user settings', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.getByText('問題カタログ')).toHaveCount(0)
})
