import { test } from './base';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../auth.json');

test('Teardown', async ({ page }) => {
  await test.step('Navigate to login page to end session', async () => {
    await page.goto('/login');
  });

  // Remove the stored auth state
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
  }
});
