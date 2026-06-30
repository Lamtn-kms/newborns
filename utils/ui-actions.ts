import { Locator, Page } from '@playwright/test';

/**
 * Click on an element by its locator.
 */
export async function click(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.click();
}

/**
 * Double-click on an element by its locator.
 */
export async function doubleClick(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.dblclick();
}

/**
 * Fill an input field with the given value (clears existing content first).
 */
export async function input(locator: Locator, value: string): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.clear();
  await locator.fill(value);
}

/**
 * Type text character by character (useful for inputs with debounce/autocomplete).
 */
export async function typeText(locator: Locator, value: string, delay = 50): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.clear();
  await locator.pressSequentially(value, { delay });
}

/**
 * Get visible text content of an element.
 */
export async function getText(locator: Locator): Promise<string> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  return (await locator.textContent()) ?? '';
}

/**
 * Get the input value of a form field.
 */
export async function getInputValue(locator: Locator): Promise<string> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  return locator.inputValue();
}

/**
 * Select an option from an Ant Design dropdown.
 */
export async function selectAntDropdown(trigger: Locator, optionText: string, page: Page): Promise<void> {
  await trigger.click();
  const option = page.getByText(optionText, { exact: true }).last();
  await option.waitFor({ state: 'visible', timeout: 5_000 });
  await option.click();
}

/**
 * Check if an element is visible on the page.
 */
export async function isVisible(locator: Locator): Promise<boolean> {
  try {
    await locator.waitFor({ state: 'visible', timeout: 5_000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for an element to disappear from the page.
 */
export async function waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Get attribute value of an element.
 */
export async function getAttribute(locator: Locator, attribute: string): Promise<string> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  return (await locator.getAttribute(attribute)) ?? '';
}

/**
 * Hover over an element (useful for tooltips, dropdown menus).
 */
export async function hover(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.hover();
}

/**
 * Press a keyboard key (Enter, Escape, Tab, etc.).
 */
export async function pressKey(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
}

/**
 * Check or uncheck a checkbox.
 */
export async function setChecked(locator: Locator, checked: boolean): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.setChecked(checked);
}

/**
 * Upload a file to a file input element.
 */
export async function uploadFile(locator: Locator, filePath: string): Promise<void> {
  await locator.setInputFiles(filePath);
}

/**
 * Get text content from all matching elements (e.g., table column, list items).
 */
export async function getAllTexts(locator: Locator): Promise<string[]> {
  await locator.first().waitFor({ state: 'visible', timeout: 10_000 });
  return locator.allTextContents();
}

/**
 * Get the count of matching elements.
 */
export async function getCount(locator: Locator): Promise<number> {
  return locator.count();
}

/**
 * Scroll an element into view.
 */
export async function scrollIntoView(locator: Locator): Promise<void> {
  await locator.scrollIntoViewIfNeeded();
}

/**
 * Wait until element contains expected text.
 */
export async function waitForText(locator: Locator, text: string, timeout = 10_000): Promise<void> {
  await locator.filter({ hasText: text }).waitFor({ state: 'visible', timeout });
}

/**
 * Open an Ant Design DatePicker and select a date by typing.
 */
export async function selectDateByInput(locator: Locator, date: string): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout: 10_000 });
  await locator.click();
  await locator.locator('input').clear();
  await locator.locator('input').fill(date);
  await locator.locator('input').press('Enter');
}

/**
 * Open an Ant Design DatePicker and pick a specific day from the calendar panel.
 * @param trigger - The DatePicker locator (e.g., `.ant-picker`)
 * @param day - The day number to select (1-31)
 * @param page - The Playwright page instance
 */
export async function selectDateByDay(trigger: Locator, day: number, page: Page): Promise<void> {
  await trigger.click();
  const cell = page.locator('.ant-picker-dropdown:visible .ant-picker-cell-inner').getByText(String(day), { exact: true });
  await cell.click();
}

/**
 * Navigate to a specific month/year in Ant Design DatePicker, then select a day.
 * @param trigger - The DatePicker locator
 * @param year - Target year (e.g., 2026)
 * @param month - Target month name (e.g., 'Jan', 'Feb', ... 'Dec')
 * @param day - Target day (1-31)
 * @param page - The Playwright page instance
 */
export async function selectFullDate(trigger: Locator, year: number, month: string, day: number, page: Page): Promise<void> {
  await trigger.click();
  const dropdown = page.locator('.ant-picker-dropdown:visible');

  // Click year/month header to switch to year/month selection
  await dropdown.locator('.ant-picker-year-btn, .ant-picker-header-super-prev-btn').first().waitFor({ state: 'visible' });

  // Navigate year with super prev/next buttons until target year
  const yearBtn = dropdown.locator('.ant-picker-year-btn');
  const superPrev = dropdown.locator('.ant-picker-header-super-prev-btn');
  const superNext = dropdown.locator('.ant-picker-header-super-next-btn');

  for (let i = 0; i < 20; i++) {
    const currentYear = await yearBtn.textContent();
    if (currentYear?.includes(String(year))) break;
    if (Number(currentYear) > year) {
      await superPrev.click();
    } else {
      await superNext.click();
    }
  }

  // Navigate month with prev/next buttons until target month
  const monthBtn = dropdown.locator('.ant-picker-month-btn');
  const prev = dropdown.locator('.ant-picker-header-prev-btn');
  const next = dropdown.locator('.ant-picker-header-next-btn');

  for (let i = 0; i < 12; i++) {
    const currentMonth = await monthBtn.textContent();
    if (currentMonth?.includes(month)) break;
    await next.click();
  }

  // Select the day
  const cell = dropdown.locator('.ant-picker-cell:not(.ant-picker-cell-disabled) .ant-picker-cell-inner').getByText(String(day), { exact: true });
  await cell.click();
}

/**
 * Select a date range in Ant Design RangePicker.
 * @param trigger - The RangePicker locator
 * @param startDate - Start date string (e.g., '2026-01-01')
 * @param endDate - End date string (e.g., '2026-12-31')
 */
export async function selectDateRange(trigger: Locator, startDate: string, endDate: string): Promise<void> {
  const inputs = trigger.locator('input');
  await inputs.first().click();
  await inputs.first().clear();
  await inputs.first().fill(startDate);
  await inputs.last().click();
  await inputs.last().clear();
  await inputs.last().fill(endDate);
  await inputs.last().press('Enter');
}

/**
 * Clear a DatePicker value using the clear icon.
 */
export async function clearDatePicker(trigger: Locator): Promise<void> {
  await trigger.hover();
  const clearIcon = trigger.locator('.ant-picker-clear');
  await clearIcon.click();
}
