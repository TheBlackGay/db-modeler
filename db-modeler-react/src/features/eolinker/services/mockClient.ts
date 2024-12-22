import type { MockConfig, MockRule } from '../types/api.types';

export class MockClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async start(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error('Mock server is not healthy');
      }
      console.log('Mock client connected to server');
    } catch (error) {
      console.error('Failed to connect to mock server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    console.log('Mock client stopped');
  }

  async test(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/test`);
      if (!response.ok) {
        return false;
      }
      const data = await response.json();
      return data.message === 'Mock server is running';
    } catch (error) {
      console.error('Mock server test failed:', error);
      return false;
    }
  }

  async request(method: string, path: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  }

  async getMockConfig(apiId: string): Promise<MockConfig | null> {
    try {
      const response = await this.request('GET', `/mock/config/${apiId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get mock config:', error);
      return null;
    }
  }

  async getMockRules(configId: string): Promise<MockRule[]> {
    try {
      const response = await this.request('GET', `/mock/rules/${configId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get mock rules:', error);
      return [];
    }
  }
} 