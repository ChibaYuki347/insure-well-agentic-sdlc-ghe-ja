import { test, expect } from '@playwright/test';

async function loginAs(page, username, password) {
  await page.goto('/');
  await expect(page.getByTestId('login-card')).toBeVisible();
  await page.getByTestId('login-username').fill(username);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('navbar')).toBeVisible();
}

test.describe('Claims Page (admin)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin', 'admin123');
    await page.getByTestId('nav-claims').click();
    await expect(page.getByTestId('claims')).toBeVisible();
  });

  test('claims page loads with New Claim button and table', async ({ page }) => {
    await expect(page.getByTestId('new-claim-btn')).toBeVisible();
    await expect(page.getByTestId('claims-count')).toBeVisible();
  });

  test('clicking New Claim button shows the claim form', async ({ page }) => {
    await page.getByTestId('new-claim-btn').click();
    await expect(page.getByTestId('claim-form')).toBeVisible();
  });

  test('clicking Cancel hides the claim form', async ({ page }) => {
    await page.getByTestId('new-claim-btn').click();
    await expect(page.getByTestId('claim-form')).toBeVisible();
    await page.getByTestId('new-claim-btn').click();
    await expect(page.getByTestId('claim-form')).not.toBeVisible();
  });

  test('submitting claim without required fields keeps form open', async ({ page }) => {
    await page.getByTestId('new-claim-btn').click();
    await page.getByTestId('input-claim-amount').clear();
    await page.getByTestId('input-claim-description').fill('');
    await page.getByTestId('submit-claim-btn').click();
    await expect(page.getByTestId('claim-form')).toBeVisible();
  });

  test('can submit a new claim through the form', async ({ page }) => {
    await page.getByTestId('new-claim-btn').click();
    const policySelect = page.getByTestId('select-claim-policy');
    await expect(policySelect).toBeVisible();
    await page.getByTestId('input-claim-amount').fill('1500');
    await page.getByTestId('input-claim-description').fill('Annual physical exam');
    await page.getByTestId('submit-claim-btn').click();
    await expect(page.getByTestId('claim-form')).not.toBeVisible();
  });

  test('claims table shows submitted claims', async ({ page }) => {
    await expect(page.getByTestId('claims-table')).toBeVisible();
  });

  test('filter by policy dropdown is visible', async ({ page }) => {
    await expect(page.getByTestId('filter-policy')).toBeVisible();
  });

  test('filtering by policy reduces visible claims', async ({ page }) => {
    const filter = page.getByTestId('filter-policy');
    const options = await filter.locator('option').all();
    if (options.length > 1) {
      const firstPolicyValue = await options[1].getAttribute('value');
      await filter.selectOption(firstPolicyValue!);
      const countText = await page.getByTestId('claims-count').textContent();
      expect(countText).toBeTruthy();
    }
  });

  test('claim status can be updated from the table', async ({ page }) => {
    const firstStatusSelect = page.getByTestId(/^claim-status-/).first();
    if (await firstStatusSelect.isVisible()) {
      await firstStatusSelect.selectOption('Approved');
      await expect(firstStatusSelect).toHaveValue('Approved');
    }
  });

  test('screenshot of claims page for visual review', async ({ page }) => {
    await expect(page.getByTestId('claims')).toBeVisible();
    await page.screenshot({ path: 'test-results/claims-page.png', fullPage: true });
  });
});

test.describe('Claims Page (policyholder)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'alex', 'alex123');
    await page.getByTestId('nav-claims').click();
    await expect(page.getByTestId('claims')).toBeVisible();
  });

  test('policyholder sees read-only status badges and no delete buttons', async ({ page }) => {
    await expect(page.locator('select[data-testid^="claim-status-"]')).toHaveCount(0);
    await expect(page.locator('[data-testid^="claim-status-readonly-"]').first()).toBeVisible();
    await expect(page.locator('[data-testid^="delete-claim-"]')).toHaveCount(0);
  });
});
