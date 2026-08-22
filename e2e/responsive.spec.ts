import { expect, test } from '@playwright/test'

const viewports = [
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test(`layout fits ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/problems')
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow).toBe(false)
    const nav = page.getByRole('navigation', { name: '主要ナビゲーション' })
    await expect(nav).toBeVisible()
    const navBox = await nav.boundingBox()
    expect(navBox?.height ?? 0).toBeGreaterThanOrEqual(72)
    const links = nav.getByRole('link')
    await expect(links).toHaveCount(4)
  })
}
