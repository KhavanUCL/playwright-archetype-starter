import { attachScreenshot } from '../utils/commonUtils';
import { test as baseTest } from './common-fixture';
export const test = baseTest.extend({});

test.beforeEach(async ({ page }) => {
  page.setDefaultTimeout(60000); // for element actions
  page.setDefaultNavigationTimeout(100000); // for navigation-specific actions
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Test failed: capturing screenshot...`);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const title = testInfo.title.replace(/\s+/g, '_');
    await attachScreenshot(page, `${title}_${timestamp}`);
  }

  try {
    await page.close();
  } catch (err) {
    console.warn('Failed to close the page:', err);
  }
});

export { expect } from '@playwright/test';
export * as testdataManager from "../utils/testdataManager";