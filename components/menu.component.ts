import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class MenuComponent extends BaseComponent {
  readonly sidebarNav: Locator;
  readonly expandToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebarNav = page.locator('[class*="SideBarMenuList"]').first();
    this.expandToggle = page.locator('[class*="SideBarCollapsedToggleBtn"]').first();
  }

  async expandSidebar(): Promise<void> {
    await this.expandToggle.click();
    await this.page.locator('[class*="SideBarMenuItemText"]').first().waitFor({ state: 'visible' });
  }

  async clickOnMenu(menuName: string): Promise<void> {
    const menuLink = this.page.getByRole('link', { name: menuName });
    await menuLink.click();
  }

  async isMenuLinkPresent(href: string): Promise<boolean> {
    return this.sidebarNav.locator(`a[href="${href}"]`).isVisible();
  }

  async isMenuVisible(menuName: string): Promise<boolean> {
    return this.page.getByRole('link', { name: menuName }).isVisible();
  }

  async getVisibleMenuItems(): Promise<string[]> {
    const items = this.sidebarNav.locator('[class*="SideBarMenuItemText"]');
    return items.allTextContents();
  }
}
