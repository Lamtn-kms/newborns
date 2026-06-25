import { Locator, Page, expect } from '@playwright/test';
import { BaseComponent } from './base.component';

export class MessagesComponent extends BaseComponent {
  readonly toastMessage: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.toastMessage = page.locator('.ant-message-notice, .ant-notification-notice');
    this.alertMessage = page.locator('.ant-alert, [role="alert"]');
  }

  async getToastMessage(): Promise<string> {
    await this.toastMessage.first().waitFor({ state: 'visible', timeout: 10_000 });
    return (await this.toastMessage.first().textContent()) ?? '';
  }

  async getAlertMessage(): Promise<string> {
    await this.alertMessage.first().waitFor({ state: 'visible', timeout: 10_000 });
    return (await this.alertMessage.first().textContent()) ?? '';
  }

  async assertToastContains(text: string): Promise<void> {
    const msg = await this.getToastMessage();
    expect(msg).toContain(text);
  }

  async assertAlertContains(text: string): Promise<void> {
    const msg = await this.getAlertMessage();
    expect(msg).toContain(text);
  }
}
