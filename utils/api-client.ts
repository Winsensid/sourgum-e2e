/**
 * utils/api-client.ts
 *
 * Reusable HTTP client wrapper built on top of Playwright's request API.
 * Use this for API-level test setup and teardown (e.g. creating/deleting
 * test data) without going through the browser UI.
 *
 * Usage:
 *   const client = new ApiClient();
 *   await client.initialize();
 *   const data = await client.get<MyType>('/endpoint');
 *   await client.dispose();
 */
import { request } from '@playwright/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';

import { env } from '../playwright-config/env';

export class ApiClient {
  private context: APIRequestContext | null = null;

  /**
   * Creates the underlying Playwright API request context.
   * Must be called before any get() or post() calls.
   * Safe to call multiple times – initialises only once.
   */
  public async initialize(): Promise<void> {
    if (this.context !== null) {
      return;
    }

    this.context = await request.newContext({
      baseURL: env.apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  /** Performs a typed GET request and returns the parsed JSON response body. */
  public async get<TResponse>(endpoint: string): Promise<TResponse> {
    const response = await this.contextOrThrow().get(endpoint);
    return this.parseResponse<TResponse>(response);
  }

  /** Performs a typed POST request with a JSON payload and returns the parsed response body. */
  public async post<TPayload extends object, TResponse>(endpoint: string, payload: TPayload): Promise<TResponse> {
    const response = await this.contextOrThrow().post(endpoint, { data: payload });
    return this.parseResponse<TResponse>(response);
  }

  /**
   * Releases the underlying request context and frees browser resources.
   * Call this in afterAll() hooks when using ApiClient inside test suites.
   */
  public async dispose(): Promise<void> {
    if (this.context === null) {
      return;
    }

    await this.context.dispose();
    this.context = null;
  }

  private contextOrThrow(): APIRequestContext {
    if (this.context === null) {
      throw new Error('ApiClient is not initialized. Call initialize() before making requests.');
    }

    return this.context;
  }

  private async parseResponse<TResponse>(response: APIResponse): Promise<TResponse> {
    if (!response.ok()) {
      throw new Error(`API request failed with status ${response.status()} and body ${await response.text()}`);
    }

    return (await response.json()) as TResponse;
  }
}
