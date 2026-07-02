import { expect, Page } from '@playwright/test';

const DEFAULT_ADMIN_PASSWORD = 'QgSly4yPFO8tavspp4r1wggGwlDebCbfSx_KclTAEdE';

export async function ensureLoggedIn(page: Page) {
  await page.goto('/');

  const dashboard = page.getByTestId('dashboard');
  const authScreen = page.getByTestId('auth-screen');
  await Promise.race([
    dashboard.waitFor({ state: 'visible', timeout: 15000 }),
    authScreen.waitFor({ state: 'visible', timeout: 15000 }),
  ]);

  if (await authScreen.isVisible()) {
    await page.getByTestId('auth-password').fill(DEFAULT_ADMIN_PASSWORD);
    await page.getByTestId('auth-submit-btn').click();
  }

  await expect(dashboard).toBeVisible({ timeout: 15000 });
}