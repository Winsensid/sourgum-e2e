/**
 * playwright.config.ts
 *
 * Root configuration file for the Playwright test framework.
 * All global settings (timeouts, parallelism, retries, browser projects)
 * are defined here and sourced from the modular playwright-config/ folder.
 *
 * Environment-specific values (base URL, headless mode, CI flag) are
 * loaded at runtime from the .env file via playwright-config/env.ts.
 */
import { defineConfig } from '@playwright/test';

import { env } from './playwright-config/env';
import { projects } from './playwright-config/projects';
import { reporters } from './playwright-config/reporters';

export default defineConfig({
  // Folder where all test specs are discovered
  testDir: './tests',

  // Maximum time a single test can run before it is marked as timed out
  timeout: 30_000,

  // Maximum time Playwright waits for an expect() assertion to pass
  expect: {
    timeout: 5_000
  },

  // Run all tests in all files in parallel
  fullyParallel: true,

  // Prevent test.only() from being accidentally committed to CI
  forbidOnly: env.ci,

  // Retry failed tests twice on CI; no retries locally for faster feedback
  retries: env.ci ? 2 : 0,

  // Limit parallelism on CI to avoid resource contention
  workers: env.ci ? 2 : undefined,

  // Report output configuration (see playwright-config/reporters.ts)
  reporter: reporters,

  // Where screenshots, videos and traces are saved
  outputDir: 'test-results/artifacts',

  use: {
    // All relative page.goto() calls resolve against this URL
    baseURL: env.baseUrl,

    // Run browsers without a visible window unless overridden in .env
    headless: env.headless,

    // Capture a Playwright trace zip on the first retry of a failed test
    trace: 'on-first-retry',

    // Take a screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Keep the recorded video only when a test fails
    video: 'retain-on-failure',

    // Maximum time for a single action (click, fill, etc.)
    actionTimeout: 10_000,

    // Maximum time for a page navigation to complete
    navigationTimeout: 15_000
  },

  // Browser project matrix (see playwright-config/projects.ts)
  projects
});
