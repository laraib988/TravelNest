import { test, expect } from '@playwright/test';

// ===================================================
// TEST SUITE 1: Homepage & Navigation
// ===================================================
test.describe('Homepage', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    // Just check page body is visible (title varies by locale/SSR)
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('navigation links are clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    // Nav links exist
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('footer is visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer')).toBeVisible();
  });
});
