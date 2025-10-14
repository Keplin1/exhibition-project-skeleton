import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
});

test('searching for an item, addding it to my collection and checking that it can be found in my collection', async ({ page }) => {
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

    await page.getByText('The Orange Christ').click();
    await expect(page.getByRole('heading', { name: 'The Orange Christ' })).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
});

test('adding an item to my collection, then removing it and making sure it is no longer in my collection', async ({ page }) => {
    // Fill in the search details
    await expect(page.getByRole('textbox', { name: 'Search for artworks or artists' })).toBeVisible()
    await page.getByRole('textbox', { name: 'Search for artworks or artists' }).click();
    await page.getByRole('textbox', { name: 'Search for artworks or artists' }).fill('modern');
    await page.getByRole('button', { name: 'Submit search' }).click();

    // Wait for the results to come back
    await page.waitForLoadState('networkidle');

    // Wait for our artwork to be visible in the results
    await page.getByText('Adeline Ravoux').waitFor({ state: 'visible', timeout: 5000 });

    // Find the checkbox
    const checkbox = page.getByRole('checkbox', { name: 'Select Adeline Ravoux by' });
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeEnabled();

    // Click the checkbox
    await checkbox.click();

    // Save to collection
    await page.getByRole('button', { name: 'Save 1 selected artworks to' }).click();
    await page.getByTestId('my-collection-button').click();
    await expect(page.getByText('Adeline Ravoux')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove Adeline Ravoux from' })).toBeVisible();
    await page.getByRole('button', { name: 'Remove Adeline Ravoux from' }).click();
    await expect(page.getByText('Adeline Ravoux')).not.toBeVisible();
});