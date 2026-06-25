import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  get url(): string {
    return '/login';
  }

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.ant-form-item-explain-error');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password' });
    this.signUpLink = page.getByRole('link', { name: /Sign up/ });
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.page.waitForURL(url => !url.pathname.includes('/login'));
  }

  async getErrorMessages(): Promise<string[]> {
    await this.errorMessage.first().waitFor({ state: 'visible', timeout: 5000 });
    return this.errorMessage.allTextContents();
  }

  async getInvalidCredentialsMessage(): Promise<string> {
    const toast = this.page.locator('.ant-message-error, .ant-notification-notice-error, .ant-alert-error');
    await toast.first().waitFor({ state: 'visible', timeout: 10000 });
    return (await toast.first().textContent()) ?? '';
  }
}
