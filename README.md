# Playwright E2E Test Framework - Newborns Learning System

Automated E2E testing for [Newborns Learning System](https://newborns.kms-velox.com) using Playwright + TypeScript.

## Prerequisites

| Tool    | Version | Purpose              |
|---------|---------|----------------------|
| Node.js | 18+     | JavaScript runtime   |
| npm     | 9+      | Package manager      |
| VS Code | Latest  | Recommended editor   |

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run headed (visible browser)
npx playwright test --headed

# Run with QA environment
ENV=qa npx playwright test --headed --project=chromium

# Run Smoke tests only
ENV=qa npx playwright test --grep @Smoke

# Run Regression tests only
ENV=qa npx playwright test --grep @Regression

# View report
npx playwright show-report
```

## Project Structure

```
newborns/
├── components/
│   ├── base.component.ts      # Base component class
│   ├── menu.component.ts      # Sidebar navigation
│   └── messages.component.ts  # Toast & alert messages
├── constants/
│   ├── file-path.ts           # File path constants
│   └── messages.ts            # Expected messages
├── pages/
│   ├── base.page.ts           # Base page class
│   ├── home.page.ts           # Home page (after login)
│   └── login.page.ts          # Login page
├── tests/
│   ├── base.ts                # Custom fixtures
│   ├── setup.ts               # Login & save auth state
│   ├── teardown.ts            # Cleanup
│   └── testLam.spec.ts        # Test scenarios
├── test-data/
│   └── users.json             # Encrypted credentials
├── utils/
│   ├── data-utils.ts          # AES encrypt/decrypt
│   └── logger.ts              # Step logger utility
├── .env.qa                    # QA environment config
├── .env.staging               # Staging environment config
├── playwright.config.ts       # Playwright configuration
└── package.json               # Dependencies
```

## Test Architecture

```
Setup (login) → Test Specs → Teardown (cleanup)
     │                │              │
     ▼                ▼              ▼
 Save auth.json   Use auth.json   Delete auth.json
```

**Design Patterns:**
- Page Object Model (POM)
- Custom Fixtures (dependency injection)
- Setup/Teardown Projects (auth state management)
- Encrypted test data (AES via CryptoJS)
<!-- - Tag-based test filtering (@Smoke, @Regression) -->

## Test Cases

| Category  | Test                                         | Tags                |
|-----------|----------------------------------------------|---------------------|
| Login     | Valid credentials → Home page                | @Smoke, @Regression |
| Login     | Invalid credentials → Error message          | @Regression         |
| Login     | Empty fields → Required validation           | @Regression         |
| Home Page | Home page accessible after login             | @Smoke, @Regression |
| Home Page | User greeting displayed                      | @Regression         |
| Home Page | Sidebar menu visible                         | @Regression         |

## Environment Configuration

```bash
# .env.qa
BASE_URL=https://newborns.kms-velox.com
ADMIN_USERNAME=superadmin@newborns.com
ADMIN_PASSWORD=Kms@2023
ENV=qa
```

## Common Commands

```bash
# Run all tests
ENV=qa npx playwright test

# Run headed (visible browser)
ENV=qa npx playwright test --headed

# Run specific test file
ENV=qa npx playwright test testLam.spec.ts --project=chromium

# Run Smoke tests only
ENV=qa npx playwright test --grep @Smoke

# Run Regression tests only
ENV=qa npx playwright test --grep @Regression

# Run Login tests only
ENV=qa npx playwright test --grep @Login

# Run HomePage tests only
ENV=qa npx playwright test --grep @HomePage

# Run with debug inspector
ENV=qa npx playwright test --debug --project=chromium

# Run single test by name
ENV=qa npx playwright test --grep "valid credentials" --project=chromium

# View report
npx playwright show-report

# View trace
npx playwright show-trace test-results/<folder>/trace.zip
```

## Troubleshooting

| Problem                        | Solution                          |
|--------------------------------|-----------------------------------|
| Browsers not installed         | `npx playwright install`          |
| Cannot find module             | `npm install`                     |
| Element timeout                | Check if page loaded / add waits  |
| Env variables not loading      | Verify `.env.qa` exists           |
