import type { Request, Response } from 'express';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from '../types/store';
import { generateResponse } from './mockService';

export async function handleMockRequest(req: Request, res: Response, store: Store<RootState>) {
  try {
    const state = store.getState();
    const { apis, mockConfigs, mockRules } = state.eolinker;

    // 查找匹配的API
    const api = apis.find(api => {
      return api.method.toLowerCase() === req.method.toLowerCase() && 
             api.path === req.path;
    });

    if (!api) {
      return res.status(404).json({
        code: 404,
        message: 'API not found',
        path: req.path,
      });
    }

    // 查找API的Mock配置
    const mockConfig = mockConfigs.find(config => 
      config.api_id === api.id && config.enabled
    );

    if (!mockConfig) {
      return res.status(404).json({
        code: 404,
        message: 'Mock config not found or disabled',
        api_id: api.id,
      });
    }

    // 查找Mock规则
    const rules = mockRules.filter(rule => rule.config_id === mockConfig.id);

    // 生成响应
    const response = await generateResponse(mockConfig, rules, req);

    // 设置响应头
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // 如果配置了延迟，则等待
    if (mockConfig.delay && mockConfig.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, mockConfig.delay));
    }

    // 发送响应
    res.status(response.status).json(response.body);
  } catch (error) {
    console.error('Error handling mock request:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 