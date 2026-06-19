import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('input-username').fill('admin');
  await page.getByTestId('input-password').fill('admin123');
  await page.getByTestId('login-btn').click();
  await page.waitForSelector('[data-testid="navbar"]');
  await page.context().storageState({ path: authFile });
});
