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
    await page.getByTestId('my-collection-button').click();

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

test('keyboard navigation on collection page: tab to artwork and press enter to view details', async ({ page }) => {
    // Add an item to collection first
    await page.getByRole('textbox', { name: 'Search for artworks or artists' }).fill('modern');
    await page.getByRole('button', { name: 'Submit search' }).click();
    await page.waitForLoadState('networkidle');

    await page.getByText('Adeline Ravoux').waitFor({ state: 'visible', timeout: 5000 });
    const checkbox = page.getByRole('checkbox', { name: 'Select Adeline Ravoux by' });
    await checkbox.click();
    await page.getByRole('button', { name: 'Save 1 selected artworks to' }).click();

    // Navigate to collection page
    await page.getByTestId('my-collection-button').click();
    await page.waitForLoadState('networkidle');

    // Use Tab to navigate to the artwork thumbnail
    // Tab from page start -> Back to Search link -> Artwork thumbnail
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press Enter to view details
    await page.keyboard.press('Enter');

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Should navigate to item details page
    await expect(page.getByRole('heading', { name: 'Adeline Ravoux' })).toBeVisible();
});

test('keyboard navigation on collection page: tab to remove button and press enter', async ({ page }) => {
    // Add an item to collection first
    await page.getByRole('textbox', { name: 'Search for artworks or artists' }).fill('modern');
    await page.getByRole('button', { name: 'Submit search' }).click();
    await page.waitForLoadState('networkidle');

    await page.getByText('Adeline Ravoux').waitFor({ state: 'visible', timeout: 5000 });
    const checkbox = page.getByRole('checkbox', { name: 'Select Adeline Ravoux by' });
    await checkbox.click();
    await page.getByRole('button', { name: 'Save 1 selected artworks to' }).click();

    // Navigate to collection page
    await page.getByTestId('my-collection-button').click();
    await page.waitForLoadState('networkidle');

    // Use Tab to navigate to the remove button
    // Tab: Back to Search -> Thumbnail -> Title -> Remove button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Press Enter to remove
    await page.keyboard.press('Enter');

    // Wait for removal
    await page.waitForTimeout(300);

    // Item should be removed - check that we're back to empty collection state
    await expect(page.getByText('Your Collection is Empty')).toBeVisible();
});