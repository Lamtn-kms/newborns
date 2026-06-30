import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { click, selectAntDropdown, isVisible } from '../utils/ui-actions';

export class UserManagementPage extends BasePage {
  readonly editButtonFirstRow: Locator;
  readonly editPopup: Locator;
  readonly updateToStatusDropdown: Locator;
  readonly editPopupSubmitButton: Locator;
  readonly confirmPopupOkButton: Locator;

  get url(): string {
    return '/user-management';
  }

  constructor(page: Page) {
    super(page);
    this.editButtonFirstRow = page.locator('[class*="anticon-edit"], [data-icon="edit"], svg[data-icon="edit"]').first();
    this.editPopup = page.locator('.ant-modal, [role="dialog"]').first();
    this.updateToStatusDropdown = this.editPopup.locator('.ant-select').nth(1);
    this.editPopupSubmitButton = this.editPopup.getByRole('button', { name: /submit/i });
    this.confirmPopupOkButton = page.locator('.ant-modal-confirm, .ant-popconfirm, .ant-modal').last().getByRole('button', { name: /submit/i });
  }

  async clickEditFirstRow(): Promise<void> {
    await click(this.editButtonFirstRow);
  }

  async waitForEditPopup(): Promise<boolean> {
    return isVisible(this.editPopup);
  }

  async changeStatusDropdown(optionText: string): Promise<void> {
    await selectAntDropdown(this.updateToStatusDropdown, optionText, this.page);
  }

  async clickSubmitEditPopup(): Promise<void> {
    await click(this.editPopupSubmitButton);
  }

  async clickConfirmSubmit(): Promise<void> {
    await click(this.confirmPopupOkButton);
  }
}
