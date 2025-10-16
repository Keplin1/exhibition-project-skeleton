
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
});

test('quick-search-buttons', async ({ page }) => {
    await page.getByRole('button', { name: 'Quick search for van Gogh' }).click();

    // Wait for the results to come back
    await page.waitForLoadState('networkidle');
    // Wait for our artwork to be visible in the results
    await page.getByText('Adeline Ravoux').waitFor({ state: 'visible', timeout: 5000 });

    await page.getByRole('button', { name: 'View details for Adeline Ravoux', exact: true }).click();

    //Check that the page has the quick search term somewhere on the page 
    await expect(page.getByText('Vincent van Gogh (Dutch, 1853')).toBeVisible();

    await page.getByRole('button', { name: 'Go back to search page' }).click();

    await page.waitForLoadState('networkidle');
    // Wait for our artwork to be visible in the results
    await page.getByText('Two Poplars in the Alpilles near Saint-Rémy').waitFor({ state: 'visible', timeout: 5000 });

    // Check that other items also match the quick serach term 
    await page.getByRole('button', { name: 'View details for Two Poplars in the Alpilles near Saint-Rémy by Vincent van' }).click();
    await expect(page.getByText('Vincent van Gogh (Dutch, 1853–1890)')).toBeVisible()

});