/**
 * playwright-config/reporters.ts
 *
 * Configures how test results are output after each run:
 *
 *   list   – prints each test result to the terminal in real time.
 *   html   – generates a self-contained HTML report in playwright-report/.
 *            Open it with: npx playwright show-report
 *   junit  – produces a JUnit XML file for CI pipeline integrations
 *            (GitHub Actions, Jenkins, etc.).
 */
import type { ReporterDescription } from '@playwright/test';

export const reporters: ReporterDescription[] = [
  // Real-time terminal output
  ['list'],

  // Full HTML report with traces, screenshots and video attachments
  ['html', { open: 'never', outputFolder: 'playwright-report' }],

  // JUnit XML for CI artifact ingestion
  ['junit', { outputFile: 'test-results/junit/results.xml' }]
];
