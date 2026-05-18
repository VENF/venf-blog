import { test, expect } from '@playwright/test'

test.describe('Navigation flow', () => {
  test('Home → Blog → Article → Code', async ({ page }) => {
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

    const codeLink = page.getByRole('link', { name: /código|code/i })
    await codeLink.click()
    await expect(page).toHaveURL(/\/code/)
    await expect(page.getByRole('heading', { name: /código|code/i })).toBeVisible()
  })
})
