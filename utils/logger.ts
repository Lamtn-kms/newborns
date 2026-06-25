import { test } from '@playwright/test';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

class Logger {
  private testTitle: string = '';

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.testTitle}] ${message}`;
  }

  setTestContext(title: string): void {
    this.testTitle = title;
  }

  info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  error(message: string): void {
    console.error(this.formatMessage('ERROR', message));
  }

  debug(message: string): void {
    if (process.env.DEBUG === 'true') {
      console.log(this.formatMessage('DEBUG', message));
    }
  }

  step(stepName: string): void {
    console.log(this.formatMessage('INFO', `▶ STEP: ${stepName}`));
  }

  stepPass(stepName: string): void {
    console.log(this.formatMessage('INFO', `✓ PASS: ${stepName}`));
  }

  stepFail(stepName: string, error?: string): void {
    console.error(this.formatMessage('ERROR', `✗ FAIL: ${stepName}${error ? ' - ' + error : ''}`));
  }
}

export const logger = new Logger();
