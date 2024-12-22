import * as mockjs from 'mockjs';

export function generateMockData(template: Record<string, any>): any {
  try {
    return mockjs.mock(template);
  } catch (error) {
    console.error('Error generating mock data:', error);
    return template;
  }
}

export function buildMockTemplate(schema: Record<string, any>): Record<string, any> {
  const template: Record<string, any> = {};

  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        template[key] = value.map(item => 
          typeof item === 'object' ? buildMockTemplate(item) : item
        );
      } else {
        template[key] = buildMockTemplate(value);
      }
    } else {
      template[key] = value;
    }
  }

  return template;
} 