import { APIRequestContext } from '@playwright/test';

export class NewbornsAPI {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string): Promise<{ token: string }> {
    const response = await this.request.post('/api/auth/login', {
      data: { email, password },
    });
    return response.json();
  }

  async getProfile(): Promise<unknown> {
    const response = await this.request.get('/api/profile');
    return response.json();
  }

  async getCourses(): Promise<unknown> {
    const response = await this.request.get('/api/courses');
    return response.json();
  }

  async getUsers(): Promise<unknown> {
    const response = await this.request.get('/api/users');
    return response.json();
  }

  async getSidebarMenu(): Promise<unknown> {
    const response = await this.request.get('/api/menu');
    return response.json();
  }
}
