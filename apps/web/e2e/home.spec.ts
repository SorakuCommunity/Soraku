import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Soraku/)
})

test('login page accessible', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading')).toBeVisible()
})
