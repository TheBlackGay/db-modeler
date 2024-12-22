import type { MockConfig, MockResponse, MockRule } from '../types/api.types';
import * as mockjs from 'mockjs';
import { generateMockData } from './mockGenerator';

export class MockService {
  private configs: MockConfig[] = [];

  setConfigs(configs: MockConfig[]) {
    this.configs = configs;
  }

  async generateResponse(apiId: string, params: Record<string, any>): Promise<MockResponse> {
    try {
      const config = this.configs.find(c => c.api_id === apiId && c.enabled);
      
      if (!config) {
        return {
          status: 404,
          headers: {},
          body: { error: 'No mock config found' }
        };
      }

      // 验证规则
      if (config.rules && !this.validateRules(config.rules, params)) {
        return {
          status: 400,
          headers: {},
          body: { error: 'Invalid parameters' }
        };
      }

      // 生成响应
      const response = await this.buildResponse(config);
      
      // 模拟延迟
      if (config.delay) {
        await new Promise(resolve => setTimeout(resolve, config.delay));
      }

      return response;
    } catch (error) {
      console.error('Error generating mock response:', error);
      return {
        status: 500,
        headers: {},
        body: { error: 'Internal server error' }
      };
    }
  }

  private validateRules(rules: MockRule[], params: Record<string, any>): boolean {
    return rules.every(rule => {
      const value = params[rule.field];
      switch (rule.type) {
        case 'string':
          return typeof value === 'string';
        case 'number':
          return typeof value === 'number';
        case 'boolean':
          return typeof value === 'boolean';
        case 'array':
          return Array.isArray(value);
        case 'object':
          return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'null':
          return value === null;
        default:
          return true;
      }
    });
  }

  private async buildResponse(config: MockConfig): Promise<MockResponse> {
    try {
      const responseBody = config.response_body
        ? generateMockData(JSON.parse(config.response_body))
        : {};

      return {
        status: config.status_code || 200,
        headers: config.headers || {},
        body: responseBody
      };
    } catch (error) {
      console.error('Error building mock response:', error);
      return {
        status: 500,
        headers: {},
        body: { error: 'Error generating mock response' }
      };
    }
  }
} 