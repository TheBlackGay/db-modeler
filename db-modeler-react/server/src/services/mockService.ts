import type { Request } from 'express';
import type { MockConfig, MockRule, MockResponse } from '../types/api.types';
import { generateMockData } from './mockGenerator';

export async function generateResponse(
  config: MockConfig,
  rules: MockRule[],
  req: Request
): Promise<MockResponse> {
  try {
    // 解析响应体模板
    let responseBody: Record<string, any> | null = null;
    if (config.response_body) {
      try {
        responseBody = JSON.parse(config.response_body);
        if (typeof responseBody !== 'object' || responseBody === null) {
          responseBody = { data: responseBody };
        }
      } catch (error) {
        console.warn('Failed to parse response body template:', error);
        responseBody = { data: config.response_body };
      }
    }

    // 生成Mock数据
    const mockData = await generateMockData(rules, req);

    // 构建响应体
    const body = responseBody
      ? { ...responseBody, ...mockData }
      : mockData;

    return {
      status: config.status_code,
      headers: config.headers || {},
      body,
    };
  } catch (error) {
    console.error('Error generating mock response:', error);
    return {
      status: 500,
      headers: {},
      body: {
        code: 500,
        message: 'Failed to generate mock response',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
} 