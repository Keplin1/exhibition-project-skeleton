
import { test, expect } from '@playwright/test';
const { beforeEach, describe } = test;

describe('Quick Search Buttons', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/');
        await page.waitForLoadState('networkidle');
    });

    test('should allow users to search with the quick search buttons', async ({ page }) => {
        await page.getByRole('button', { name: 'Quick search for van Gogh' }).click();

        // Wait for the results to come back
        await page.waitForLoadState('networkidle');

        // Wait for our artwork to be visible in the results
        await page.getByText('Adeline Ravoux').waitFor({ state: 'visible', timeout: 5000 });

        // Wait for checkbox to be visible - this ensures the grid is fully rendered with context
        const checkbox = page.getByRole('checkbox', { name: /Select Adeline Ravoux/ });
        await expect(checkbox).toBeVisible();

        // Click on the artwork to view its details
        const viewButton = page.getByRole('button', { name: 'View details for Adeline Ravoux', exact: true });
        await viewButton.click();

        // Wait for navigation and content to load
        await expect(page).toHaveURL(/\/item\//);
        await expect(page.getByRole('heading', { name: 'Adeline Ravoux' })).toBeVisible({ timeout: 10000 });

        //Check that the page has the artist name (Vincent van Gogh) on the item details page  
        await expect(page.getByText('Vincent van Gogh (Dutch, 1853–1890)').first()).toBeVisible();

        // Go back and check another artwork
        await page.getByRole('button', { name: 'Go back to search page' }).click();

        // Wait to be back on the home page
        await page.waitForLoadState('networkidle');

        //Check that other items also match the quick search term 
        await page.getByText('Two Poplars in the Alpilles near Saint-Rémy').waitFor({ state: 'visible', timeout: 5000 });

        // Wait for checkbox to be visible
        const checkbox2 = page.getByRole('checkbox', { name: /Select Two Poplars/ });
        await expect(checkbox2).toBeVisible();

        // Click on another artwork to view its details
        const viewButton2 = page.getByRole('button', { name: 'View details for Two Poplars in the Alpilles near Saint-Rémy by Vincent van' });
        await viewButton2.click();

        // Wait for navigation and content to load
        await expect(page).toHaveURL(/\/item\//);
        await expect(page.getByRole('heading', { name: 'Two Poplars in the Alpilles near Saint-Rémy' })).toBeVisible({ timeout: 10000 });

        //Check that the page has the artist name on this item details page too
        await expect(page.getByText('Vincent van Gogh (Dutch, 1853–1890)').first()).toBeVisible();
    });
});