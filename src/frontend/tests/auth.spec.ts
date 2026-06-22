import { test, expect, type Page, type TestInfo } from '@playwright/test';

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

test.describe('Login Page', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('shows login page when not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('login-page')).toBeVisible();
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('input-username').fill('wronguser');
    await page.getByTestId('input-password').fill('wrongpass');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('error message does not contain attempted password', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('input-username').fill('testuser');
    await page.getByTestId('input-password').fill('mysecretpass');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
    const errorText = await page.getByTestId('login-error').textContent();
    expect(errorText).not.toContain('mysecretpass');
  });

  test('shows error when fields are empty', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('successful login shows dashboard', async ({ page }, testInfo) => {
    await page.goto('/');
    await attachScreenshot(page, testInfo, 'login-page');
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('navbar')).toBeVisible();
    await expect(page.getByTestId('login-page')).not.toBeVisible();
    await attachScreenshot(page, testInfo, 'dashboard-after-login');
  });

  test('sign out returns to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('input-username').fill('admin');
    await page.getByTestId('input-password').fill('admin123');
    await page.getByTestId('login-btn').click();
    await expect(page.getByTestId('navbar')).toBeVisible();
    await page.getByTestId('nav-logout').click();
    await expect(page.getByTestId('login-page')).toBeVisible();
  });
});
