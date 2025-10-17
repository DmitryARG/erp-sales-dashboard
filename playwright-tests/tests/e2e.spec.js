const { test, expect } = require('@playwright/test');

test.describe('ERP Application E2E Tests', () => {
  test('Test 1: Successful login', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://46.8.238.87:8080');
    
    // Verify login form is visible
    await expect(page.locator('#login-page')).toBeVisible();
    
    // Fill in login credentials
    await page.fill('#username', 'client1');
    await page.fill('#password', 'password');
    
    // Click login button
    await page.click('#login-btn');
    
    // Verify login page is no longer visible
    await expect(page.locator('#login-page')).not.toBeVisible();
    
    // Verify dashboard is now visible
    await expect(page.locator('#dashboard-page')).toBeVisible();
  });

  test('Test 2: Data loading and display', async ({ page }) => {
    // First perform login (could be extracted to a setup function)
    await page.goto('http://46.8.238.87:8080');
    await expect(page.locator('#login-page')).toBeVisible();
    await page.fill('#username', 'client1');
    await page.fill('#password', 'password');
    await page.click('#login-btn');
    await expect(page.locator('#login-page')).not.toBeVisible();
    await expect(page.locator('#dashboard-page')).toBeVisible();
    
    // Wait for schema options to be available
    await page.waitForSelector('#schema-select option[value="client1"]');
    
    // Select the client1 schema
    await page.selectOption('#schema-select', 'client1');
    
    // Wait for data to load after schema selection
    await page.waitForTimeout(2000); // Wait for data loading
    
    // Verify sales table contains data rows
    const tableRows = await page.locator('#sales-table tbody tr');
    await expect(tableRows).toHaveCount({ min: 1 }); // At least one row should be present
    
    // Verify sales chart canvas is visible
    await expect(page.locator('#sales-chart canvas')).toBeVisible();
  });
});