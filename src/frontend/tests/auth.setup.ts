import fs from 'node:fs/promises';
import path from 'node:path';
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, request }) => {
  const response = await request.post('/api/auth/login', {
    data: {
      username: 'admin',
      password: 'admin123',
    },
  });

  const auth = await response.json();

  await page.goto('/');
  await page.evaluate((data) => {
    localStorage.setItem('insurewell_token', data.token);
    localStorage.setItem('insurewell_user', JSON.stringify({
      username: data.username,
      role: data.role,
    }));
  }, auth);
  await page.reload();
  await page.waitForSelector('[data-testid="navbar"]');
  await fs.mkdir(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
