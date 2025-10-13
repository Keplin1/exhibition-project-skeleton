import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
   await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');

}) 


test('check for all necessary elements to be present on the homepage', async ({ page }) => {

  await expect(page).toHaveTitle(/Exhibition Curator/);
  await expect(page.getByRole('heading', { name: 'Exhibition Curator' })).toBeVisible();
  await expect(page.getByText('Search and curate artworks')).toBeVisible()
  await expect(page.getByRole('link', { name: 'View my collection: 0' })).toBeVisible();
  await expect(page.getByRole('group', { name: 'Quick search suggestions' })).toBeVisible();
  await expect(page.getByText('Sort by:')).toBeVisible();
  await expect(page.getByLabel('Sort artworks by different')).toBeVisible();
  await page.getByRole('textbox', { name: 'Search for artworks or artists' }).click();

});

test('addding items to my collection', async ({ page }) => {

  // Fill in the search details
  await expect(page.getByRole('textbox', { name: 'Search for artworks or artists' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Search for artworks or artists' }).click();
  await page.getByRole('textbox', { name: 'Search for artworks or artists' }).fill('orange');
  await page.getByRole('button', { name: 'Submit search' }).click();

  // Wait for the results to come back
  await page.waitForLoadState('networkidle');

  // Wait for our artwork to be visible in the results
  await page.getByText('The Orange Christ').waitFor({ state: 'visible', timeout: 5000 });

  // Find the checkbox
  const checkbox = page.getByRole('checkbox', { name: 'Select The Orange Christ by' });
  await expect(checkbox).toBeVisible();
  await expect(checkbox).toBeEnabled();  

  // Click the checkbox
  await checkbox.click();
  
  // Save to collection
  await page.getByRole('button', { name: 'Save 1 selected artworks to' }).click();
  await page.getByRole('link', { name: 'View my collection: 1 artwork' }).click();

});

test('checks for the items to have descriptions', async ({ page }) => {

  await expect(page.getByRole('heading', { name: 'Red-Figure Lekythos (Oil Vessel): Warrior Cutting Hair' })).toBeVisible()
  await page.getByRole('button', { name: 'View details for Red-Figure Lekythos (Oil Vessel): Warrior Cutting Hair'}).click();
  await expect (page.getByRole('heading', { name: 'Description' })).toBeVisible()
  await page.getByRole('link', { name: 'Go back to search page' }).click();
  await expect(page.getByRole('heading', { name: 'Greek Doric Order' })).toBeVisible()
  await page.getByRole('button', { name: 'Greek Doric Order' }).click();
  await expect (page.getByRole('heading', { name: 'Description' })).toBeVisible()
});

