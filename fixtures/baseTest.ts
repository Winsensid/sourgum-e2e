/**
 * fixtures/baseTest.ts
 *
 * Extends Playwright's built-in `test` with pre-instantiated Page Object
 * Model (POM) instances. Every test that imports from this file automatically
 * receives typed page objects without any manual setup.
 *
 * How to add a new page object:
 *   1. Import the new page class.
 *   2. Add a property to the PageObjects interface.
 *   3. Register the fixture with `base.extend()`.
 *
 * Usage in a spec file:
 *   import { test, expect } from '../../fixtures/baseTest';
 *   test('example', async ({ loginPage }) => { ... });
 */
import { test as base, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';

/** All POM instances available as Playwright fixture arguments in tests. */
interface PageObjects {
  readonly loginPage: LoginPage;
}

/**
 * Augmented test function that injects page objects into every test.
 * Playwright creates a fresh page + POM instance per test automatically.
 */
export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  }
});

// Re-export expect so tests only need to import from this one file
export { expect };
