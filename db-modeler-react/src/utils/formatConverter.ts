import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import yaml from 'js-yaml';
import { format as prettierFormat } from 'prettier';
import tomlPlugin from 'prettier-plugin-toml';
import propertiesPlugin from 'prettier-plugin-properties';
import iniPlugin from 'prettier-plugin-ini';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
});

const formatSync = (input: string, options: any): string => {
  try {
    return prettierFormat(input, { ...options, sync: true }) as string;
  } catch (error) {
    console.error('格式化失败:', error);
    return input;
  }
};

export const formatConverter = {
  // JSON 转换
  jsonToXml: (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return xmlBuilder.build(jsonObj);
    } catch (error) {
      throw new Error('无效的 JSON 格式');
    }
  },

  jsonToYaml: (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return yaml.dump(jsonObj);
    } catch (error) {
      throw new Error('无效的 JSON 格式');
    }
  },

  jsonToToml: (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return formatSync(JSON.stringify(jsonObj), {
        parser: 'toml',
        plugins: [tomlPlugin],
      });
    } catch (error) {
      throw new Error('无效的 JSON 格式');
    }
  },

  jsonToProperties: (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return formatSync(JSON.stringify(jsonObj), {
        parser: 'properties',
        plugins: [propertiesPlugin],
      });
    } catch (error) {
      throw new Error('无效的 JSON 格式');
    }
  },

  jsonToIni: (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return formatSync(JSON.stringify(jsonObj), {
        parser: 'ini',
        plugins: [iniPlugin],
      });
    } catch (error) {
      throw new Error('无效的 JSON 格式');
    }
  },

  // XML 转换
  xmlToJson: (xmlString: string): string => {
    try {
      const jsonObj = xmlParser.parse(xmlString);
      return JSON.stringify(jsonObj, null, 2);
    } catch (error) {
      throw new Error('无效的 XML 格式');
    }
  },

  xmlToYaml: (xmlString: string): string => {
    try {
      const jsonObj = xmlParser.parse(xmlString);
      return yaml.dump(jsonObj);
    } catch (error) {
      throw new Error('无效的 XML 格式');
    }
  },

  xmlToToml: (xmlString: string): string => {
    try {
      const jsonObj = xmlParser.parse(xmlString);
      return formatSync(JSON.stringify(jsonObj), {
        parser: 'toml',
        plugins: [tomlPlugin],
      });
    } catch (error) {
      throw new Error('无效的 XML 格式');
    }
  },

  xmlToProperties: (xmlString: string): string => {
    try {
      const jsonObj = xmlParser.parse(xmlString);
      return formatSync(JSON.stringify(jsonObj), {
        parser: 'properties',
        plugins: [propertiesPlugin],
      });
    } catch (error) {
      throw new Error('无效的 XML 格式');
    }
  },

  xmlToIni: (xmlString: string): string => {
    try {
      const jsonObj = xmlParser.parse(xmlString);
      return formatSync(JSON.stringify(jsonObj), {
        parser: 'ini',
        plugins: [iniPlugin],
      });
    } catch (error) {
      throw new Error('无效的 XML 格式');
    }
  },

  // YAML 转换
  yamlToJson: (yamlString: string): string => {
    try {
      const obj = yaml.load(yamlString);
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      throw new Error('无效的 YAML 格式');
    }
  },

  yamlToXml: (yamlString: string): string => {
    try {
      const obj = yaml.load(yamlString);
      return xmlBuilder.build(obj);
    } catch (error) {
      throw new Error('无效的 YAML 格式');
    }
  },

  yamlToToml: (yamlString: string): string => {
    try {
      const obj = yaml.load(yamlString);
      return formatSync(JSON.stringify(obj), {
        parser: 'toml',
        plugins: [tomlPlugin],
      });
    } catch (error) {
      throw new Error('无效的 YAML 格式');
    }
  },

  yamlToProperties: (yamlString: string): string => {
    try {
      const obj = yaml.load(yamlString);
      return formatSync(JSON.stringify(obj), {
        parser: 'properties',
        plugins: [propertiesPlugin],
      });
    } catch (error) {
      throw new Error('无效的 YAML 格式');
    }
  },

  yamlToIni: (yamlString: string): string => {
    try {
      const obj = yaml.load(yamlString);
      return formatSync(JSON.stringify(obj), {
        parser: 'ini',
        plugins: [iniPlugin],
      });
    } catch (error) {
      throw new Error('无效的 YAML 格式');
    }
  },

  // 格式化
  formatJson: (jsonString: string): string => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return JSON.stringify(jsonObj, null, 2);
    } catch (error) {
      throw new Error('无效的 JSON 格式');
    }
  },

  formatXml: (xmlString: string): string => {
    try {
      const jsonObj = xmlParser.parse(xmlString);
      return xmlBuilder.build(jsonObj);
    } catch (error) {
      throw new Error('无效的 XML 格式');
    }
  },

  formatYaml: (yamlString: string): string => {
    try {
      const obj = yaml.load(yamlString);
      return yaml.dump(obj);
    } catch (error) {
      throw new Error('无效的 YAML 格式');
    }
  },

  formatToml: (tomlString: string): string => {
    try {
      return formatSync(tomlString, {
        parser: 'toml',
        plugins: [tomlPlugin],
      });
    } catch (error) {
      throw new Error('无效的 TOML 格式');
    }
  },

  formatProperties: (propertiesString: string): string => {
    try {
      return formatSync(propertiesString, {
        parser: 'properties',
        plugins: [propertiesPlugin],
      });
    } catch (error) {
      throw new Error('无效的 Properties 格式');
    }
  },

  formatIni: (iniString: string): string => {
    try {
      return formatSync(iniString, {
        parser: 'ini',
        plugins: [iniPlugin],
      });
    } catch (error) {
      throw new Error('无效的 INI 格式');
    }
  },

  // 验证
  validateJson: (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  },

  validateXml: (xmlString: string): boolean => {
    try {
      xmlParser.parse(xmlString);
      return true;
    } catch (error) {
      return false;
    }
  },

  validateYaml: (yamlString: string): boolean => {
    try {
      yaml.load(yamlString);
      return true;
    } catch (error) {
      return false;
    }
  },

  validateToml: (tomlString: string): boolean => {
    try {
      formatSync(tomlString, {
        parser: 'toml',
        plugins: [tomlPlugin],
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  validateProperties: (propertiesString: string): boolean => {
    try {
      formatSync(propertiesString, {
        parser: 'properties',
        plugins: [propertiesPlugin],
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  validateIni: (iniString: string): boolean => {
    try {
      formatSync(iniString, {
        parser: 'ini',
        plugins: [iniPlugin],
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // 检测格式
  detectFormat: (data: string): 'json' | 'xml' | 'yaml' | 'toml' | 'properties' | 'ini' | 'unknown' => {
    // 尝试解析为 JSON
    try {
      JSON.parse(data);
      return 'json';
    } catch {}

    // 尝试解析为 XML
    try {
      xmlParser.parse(data);
      if (data.trim().startsWith('<')) {
        return 'xml';
      }
    } catch {}

    // 尝试解析为 YAML
    try {
      yaml.load(data);
      if (!data.trim().startsWith('{') && !data.trim().startsWith('[') && !data.trim().startsWith('<')) {
        return 'yaml';
      }
    } catch {}

    // 尝试解析为 TOML
    try {
      formatSync(data, {
        parser: 'toml',
        plugins: [tomlPlugin],
      });
      if (data.includes('=') && !data.includes('{') && !data.includes('[')) {
        return 'toml';
      }
    } catch {}

    // 尝试解析为 Properties
    try {
      formatSync(data, {
        parser: 'properties',
        plugins: [propertiesPlugin],
      });
      if (data.includes('=') && !data.includes('{') && !data.includes('[')) {
        return 'properties';
      }
    } catch {}

    // 尝试解析为 INI
    try {
      formatSync(data, {
        parser: 'ini',
        plugins: [iniPlugin],
      });
      if (data.includes('[') && data.includes('=')) {
        return 'ini';
      }
    } catch {}

    return 'unknown';
  },
}; 