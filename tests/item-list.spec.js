import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
});

test('checks for the items to have descriptions', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Red-Figure Lekythos (Oil Vessel): Warrior Cutting Hair' })).toBeVisible()
  await page.getByRole('button', { name: 'View details for Red-Figure Lekythos (Oil Vessel): Warrior Cutting Hair' }).click();
  await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible()
  await page.getByRole('link', { name: 'Go back to search page' }).click();
  await expect(page.getByRole('heading', { name: 'Greek Doric Order' })).toBeVisible()
  await page.getByRole('button', { name: 'Greek Doric Order' }).click();
  await expect(page.getByRole('heading', { name: 'Description' })).toBeVisible()
});