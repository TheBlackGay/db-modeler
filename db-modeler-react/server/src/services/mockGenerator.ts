import type { Request } from 'express';
import type { MockRule } from '../types/api.types';
import * as mockjs from 'mockjs';

export async function generateMockData(rules: MockRule[], req: Request): Promise<any> {
  try {
    // 如果没有规则，返回空对象
    if (!rules || rules.length === 0) {
      return {};
    }

    // 构建Mock模板
    const template = buildMockTemplate(rules);

    // 生成Mock数据
    return mockjs.mock(template);
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
}

function buildMockTemplate(rules: MockRule[]): Record<string, any> {
  const template: Record<string, any> = {};

  rules.forEach(rule => {
    if (!rule.field || !rule.rule) {
      return;
    }

    // 处理嵌套字段
    const fields = rule.field.split('.');
    let current = template;

    // 遍历字段路径，创建嵌套对象
    for (let i = 0; i < fields.length - 1; i++) {
      const field = fields[i];
      if (!(field in current)) {
        current[field] = {};
      }
      current = current[field];
    }

    // 设置最后一个字段的Mock规则
    const lastField = fields[fields.length - 1];
    current[lastField] = rule.rule;
  });

  return template;
} 