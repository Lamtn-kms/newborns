export class AppConfig {
  static readonly debounceDelayMs = 250;

  static get adminEmail(): string {
    return process.env.ADMIN_USERNAME ?? '';
  }

  static get adminPassword(): string {
    return process.env.ADMIN_PASSWORD ?? '';
  }
}
