import { test, expect } from '@playwright/test';
const { beforeEach, describe } = test;

describe('Homepage Elements', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
  });

  test('check for all necessary elements to be present on the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Exhibition Curator/);
    await expect(page.getByRole('heading', { name: 'Exhibition Curator' })).toBeVisible();
    await expect(page.getByText('Search and curate artworks')).toBeVisible(); // search input box
    await expect(page.getByRole('button', { name: 'Submit search' })).toBeVisible();// search button
    await page.getByRole('textbox', { name: 'Search for artworks or artists' }).click();
    await expect(page.getByRole('button', { name: 'View my collection: 0' })).toBeVisible();// mycollection button
    await expect(page.getByRole('group', { name: 'Quick search suggestions' })).toBeVisible(); // quick serach optins
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
    await expect(page.getByText(/Adeline/).first()).toBeVisible();
  });

  describe('accessibility', () => {
    test('tab to checkbox and press space to select artwork', async ({ page }) => {
      // Start from the search input
      await page.getByRole('textbox', { name: 'Search for artworks or artists' }).focus();

      // Tab through elements to reach the first checkbox
      // Search input -> Search button -> Quick search buttons (8) -> My Collection button -> Sort dropdown -> First checkbox
      for (let i = 0; i < 11; i++) {
        await page.keyboard.press('Tab');
      }

      // Press Space to check the checkbox
      await page.keyboard.press('Space');

      // Verify the "Save to Collection" button appears
      await expect(page.getByRole('button', { name: /Save \d+ selected artworks to/ })).toBeVisible();
    });

    test('tab to artwork thumbnail and press enter to view details', async ({ page }) => {
      // Start from the search input
      await page.getByRole('textbox', { name: 'Search for artworks or artists' }).focus();

      // Tab through elements to reach the first artwork thumbnail
      // Search input -> Search button -> Quick search buttons (8) -> My Collection button -> Sort dropdown -> Checkbox -> Thumbnail
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
      }

      // Press Enter to navigate
      await page.keyboard.press('Enter');

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should navigate to item details page
      expect(page.url()).toContain('/item/');
    });

    test('tab to artwork title and press enter to view details', async ({ page }) => {
      // Start from the search input
      await page.getByRole('textbox', { name: 'Search for artworks or artists' }).focus();

      // Tab through elements to reach the first artwork title
      // Search input -> Search button -> Quick search buttons (8) -> My Collection button -> Sort dropdown -> Checkbox -> Thumbnail -> Title
      for (let i = 0; i < 13; i++) {
        await page.keyboard.press('Tab');
      }

      // Press Enter to navigate
      await page.keyboard.press('Enter');

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Should navigate to item details page
      expect(page.url()).toContain('/item/');
    });
  });
});