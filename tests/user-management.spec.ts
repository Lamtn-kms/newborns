import { test, expect } from './base';
import { MESSAGES } from '../constants/messages';

test.describe('User Management @UserManagement', () => {
  test('Edit first user and verify success message', { tag: ['@Regression'] }, async ({ homePage, userManagementPage, menuComponent }) => {
    await test.step('Navigate to Home page', async () => {
      await homePage.navigate();
      await homePage.isHomePageVisible();
    });

    await test.step('Expand sidebar and click on User Management', async () => {
      await menuComponent.expandSidebar();
      await menuComponent.clickOnMenu('User Management');
      await userManagementPage.page.waitForLoadState('networkidle');
    });

    await test.step('Click edit button of the first record', async () => {
      await userManagementPage.clickEditFirstRow();
    });

    await test.step('Change status dropdown in the edit popup', async () => {
      await userManagementPage.waitForEditPopup();
      await userManagementPage.changeStatusDropdown('Candidate');
    });

    await test.step('Submit the edit form', async () => {
      await userManagementPage.clickSubmitEditPopup();
    });

    await test.step('Confirm submission', async () => {
      await userManagementPage.clickConfirmSubmit();
    });

    await test.step('Verify success message is displayed', async () => {
      const message = await userManagementPage.messages.getToastMessage();
      expect(message).toContain(MESSAGES.USER_UPDATED);
    });
  });
});
