import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly userGreeting: Locator;
  readonly userAvatar: Locator;
  readonly sidebarMenu: Locator;
  readonly homeLink: Locator;
  readonly userManagementLink: Locator;
  readonly courseManagementLink: Locator;
  readonly courseCenterLink: Locator;

  get url(): string {
    return '/';
  }

  constructor(page: Page) {
    super(page);
    this.userGreeting = page.locator('text=Hi, Super Admin');
    this.userAvatar = page.locator('img').last();
    this.sidebarMenu = page.locator('ul, [role="list"]').first();
    this.homeLink = page.getByRole('link', { name: /home/i });
    this.userManagementLink = page.getByRole('link', { name: /user-management/i });
    this.courseManagementLink = page.getByRole('link', { name: /course-management/i });
    this.courseCenterLink = page.getByRole('link', { name: /course-center-management/i });
  }

  async isHomePageVisible(): Promise<boolean> {
    await this.userGreeting.waitFor({ state: 'visible', timeout: 10000 });
    return true;
  }

  async getUserGreeting(): Promise<string> {
    return (await this.userGreeting.textContent()) ?? '';
  }

  async isSidebarMenuVisible(): Promise<boolean> {
    return this.sidebarMenu.isVisible();
  }

  async navigateToUserManagement(): Promise<void> {
    await this.userManagementLink.click();
  }

  async navigateToCourseManagement(): Promise<void> {
    await this.courseManagementLink.click();
  }

  async navigateToCourseCenter(): Promise<void> {
    await this.courseCenterLink.click();
  }
}
