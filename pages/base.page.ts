/**
 * pages/base.page.ts
 *
 * Abstract base class for all Page Object Model (POM) classes.
 *
 * Every page class extends BasePage to inherit common browser interactions
 * (navigation, URL waiting, title reading). This keeps individual page
 * objects focused on page-specific selectors and actions only.
 *
 * Usage:
 *   export class MyPage extends BasePage { ... }
 */
import type { Page } from '@playwright/test';

export abstract class BasePage {
  /** The underlying Playwright Page instance shared across all methods. */
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a path relative to the configured baseURL.
   * e.g. visit('/login') → https://sourgum.com/login
   */
  public async visit(pathname = ''): Promise<void> {
    await this.page.goto(pathname);
  }

  /** Waits until the current page URL matches the given string or pattern. */
  public async waitForUrl(url: RegExp | string): Promise<void> {
    await this.page.waitForURL(url);
  }

  /** Returns the current page <title> text. */
  public async title(): Promise<string> {
    return this.page.title();
  }
}
