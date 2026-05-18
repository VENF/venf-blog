import { test, expect } from '@playwright/test'

test.describe('Navigation flow', () => {
  test('Home → Blog → Article → Codigo', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toBeVisible()

    const blogLink = page.getByRole('link', { name: /blog/i })
    await blogLink.click()
    await expect(page).toHaveURL(/\/blog/)
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible()

    const firstCard = page.locator('a[href^="/posts/"]').first()
    await firstCard.click()
    await expect(page).toHaveURL(/\/posts\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const codigoLink = page.getByRole('link', { name: /código|codigo/i })
    await codigoLink.click()
    await expect(page).toHaveURL(/\/codigo/)
    await expect(page.getByRole('heading', { name: /código|codigo/i })).toBeVisible()
  })
})
