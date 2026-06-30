import { Page } from '@playwright/test';
import { MessagesComponent } from '../components/messages.component';

export abstract class BasePage {
  readonly page: Page;
  readonly messages: MessagesComponent;

  constructor(page: Page) {
    this.page = page;
    this.messages = new MessagesComponent(page);
  }

  abstract get url(): string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async clickOnButtonByName(buttonName: string): Promise<void> {
    const button = this.page.getByRole('button', { name: buttonName });
    await button.click();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
  }
}
