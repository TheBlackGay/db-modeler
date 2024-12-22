import axios from 'axios';
import { MOCK_SERVER_CONFIG } from '../config';

const mockClient = axios.create({
  baseURL: MOCK_SERVER_CONFIG.baseUrl,
  timeout: MOCK_SERVER_CONFIG.timeout,
  headers: MOCK_SERVER_CONFIG.headers,
});

export async function checkMockServerHealth(): Promise<boolean> {
  try {
    const response = await mockClient.get('/health');
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Mock server health check failed:', error);
    return false;
  }
}

export async function testMockServer(): Promise<any> {
  try {
    const response = await mockClient.get('/mock/test');
    return response.data;
  } catch (error) {
    console.error('Mock server test failed:', error);
    throw error;
  }
}

export const MockClient = {
  checkHealth: checkMockServerHealth,
  test: testMockServer,
}; 