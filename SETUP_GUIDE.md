# Playwright E2E Test Framework - Setup & Run Guide

A complete guide from installing Node.js to running tests against the DemoBlaze web application.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Install Node.js](#2-install-nodejs)
3. [Install VS Code](#3-install-vs-code)
4. [Clone the Project](#4-clone-the-project)
5. [Install Dependencies](#5-install-dependencies)
6. [Project Structure Overview](#6-project-structure-overview)
7. [Environment Configuration](#7-environment-configuration)
8. [Understanding the Test Architecture](#8-understanding-the-test-architecture)
9. [Running Tests](#9-running-tests)
10. [Viewing Test Reports](#10-viewing-test-reports)
11. [Playwright MCP Setup (Optional)](#11-playwright-mcp-setup-optional)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

| Tool       | Minimum Version | Purpose                        |
| ---------- | --------------- | ------------------------------ |
| Node.js    | 18+             | JavaScript runtime             |
| npm        | 9+              | Package manager (bundled)      |
| VS Code    | Latest          | Code editor (recommended)      |
| Git        | Latest          | Version control                |

---

## 2. Install Node.js

### macOS

**Option A: Using Homebrew (recommended)**

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version   # Should output v18.x or higher
npm --version    # Should output 9.x or higher
```

**Option B: Using the official installer**

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version for macOS
3. Run the `.pkg` installer and follow the prompts
4. Open a terminal and verify:

```bash
node --version
npm --version
```

### Windows

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version for Windows
3. Run the `.msi` installer (check "Automatically install necessary tools" if prompted)
4. Open Command Prompt or PowerShell and verify:

```bash
node --version
npm --version
```

### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

node --version
npm --version
```

---

## 3. Install VS Code

1. Download VS Code from [https://code.visualstudio.com](https://code.visualstudio.com)
2. Install the following recommended extensions:
   - **Playwright Test for VSCode** (`ms-playwright.playwright`) — Run and debug tests from the editor
   - **TypeScript** (built-in) — Language support

---

## 4. Clone the Project

```bash
git clone <repository-url>
cd playwrightdemo/playwrightdemo
```

Or open the project folder directly in VS Code:

```bash
code playwrightdemo/playwrightdemo
```

---

## 5. Install Dependencies

```bash
# Install all project dependencies
npm install

# Install Playwright browsers (Chromium, WebKit)
npx playwright install
```

This installs:

| Package              | Purpose                              |
| -------------------- | ------------------------------------ |
| `@playwright/test`   | Playwright test runner               |
| `@playwright/mcp`    | Playwright MCP server (AI browser)   |
| `typescript`         | TypeScript compiler                  |
| `ts-node`            | Run TypeScript directly              |
| `dotenv`             | Load environment variables           |
| `crypto-js`          | AES encryption/decryption            |

---

## 6. Project Structure Overview

```
playwrightdemo/
├── api/                        # API clients
│   └── product.api.ts          #   Product API requests
├── components/                 # Reusable UI components
│   ├── base.component.ts       #   Base component class
│   ├── menu.component.ts       #   Navigation menu
│   └── messages.component.ts   #   Success/error messages
├── constants/                  # Application constants
│   ├── file-path.ts            #   File path constants
│   └── messages.ts             #   Expected messages
├── models/                     # TypeScript interfaces
│   ├── product.ts              #   Product model
│   └── user.ts                 #   User model
├── pages/                      # Page Object Model (POM)
│   ├── base.page.ts            #   Base page class
│   ├── cart.page.ts            #   Cart & checkout page
│   ├── home.page.ts            #   Home page
│   ├── login.page.ts           #   Login page
│   └── product.page.ts         #   Product detail page
├── tests/                      # Test files
│   ├── base.ts                 #   Custom fixtures definition
│   ├── setup.ts                #   Pre-test login setup
│   ├── teardown.ts             #   Post-test logout cleanup
│   └── testLam.spec.ts         #   Main test scenarios
├── test-data/                  # Static test data
│   └── users.json              #   User checkout data
├── utils/                      # Utility functions
│   ├── app-config.ts           #   App configuration
│   ├── data-generate.ts        #   Random test data generator
│   └── data-utils.ts           #   Encrypt/decrypt helpers
├── .env.qa                     # QA environment variables
├── .env.staging                # Staging environment variables
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies & scripts
```

**Design Patterns Used:**

- **Page Object Model (POM)** — Each page has its own class with locators and actions
- **Custom Fixtures** — Pages and components are injected into tests via Playwright fixtures
- **Setup/Teardown Projects** — Authentication is handled before tests and cleaned up after

---

## 7. Environment Configuration

The project supports multiple environments via `.env` files.

### `.env.qa` (QA Environment)

```env
BASE_URL=https://www.demoblaze.com/index.html
ADMIN_USERNAME=thanhlam
ADMIN_PASSWORD=<encrypted-password>
TEST_USER_EMAIL=qa_user@example.com
TEST_USER_PASSWORD=Test@1234
ENCRYPTION_KEY=qa-secret-key
ENV=qa
```

### `.env.staging` (Staging Environment)

```env
BASE_URL=https://google.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
TEST_USER_EMAIL=staging_user@example.com
TEST_USER_PASSWORD=Test@5678
ENCRYPTION_KEY=staging-secret-key
ENV=staging
```

### How Environment Loading Works

The `playwright.config.ts` reads the `ENV` variable and loads the corresponding `.env.{ENV}` file:

```typescript
const env = process.env.ENV ?? 'qa'; // defaults to 'qa'
dotenv.config({ path: `.env.${env}` });
```

---

## 8. Understanding the Test Architecture

### Test Execution Flow

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│  Setup       │────▶│  Test Specs      │────▶│  Teardown     │
│  (login)     │     │  (testLam.spec)  │     │  (logout)     │
│              │     │                  │     │               │
│ • Navigate   │     │ • Browse product │     │ • Logout      │
│ • Login      │     │ • Add to cart    │     │ • Delete      │
│ • Save       │     │ • Checkout       │     │   auth.json   │
│   auth.json  │     │ • Verify order   │     │               │
└──────────────┘     └──────────────────┘     └───────────────┘
```

### Projects in `playwright.config.ts`

| Project    | Purpose                            | Depends On |
| ---------- | ---------------------------------- | ---------- |
| `login`    | Runs `setup.ts` to authenticate    | —          |
| `chromium` | Runs `*.spec.ts` on Chromium       | `login`    |
| `webkit`   | Runs `*.spec.ts` on WebKit/Safari  | `login`    |
| `teardown` | Runs `teardown.ts` to clean up     | —          |

### Custom Fixtures (`tests/base.ts`)

Tests use custom fixtures instead of raw `page` objects:

```typescript
test('my test', async ({
  homePage,       // HomePage instance
  productPage,    // ProductPage instance
  cartPage,       // CartPage instance
  menuComponent,  // MenuComponent instance
  productAPI,     // ProductAPI instance
}) => {
  // Use page objects directly
  await homePage.goToHomePage();
});
```

---

## 9. Running Tests

### Basic Commands

```bash
# Run all tests with QA environment (default)
ENV=qa npx playwright test

# Run a specific test file
ENV=qa npx playwright test testLam.spec.ts

# Run with visible browser (headed mode)
ENV=qa npx playwright test testLam.spec.ts --headed

# Run on Chromium only
ENV=qa npx playwright test testLam.spec.ts --project=chromium

# ✅ RECOMMENDED: Run specific test, headed, Chromium only, QA environment
ENV=qa npx playwright test testLam.spec.ts --headed --project=chromium
```

### Using npm Scripts

```bash
# Run all tests with QA env
npm run test:qa

# Run all tests with Staging env
npm run test:staging

# Run all tests in headed mode
npm run test:headed
```

### Common Command Flags

| Flag                      | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `--headed`                | Show the browser window during test execution     |
| `--project=chromium`      | Run tests only on Chromium browser                |
| `--project=webkit`        | Run tests only on WebKit (Safari) browser         |
| `--workers=1`             | Run tests sequentially (useful for debugging)     |
| `--debug`                 | Run tests in debug mode with Playwright Inspector |
| `--retries=2`             | Retry failed tests up to 2 times                  |
| `--grep="product"`        | Run only tests matching the pattern               |
| `--reporter=list`         | Use list reporter for console output              |
| `--trace=on`              | Record trace for all tests                        |

### Running Full Command Example

```bash
# Full command breakdown:
ENV=qa npx playwright test testLam.spec.ts --headed --project=chromium

# ENV=qa                    → Load .env.qa environment variables
# npx playwright test       → Run Playwright test runner
# testLam.spec.ts           → Target specific test file
# --headed                  → Show browser window
# --project=chromium        → Use Chromium browser only
```

### Debug Mode

```bash
# Open Playwright Inspector for step-by-step debugging
ENV=qa npx playwright test testLam.spec.ts --debug --project=chromium
```

---

## 10. Viewing Test Reports

### HTML Report

After running tests, an HTML report is generated in `playwright-report/`:

```bash
# Open the HTML report in browser
npx playwright show-report
```

### Test Artifacts

Test results are saved in `test-results/` and include:

- **Screenshots** — Captured on every test (configured in `playwright.config.ts`)
- **Videos** — Recorded on test failure (`retain-on-failure`)
- **Traces** — Recorded on first retry (`on-first-retry`)

To view a trace file:

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

---

## 11. Playwright MCP Setup (Optional)

Playwright MCP allows AI agents (GitHub Copilot, Claude) to control a browser directly.

### VS Code Configuration

The project includes `.vscode/mcp.json`:

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "chromium", "--headless"]
    }
  }
}
```

### Available MCP Options

| Option                  | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `--browser chromium`    | Browser to use (`chromium`, `firefox`, `webkit`)  |
| `--headless`            | Run without browser UI                           |
| `--headed`              | Show browser UI                                  |
| `--viewport-size WxH`   | Set viewport (e.g., `1280x720`)                  |
| `--codegen typescript`  | Generate TypeScript code during interaction      |
| `--storage-state path`  | Load authentication state                        |
| `--isolated`            | Use isolated browser context per session         |
| `--caps vision`         | Enable screenshot capabilities                   |
| `--caps testing`        | Enable test assertion tools                      |
| `--caps network`        | Enable network monitoring                        |

---

## 12. Troubleshooting

### "Playwright browsers not installed"

```bash
npx playwright install
```

### "Cannot find module" errors

```bash
npm install
```

### "Element not visible" timeout errors

This typically happens when a modal or dialog hasn't fully opened. Ensure `waitFor({ state: 'visible' })` is called before interacting with modal elements.

### Tests fail in headless mode but pass in headed mode

Add explicit waits for animations:

```typescript
await element.waitFor({ state: 'visible' });
```

### Environment variables not loading

Make sure the `.env.qa` or `.env.staging` file exists in the project root and the `ENV` variable is set:

```bash
# Verify environment
ENV=qa npx playwright test --list
```

### Port conflicts with MCP server

If Playwright MCP fails to start, check for existing processes:

```bash
lsof -i :8931   # Check if MCP port is in use
```

---

## Quick Reference Card

```bash
# Install everything
npm install && npx playwright install

# Run tests (QA + Chromium + Headed)
ENV=qa npx playwright test testLam.spec.ts --headed --project=chromium

# Debug tests
ENV=qa npx playwright test testLam.spec.ts --debug --project=chromium

# View report
npx playwright show-report

# View trace
npx playwright show-trace test-results/<folder>/trace.zip
```
