import { formatConverter } from './formatConverter';
import yaml from 'js-yaml';
import { format as prettierFormat, Options } from 'prettier';
import parserBabel from 'prettier/parser-babel';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserMarkdown from 'prettier/parser-markdown';
import parserYaml from 'prettier/parser-yaml';
import xmlPlugin from '@prettier/plugin-xml';
import tomlPlugin from 'prettier-plugin-toml';
import propertiesPlugin from 'prettier-plugin-properties';
import iniPlugin from 'prettier-plugin-ini';

interface FormatOptions extends Partial<Options> {
  parser: string;
  plugins: any[];
  printWidth?: number;
  sync?: boolean;
}

const formatSync = (input: string, options: FormatOptions): string => {
  try {
    const result = prettierFormat(input, {
      ...options,
      sync: true,
      printWidth: options.printWidth || 80,
    });
    return typeof result === 'string' ? result : input;
  } catch (error) {
    console.error('格式化失败:', error);
    return input;
  }
};

export const responseFormatter = {
  // 格式化响应数据
  formatResponse: (data: string, contentType: string): string => {
    try {
      const type = contentType.toLowerCase();

      if (type.includes('application/json')) {
        return formatConverter.formatJson(data);
      } else if (type.includes('application/xml') || type.includes('text/xml')) {
        return formatSync(data, {
          parser: 'xml',
          plugins: [xmlPlugin],
          printWidth: 80,
        });
      } else if (type.includes('text/html')) {
        return formatSync(data, {
          parser: 'html',
          plugins: [parserHtml],
          printWidth: 80,
        });
      } else if (type.includes('text/css')) {
        return formatSync(data, {
          parser: 'css',
          plugins: [parserCss],
          printWidth: 80,
        });
      } else if (type.includes('javascript')) {
        return formatSync(data, {
          parser: 'babel',
          plugins: [parserBabel],
          printWidth: 80,
        });
      } else if (type.includes('text/markdown')) {
        return formatSync(data, {
          parser: 'markdown',
          plugins: [parserMarkdown],
          printWidth: 80,
        });
      } else if (type.includes('yaml')) {
        return formatSync(data, {
          parser: 'yaml',
          plugins: [parserYaml],
          printWidth: 80,
        });
      } else if (type.includes('text/x-toml')) {
        return formatSync(data, {
          parser: 'toml',
          plugins: [tomlPlugin],
          printWidth: 80,
        });
      } else if (type.includes('text/x-properties')) {
        return formatSync(data, {
          parser: 'properties',
          plugins: [propertiesPlugin],
          printWidth: 80,
        });
      } else if (type.includes('text/x-ini')) {
        return formatSync(data, {
          parser: 'ini',
          plugins: [iniPlugin],
          printWidth: 80,
        });
      }
      return data;
    } catch (error) {
      return data;
    }
  },

  // 获取响应数据的语言类型
  getLanguage: (contentType: string): string => {
    const type = contentType.toLowerCase();
    
    // 常见的文本格式
    if (type.includes('application/json')) return 'json';
    if (type.includes('application/xml') || type.includes('text/xml')) return 'xml';
    if (type.includes('text/html')) return 'html';
    if (type.includes('text/css')) return 'css';
    if (type.includes('javascript')) return 'javascript';
    if (type.includes('typescript')) return 'typescript';
    if (type.includes('text/jsx')) return 'javascript';
    if (type.includes('text/tsx')) return 'typescript';
    if (type.includes('text/markdown')) return 'markdown';
    if (type.includes('yaml') || type.includes('yml')) return 'yaml';
    
    // 编程语言
    if (type.includes('text/x-python')) return 'python';
    if (type.includes('text/x-java')) return 'java';
    if (type.includes('text/x-c')) return 'c';
    if (type.includes('text/x-cpp')) return 'cpp';
    if (type.includes('text/x-csharp')) return 'csharp';
    if (type.includes('text/x-go')) return 'go';
    if (type.includes('text/x-rust')) return 'rust';
    if (type.includes('text/x-ruby')) return 'ruby';
    if (type.includes('text/x-php')) return 'php';
    if (type.includes('text/x-swift')) return 'swift';
    if (type.includes('text/x-kotlin')) return 'kotlin';
    if (type.includes('text/x-scala')) return 'scala';
    
    // 数据格式
    if (type.includes('text/csv')) return 'csv';
    if (type.includes('application/x-protobuf')) return 'protobuf';
    if (type.includes('application/graphql')) return 'graphql';
    if (type.includes('application/x-www-form-urlencoded')) return 'plaintext';
    
    // 配置文件格式
    if (type.includes('text/x-properties')) return 'properties';
    if (type.includes('text/x-ini')) return 'ini';
    if (type.includes('text/x-toml')) return 'toml';
    
    // 标记语言
    if (type.includes('text/restructuredtext')) return 'restructuredtext';
    if (type.includes('text/asciidoc')) return 'asciidoc';
    if (type.includes('text/org')) return 'org';
    
    // 脚本语言
    if (type.includes('text/x-sh') || type.includes('text/x-shellscript')) return 'shell';
    if (type.includes('text/x-powershell')) return 'powershell';
    if (type.includes('text/x-batch')) return 'bat';
    
    // 默认纯文本
    return 'plaintext';
  },

  // 美化响应数据
  beautifyResponse: (data: string, contentType: string): string => {
    try {
      const type = contentType.toLowerCase();

      if (type.includes('application/json')) {
        return formatConverter.formatJson(data);
      } else if (type.includes('application/xml') || type.includes('text/xml')) {
        return formatSync(data, {
          parser: 'xml',
          plugins: [xmlPlugin],
          printWidth: 80,
        });
      } else if (type.includes('text/html')) {
        return formatSync(data, {
          parser: 'html',
          plugins: [parserHtml],
          printWidth: 80,
        });
      } else if (type.includes('text/css')) {
        return formatSync(data, {
          parser: 'css',
          plugins: [parserCss],
          printWidth: 80,
        });
      } else if (type.includes('javascript')) {
        return formatSync(data, {
          parser: 'babel',
          plugins: [parserBabel],
          printWidth: 80,
        });
      } else if (type.includes('text/markdown')) {
        return formatSync(data, {
          parser: 'markdown',
          plugins: [parserMarkdown],
          printWidth: 80,
        });
      } else if (type.includes('yaml')) {
        return formatSync(data, {
          parser: 'yaml',
          plugins: [parserYaml],
          printWidth: 80,
        });
      } else if (type.includes('text/x-toml')) {
        return formatSync(data, {
          parser: 'toml',
          plugins: [tomlPlugin],
          printWidth: 80,
        });
      } else if (type.includes('text/x-properties')) {
        return formatSync(data, {
          parser: 'properties',
          plugins: [propertiesPlugin],
          printWidth: 80,
        });
      } else if (type.includes('text/x-ini')) {
        return formatSync(data, {
          parser: 'ini',
          plugins: [iniPlugin],
          printWidth: 80,
        });
      }
      return data;
    } catch (error) {
      return data;
    }
  },

  // 压缩响应数据
  minifyResponse: (data: string, contentType: string): string => {
    try {
      const type = contentType.toLowerCase();

      if (type.includes('application/json')) {
        return JSON.stringify(JSON.parse(data));
      } else if (type.includes('application/xml') || type.includes('text/xml')) {
        return formatSync(data, {
          parser: 'xml',
          plugins: [xmlPlugin],
          printWidth: Infinity,
        }).replace(/>\s+</g, '><').trim();
      } else if (type.includes('text/html')) {
        return formatSync(data, {
          parser: 'html',
          plugins: [parserHtml],
          printWidth: Infinity,
        }).replace(/>\s+</g, '><').trim();
      } else if (type.includes('text/css')) {
        return formatSync(data, {
          parser: 'css',
          plugins: [parserCss],
          printWidth: Infinity,
        }).replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
      } else if (type.includes('javascript')) {
        return formatSync(data, {
          parser: 'babel',
          plugins: [parserBabel],
          printWidth: Infinity,
        });
      } else if (type.includes('yaml')) {
        const obj = yaml.load(data);
        return yaml.dump(obj, { flowLevel: 0 });
      } else if (type.includes('text/x-toml')) {
        return formatSync(data, {
          parser: 'toml',
          plugins: [tomlPlugin],
          printWidth: Infinity,
        });
      } else if (type.includes('text/x-properties')) {
        return formatSync(data, {
          parser: 'properties',
          plugins: [propertiesPlugin],
          printWidth: Infinity,
        });
      } else if (type.includes('text/x-ini')) {
        return formatSync(data, {
          parser: 'ini',
          plugins: [iniPlugin],
          printWidth: Infinity,
        });
      }
      return data;
    } catch (error) {
      return data;
    }
  },

  // 验证响应数据格式
  validateResponse: (data: string, contentType: string): boolean => {
    try {
      const type = contentType.toLowerCase();

      if (type.includes('application/json')) {
        return formatConverter.validateJson(data);
      } else if (type.includes('application/xml') || type.includes('text/xml')) {
        return formatConverter.validateXml(data);
      } else if (type.includes('yaml')) {
        return formatConverter.validateYaml(data);
      } else if (type.includes('text/x-toml')) {
        formatSync(data, {
          parser: 'toml',
          plugins: [tomlPlugin],
        });
        return true;
      } else if (type.includes('text/x-properties')) {
        formatSync(data, {
          parser: 'properties',
          plugins: [propertiesPlugin],
        });
        return true;
      } else if (type.includes('text/x-ini')) {
        formatSync(data, {
          parser: 'ini',
          plugins: [iniPlugin],
        });
        return true;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  // 转换数据格式
  convertFormat: (data: string, fromType: string, toType: string): string => {
    try {
      if (fromType === 'json' && toType === 'xml') {
        return formatConverter.jsonToXml(data);
      } else if (fromType === 'xml' && toType === 'json') {
        return formatConverter.xmlToJson(data);
      } else if (fromType === 'json' && toType === 'yaml') {
        const obj = JSON.parse(data);
        return yaml.dump(obj);
      } else if (fromType === 'yaml' && toType === 'json') {
        const obj = yaml.load(data);
        return JSON.stringify(obj, null, 2);
      } else if (fromType === 'xml' && toType === 'yaml') {
        return formatConverter.xmlToYaml(data);
      } else if (fromType === 'yaml' && toType === 'xml') {
        return formatConverter.yamlToXml(data);
      }
      return data;
    } catch (error) {
      throw new Error(`无法将 ${fromType} 转换为 ${toType}`);
    }
  },
}; 