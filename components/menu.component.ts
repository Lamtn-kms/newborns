import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './base.component';

export class MenuComponent extends BaseComponent {
  readonly sidebarNav: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebarNav = page.locator('.ant-menu, nav, [class*="sidebar"]').first();
  }

  async clickOnMenu(menuName: string): Promise<void> {
    const menuLink = this.page.getByRole('link', { name: menuName });
    await menuLink.click();
  }

  async isMenuVisible(menuName: string): Promise<boolean> {
    return this.page.getByRole('link', { name: menuName }).isVisible();
  }

  async getVisibleMenuItems(): Promise<string[]> {
    const items = this.sidebarNav.locator('.ant-menu-item, [class*="menu-item"]');
    return items.allTextContents();
  }
}
