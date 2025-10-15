import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');
});

test('check for all necessary elements to be present on the homepage', async ({ page }) => {
  await expect(page).toHaveTitle(/Exhibition Curator/);
  await expect(page.getByRole('heading', { name: 'Exhibition Curator' })).toBeVisible();
  await expect(page.getByText('Search and curate artworks')).toBeVisible(); // search input box
  await expect(page.getByRole('button', { name: 'Submit search' })).toBeVisible();//search button
  await page.getByRole('textbox', { name: 'Search for artworks or artists' }).click();
  await expect(page.getByRole('link', { name: 'View my collection: 0' })).toBeVisible();//mycollection button
  await expect(page.getByRole('group', { name: 'Quick search suggestions' })).toBeVisible(); //quick serach optins
  await expect(page.getByText('Sort by:')).toBeVisible();
  await expect(page.getByLabel('Sort artworks by different')).toBeVisible();
});

test('checks that the search bar works and returns results', async ({ page }) => {
  // Fill in the search details
  await expect(page.getByRole('textbox', { name: 'Search for artworks or artists' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Search for artworks or artists' }).click();
  await page.getByRole('textbox', { name: 'Search for artworks or artists' }).fill('Adeline');
  await page.getByRole('button', { name: 'Submit search' }).click();

  // Wait for the results to come back
  await page.waitForLoadState('networkidle');

  // Wait for our artwork to be visible in the results
  const searchResults = page.getByText(/Adeline/);
  expect(searchResults.count()).not.toBe(0);
});