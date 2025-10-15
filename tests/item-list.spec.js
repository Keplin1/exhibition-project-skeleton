import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
});

test('checks for the items to have descriptions', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Red-Figure Lekythos (Oil Vessel): Warrior Cutting Hair' })).toBeVisible()
  // Click the first button (thumbnail) for this artwork
  await page.getByRole('button', { name: 'View details for Red-Figure Lekythos (Oil Vessel): Warrior Cutting Hair' }).first().click();
  await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible()
  await page.getByRole('link', { name: 'Go back to search page' }).click();
  await expect(page.getByRole('heading', { name: 'Greek Doric Order' })).toBeVisible()
  await page.getByRole('button', { name: 'Greek Doric Order' }).first().click();
  await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible()
});

test('scroll to top button appears when scrolling down and it scrolls back to top when clicked', async ({ page }) => {
  // Check that the scroll to top button is not visible
  await expect(page.getByRole('button', { name: 'Scroll to top' })).not.toBeVisible();

  // Scroll down the page
  await page.evaluate(() => window.scrollBy(0, 500));

  // Wait for the scroll position to be greater than 300 (when button appears)
  await page.waitForFunction(() => window.scrollY > 300, { timeout: 2000 });

  // Now the scroll to top button should be visible
  await expect(page.getByRole('button', { name: 'Scroll to top' })).toBeVisible();

  // Click the scroll to top button
  await page.getByRole('button', { name: 'Scroll to top' }).click();

  // Wait for the scroll position to reach near the top
  await page.waitForFunction(() => window.scrollY < 50, { timeout: 2000 });

  // Button should disappear after scrolling to top
  await expect(page.getByRole('button', { name: 'Scroll to top' })).not.toBeVisible();
});