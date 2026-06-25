import { test as base, expect as baseExpect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { MenuComponent } from '../components/menu.component';
import { NewbornsAPI } from '../api/newborns.api';

type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  menuComponent: MenuComponent;
  newbornsAPI: NewbornsAPI;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  menuComponent: async ({ page }, use) => {
    await use(new MenuComponent(page));
  },
  newbornsAPI: async ({ request }, use) => {
    await use(new NewbornsAPI(request));
  },
});

export const expect = baseExpect;
