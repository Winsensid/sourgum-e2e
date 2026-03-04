/**
 * playwright-config/projects.ts
 *
 * Defines the browser project matrix for the test run.
 * Each project maps to a real browser engine with its default device settings.
 *
 * To run cross-browser: uncomment the Firefox and WebKit entries below.
 * Each project appears as a separate column in the HTML report.
 */
import { devices } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

export const projects: PlaywrightTestConfig['projects'] = [
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome']
    }
  }
  // {
  //   name: 'firefox',
  //   use: {
  //     ...devices['Desktop Firefox']
  //   }
  // },
  // {
  //   name: 'webkit',
  //   use: {
  //     ...devices['Desktop Safari']
  //   }
  // }
];
