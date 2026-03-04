/**
 * tests/auth/login.spec.ts
 *
 * Test suite covering authentication flows for Sourgum.
 *
 * Convention:
 *   - All tests import from fixtures/baseTest (not directly from @playwright/test)
 *     so that typed page objects are injected automatically.
 *   - Each test follows Arrange → Act → Assert structure.
 *   - Page interactions are delegated to LoginPage (POM) to keep specs readable.
 */
import { test, expect } from '../../fixtures/baseTest';
import { env } from '../../playwright-config/env';

test.describe('Login', () => {
  /**
   * Negative test: verifies that submitting wrong credentials shows
   * the expected error toast and keeps the user on the sign-in page.
   *
   * Flow:
   *   1. Land on sourgum.com marketing homepage.
   *   2. Assert correct page title.
   *   3. Click the top-right Login link.
   *   4. Assert the dashboard sign-in page has loaded with welcome message.
   *   5. Submit invalid credentials.
   *   6. Assert the transient error toast is visible with the expected message.
   *   7. Assert the URL remains on the sign-in page (no redirect occurred).
   */
  test('shows error for invalid credentials', async ({ loginPage, page }) => {
    // --- Arrange: navigate to the marketing homepage ---
    await loginPage.openMarketingHome();
    await loginPage.expectMarketingHomeTitle();

    await expect(page).toHaveURL(/sourgum\.com\/?$/i);

    // --- Act: navigate to sign-in via the top-right Login link ---
    await loginPage.clickLoginFromTopNavigation();
    await loginPage.expectSignInPageLoaded();

    // --- Act: submit invalid credentials ---
    await loginPage.login({
      email: env.testInvalidEmail,
      password: env.testInvalidPassword
    });

    // --- Assert: error toast appears with the expected message ---
    await expect(loginPage.errorToast(/incorrect username or password\.?/i)).toBeVisible();

    // --- Assert: user is NOT redirected away from the sign-in page ---
    await expect(page).toHaveURL(/dashboard\.sourgum\.com\/signin/i);
  });
});
