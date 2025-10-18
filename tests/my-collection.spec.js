import { test, expect } from '@playwright/test';
const { beforeEach, describe } = test;

describe('My Collection', () => {
    beforeEach(async ({ page }) => {
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

    describe('accessibility', () => {
        test('tab to artwork and press enter to view details', async ({ page }) => {
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

            // check that we are on the /collection page
            await expect(page).toHaveURL(/\/collection$/);

            // Wait for the artwork thumbnail to be visible before starting tab navigation
            const thumbnail = page.getByRole('button', { name: 'View details for Adeline Ravoux' }).first();
            await expect(thumbnail).toBeVisible();

            // Tab until we reach the thumbnail (max 5 tabs to avoid infinite loop)
            for (let i = 0; i < 5; i++) {
                await page.keyboard.press('Tab');
                await page.waitForTimeout(50);

                // Check if thumbnail has focus
                if (await thumbnail.evaluate(el => document.activeElement === el)) {
                    break;
                }
            }

            // Verify the thumbnail has focus before pressing Enter
            await expect(thumbnail).toBeFocused();

            // Press Enter to view details
            await page.keyboard.press('Enter');

            // Wait for navigation
            await page.waitForLoadState('networkidle');

            // Should navigate to item details page
            await expect(page.getByRole('heading', { name: 'Adeline Ravoux' })).toBeVisible();
        });

        test('tab to remove button and press enter', async ({ page }) => {
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

            // check that we are on the /collection page
            await expect(page).toHaveURL(/\/collection$/);

            // Wait for the remove button to be visible before starting tab navigation
            await expect(page.getByRole('button', { name: 'Remove Adeline Ravoux from' })).toBeVisible();

            // Use Tab to navigate to the remove button
            // Tab: Back to Search -> Thumbnail -> Title -> Remove button
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Wait a moment for focus to settle
            await page.waitForTimeout(100);

            // Verify the remove button has focus before pressing Enter
            const removeButton = page.getByRole('button', { name: 'Remove Adeline Ravoux from' });
            await expect(removeButton).toBeFocused();

            // Press Enter to remove
            await page.keyboard.press('Enter');

            // Item should be removed - wait for empty collection state to appear
            await expect(page.getByText('Your Collection is Empty')).toBeVisible({ timeout: 10000 });
        });
    });
});