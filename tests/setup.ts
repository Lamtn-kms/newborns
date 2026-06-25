import { FILE_PATHS } from '../constants/file-path';
import { test } from './base';
import users from '../test-data/users.json';
import { decryptTestData } from '../utils/data-utils';

const authFile = FILE_PATHS.AUTH_FILE;

test('Setup', async ({ loginPage, page }) => {
  await test.step('Navigate to login page', async () => {
    await loginPage.navigate();
  });

  await test.step('Login with admin credentials', async () => {
    await loginPage.login(users.admin.email, decryptTestData(users.admin.password));
  });

  // Save the signed-in state for reuse in tests
  await page.context().storageState({ path: authFile });
});
