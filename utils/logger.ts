/**
 * utils/logger.ts
 *
 * Lightweight structured logger for use inside tests, page objects and utilities.
 * Each log entry includes an ISO timestamp and severity level for easy filtering.
 *
 * Usage:
 *   import { logger } from '../utils/logger';
 *   logger.info('Test started', { user: 'test@sourgum.com' });
 *   logger.error('Unexpected response', { status: 500 });
 */

/** Supported log severity levels. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  public debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  public error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  /**
   * Internal method that formats and routes log entries to the correct
   * console channel based on severity.
   * Format: [ISO-TIMESTAMP] [LEVEL] message {optional context JSON}
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const contextPart = context === undefined ? '' : ` ${JSON.stringify(context)}`;
    const entry = `[${timestamp}] [${level.toUpperCase()}] ${message}${contextPart}`;

    if (level === 'error') {
      console.error(entry);
      return;
    }

    if (level === 'warn') {
      console.warn(entry);
      return;
    }

    console.log(entry);
  }
}

export const logger = new Logger();
