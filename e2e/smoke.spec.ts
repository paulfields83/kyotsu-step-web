import { expect, test } from '@playwright/test'

test('phase 00 app smoke test', async ({ page }) => {
  await page.goto('/health')
  await expect(page.getByTestId('app-ready')).toContainText('APP READY')
  await expect(page).toHaveTitle(/共通 STEP/)
})
