import { test, expect } from './base';
import { MESSAGES } from '../constants/messages';
import users from '../test-data/users.json';
import { decryptTestData } from '../utils/data-utils';

test.describe('Login Page @Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Login with valid credentials navigates to Home', { tag: ['@Smoke', '@Regression'] }, async ({ loginPage, homePage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
    });

    await test.step('Login with admin credentials', async () => {
      await loginPage.fillEmail(users.admin.email);
      await loginPage.fillPassword(decryptTestData(users.admin.password));
      await loginPage.clickLogin();
    });

    await test.step('Verify Home page is displayed', async () => {
      const isHome = await homePage.isHomePageVisible();
      expect(isHome).toBe(true);
    });
  });

  test('Login with invalid credentials shows error message', { tag: ['@Regression'] }, async ({ loginPage, page }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
    });

    await test.step('Login with invalid credentials', async () => {
      await loginPage.fillEmail(users.invalid.email);
      await loginPage.fillPassword(decryptTestData(users.invalid.password));
      await loginPage.clickLogin();
    });

    await test.step('Verify error message is displayed', async () => {
      const errorLocator = page.getByText(MESSAGES.INVALID_CREDENTIALS);
      await errorLocator.waitFor({ state: 'visible', timeout: 10000 });
      const errorText = await errorLocator.textContent();
      expect(errorText).toContain(MESSAGES.INVALID_CREDENTIALS);
    });
  });

  test('Login with empty fields shows required validation', { tag: ['@Regression'] }, async ({ loginPage }) => {
    await test.step('Navigate to login page', async () => {
      await loginPage.navigate();
    });

    await test.step('Click login without filling fields', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Verify required field errors are shown', async () => {
      const errors = await loginPage.getErrorMessages();
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
  });
});

test.describe('Home Page @HomePage', () => {
  test('Home page is accessible after login', { tag: ['@Smoke', '@Regression'] }, async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigate();
    });

    await test.step('Verify home page is loaded', async () => {
      const isHome = await homePage.isHomePageVisible();
      expect(isHome).toBe(true);
    });
  });

  test('Home page shows user greeting', { tag: ['@Regression'] }, async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigate();
    });

    await test.step('Verify user greeting is displayed', async () => {
      const greeting = await homePage.getUserGreeting();
      expect(greeting).toContain('Hi, Super Admin');
    });
  });

  test('Sidebar menu is visible on home page', { tag: ['@Regression'] }, async ({ homePage }) => {
    await test.step('Navigate to home page', async () => {
      await homePage.navigate();
    });

    await test.step('Verify sidebar menu is visible', async () => {
      const isVisible = await homePage.isSidebarMenuVisible();
      expect(isVisible).toBe(true);
    });
  });
});

test.describe('API Tests @API', () => {
  test('API: Get sidebar menu links from page', { tag: ['@Regression'] }, async ({ page }) => {
    await test.step('Navigate to home and extract sidebar menu', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const menuLinks = await page.locator('ul a, nav a, [role="list"] a').evaluateAll(
        (links) => links.map((link) => ({
          text: link.textContent?.trim() || '',
          href: link.getAttribute('href') || '',
        }))
      );

      console.log('Sidebar Menu Links:', JSON.stringify(menuLinks, null, 2));
      expect(menuLinks.length).toBeGreaterThan(0);

      const expectedPaths = ['/profile/home', '/user-management', '/course-management', '/course-center-management'];
      for (const path of expectedPaths) {
        const found = menuLinks.some(link => link.href.includes(path));
        expect(found, `Expected menu link with path: ${path}`).toBe(true);
      }
    });
  });
});
