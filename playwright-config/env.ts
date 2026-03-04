/**
 * playwright-config/env.ts
 *
 * Loads environment variables from the .env file and exposes them as a
 * strongly-typed, frozen object (`env`) used throughout the framework.
 *
 * Add new environment variables here so they are validated in one place
 * rather than scattered across the codebase.
 */
import dotenv from 'dotenv';

// Load variables from .env into process.env at startup
dotenv.config();

/**
 * Safely parses a string environment variable as a boolean.
 * Returns `fallback` if the variable is not defined.
 */
const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value.trim().toLowerCase() === 'true';
};

/** Shape of all environment-driven config values used by the framework. */
export interface FrameworkEnvironment {
  readonly baseUrl: string;
  readonly apiBaseUrl: string;
  readonly headless: boolean;
  readonly ci: boolean;
  // Valid test user (positive login scenarios)
  readonly testUserEmail: string;
  readonly testUserPassword: string;
  // Invalid test user (negative / error-state scenarios)
  readonly testInvalidEmail: string;
  readonly testInvalidPassword: string;
}

/**
 * Singleton environment config instance.
 * Frozen to prevent accidental mutation at runtime.
 */
export const env: FrameworkEnvironment = Object.freeze({
  baseUrl: process.env.BASE_URL ?? 'https://sourgum.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://api.example.com',
  headless: parseBoolean(process.env.HEADLESS, true),
  ci: parseBoolean(process.env.CI, false),
  testUserEmail: process.env.TEST_USER_EMAIL ?? '',
  testUserPassword: process.env.TEST_USER_PASSWORD ?? '',
  testInvalidEmail: process.env.TEST_INVALID_EMAIL ?? 'invalid@sourgum.com',
  testInvalidPassword: process.env.TEST_INVALID_PASSWORD ?? 'WrongPassword123!'
});
