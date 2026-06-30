import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Warn if ENV variable is not set
if (!process.env.ENV) {
  console.warn('\x1b[33m⚠ Warning: ENV variable not set. Defaulting to "qa". Use: ENV=qa npx playwright test\x1b[0m');
}

// Load environment-specific .env file
const env = process.env.ENV || 'qa';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true }); // fallback defaults

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://newborns.kms-velox.com',
    headless: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'setup.ts',
      teardown: 'teardown',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },

    {
      name: 'teardown',
      testMatch: 'teardown.ts',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
      },
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        storageState: './auth.json',
      },
      testMatch: '*.spec.ts',
      testIgnore: ['setup.ts', 'teardown.ts', 'base.ts'],
      dependencies: ['setup'],
    },
  ],
});
