/**
 * pages/login.page.ts
 *
 * Page Object Model for the Sourgum authentication flow.
 *
 * Flow covered:
 *   1. sourgum.com (marketing home)  →  click top-right Login link
 *   2. dashboard.sourgum.com/signin  →  fill credentials  →  submit
 *
 * All locators are defined in the constructor so they are resolved lazily
 * at interaction time, keeping the class easy to read and maintain.
 */
import type { Locator, Page } from '@playwright/test';

import { BasePage } from './base.page';
import { env } from '../playwright-config/env';

/** Credentials shape used by login() and related methods. */
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export class LoginPage extends BasePage {
  private readonly topRightLoginButton: Locator;
  private readonly welcomeHeading: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorBanner: Locator;

  public constructor(page: Page) {
    super(page);

    // Top-right navigation Login link on the marketing homepage
    this.topRightLoginButton = this.page.getByRole('link', { name: 'Login' });

    // Welcome heading visible after landing on the sign-in page
    this.welcomeHeading = this.page.getByText('Welcome to Sourgum', { exact: true });

    // Sign-in form fields – located by placeholder for consistency
    this.emailInput = this.page.getByPlaceholder('Enter email');
    this.passwordInput = this.page.getByPlaceholder('Enter password');

    // Primary submit button on the sign-in form
    this.submitButton = this.page.getByRole('button', { name: 'Sign In' });

    // ARIA alert role used for persistent error banners
    this.errorBanner = this.page.getByRole('alert');
  }

  /**
   * Navigates to the Sourgum marketing homepage using the absolute URL
   * from env.baseUrl. Using an absolute URL avoids failures when Playwright's
   * baseURL is empty or misconfigured (e.g. a missing CI secret).
   */
  public async openMarketingHome(): Promise<void> {
    const url = env.baseUrl;

    if (!/^https?:\/\//i.test(url)) {
      throw new Error(
        `BASE_URL is invalid or missing: "${url}". ` +
        'Set a valid URL in .env or as a GitHub secret.'
      );
    }

    await this.visit(url);
  }

  /** Clicks the Login link in the top-right navigation on the marketing site. */
  public async clickLoginFromTopNavigation(): Promise<void> {
    await this.topRightLoginButton.first().click();
  }

  /**
   * Asserts that the marketing homepage has fully loaded with the correct title.
   * Uses waitForFunction to poll document.title, which is more reliable than
   * toHaveTitle() when the title is set asynchronously by a JS framework.
   */
  public async expectMarketingHomeTitle(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForFunction(
      expectedTitle => document.title.trim() === expectedTitle,
      'Technology-Driven Waste Solutions | Sourgum'
    );
  }

  /**
   * Asserts that the dashboard sign-in page has loaded.
   * Checks both the URL and the visible welcome heading for reliability.
   */
  public async expectSignInPageLoaded(): Promise<void> {
    await this.waitForUrl(/dashboard\.sourgum\.com\/signin/i);
    await this.welcomeHeading.waitFor({ state: 'visible' });
  }

  /**
   * Fills in the sign-in form with the provided credentials and submits.
   * Use this for both valid and invalid credential scenarios.
   */
  public async login(credentials: LoginCredentials): Promise<void> {
    await this.emailInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  /**
   * Returns a locator for a transient error toast matching the given text.
   * The toast appears briefly in the top-right corner after a failed action.
   *
   * Use with expect(...).toBeVisible() in the test to assert the message
   * is captured before it disappears.
   *
   * Example:
   *   await expect(loginPage.errorToast(/incorrect username/i)).toBeVisible();
   */
  public errorToast(message: string | RegExp): Locator {
    return this.page.getByText(message).first();
  }

  /**
   * Reads the text content of a persistent ARIA alert element.
   * Use this for static error banners that remain visible after an action.
   * For transient toasts, use errorToast() instead.
   */
  public async readErrorMessage(): Promise<string> {
    await this.errorBanner.waitFor({ state: 'visible' });
    const text = await this.errorBanner.textContent();

    return text?.trim() ?? '';
  }
}
