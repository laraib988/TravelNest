import { test, expect } from '@playwright/test';

// ===================================================
// TEST SUITE 4: Blog Page
// ===================================================
test.describe('Blog Page', () => {
  test('blog listing page loads', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('blog cards are visible', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    const blogCards = page.locator('article, [class*="blog"], [class*="card"], a[href*="/blog/"]');
    const count = await blogCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking blog opens detail page', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    const firstBlogLink = page.locator('a[href*="/blog/"]').first();
    if (await firstBlogLink.isVisible()) {
      await firstBlogLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/blog/');
    }
  });
});

// ===================================================
// TEST SUITE 5: Destinations Page
// ===================================================
test.describe('Destinations Page', () => {
  test('destinations page loads', async ({ page }) => {
    await page.goto('/en/destinations');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('destination cards visible', async ({ page }) => {
    await page.goto('/en/destinations');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[class*="card"], article, a[href*="/destination"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });
});

// ===================================================
// TEST SUITE 6: Contact/About Pages
// ===================================================
test.describe('Static Pages', () => {
  test('about page loads', async ({ page }) => {
    await page.goto('/en/about');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 8000 });
  });

  test('contact page loads', async ({ page }) => {
    await page.goto('/en/contact');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });
});
