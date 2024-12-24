import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Space, Button, message, Dropdown, Input, Switch, Badge } from 'antd';
import Editor from '@monaco-editor/react';
import { ResponseData } from '../pages/interface/types';
import {
  CopyOutlined,
  DownloadOutlined,
  SearchOutlined,
  SwapOutlined,
  FormatPainterOutlined,
  CompressOutlined,
  FileTextOutlined,
  BarChartOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { formatConverter } from '../utils/formatConverter';
import { responseFormatter } from '../utils/responseFormatter';
import { responseAnalyzer } from '../utils/responseAnalyzer';
import { ResponseStats } from './ResponseStats';

type FormatType = 'json' | 'xml' | 'yaml' | 'toml' | 'properties' | 'ini' | 'text';

const formatOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'YAML', value: 'yaml' },
  { label: 'TOML', value: 'toml' },
  { label: 'Properties', value: 'properties' },
  { label: 'INI', value: 'ini' },
] as const;

interface ResponseViewerProps {
  response: ResponseData;
}

interface SearchOptions {
  caseSensitive: boolean;
  useRegex: boolean;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const [searchText, setSearchText] = useState('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    caseSensitive: false,
    useRegex: false,
  });
  const [matchCount, setMatchCount] = useState(0);
  const [currentFormat, setCurrentFormat] = useState<FormatType>(
    response.contentType.includes('json') ? 'json'
    : response.contentType.includes('xml') ? 'xml'
    : response.contentType.includes('yaml') ? 'yaml'
    : response.contentType.includes('toml') ? 'toml'
    : response.contentType.includes('properties') ? 'properties'
    : response.contentType.includes('ini') ? 'ini'
    : 'text'
  );
  const [content, setContent] = useState(responseFormatter.formatResponse(response.rawData, response.contentType));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => message.success('已复制到剪贴板'),
      () => message.error('复制失败')
    );
  };

  const handleFormatConvert = (targetFormat: string) => {
    try {
      let result = content;
      const currentFormat = formatConverter.detectFormat(content);

      if (currentFormat === targetFormat) {
        message.info(`当前已经是 ${targetFormat.toUpperCase()} 格式`);
        return;
      }

      switch (currentFormat) {
        case 'json':
          switch (targetFormat) {
            case 'xml': result = formatConverter.jsonToXml(content); break;
            case 'yaml': result = formatConverter.jsonToYaml(content); break;
            case 'toml': result = formatConverter.jsonToToml(content); break;
            case 'properties': result = formatConverter.jsonToProperties(content); break;
            case 'ini': result = formatConverter.jsonToIni(content); break;
          }
          break;
        case 'xml':
          switch (targetFormat) {
            case 'json': result = formatConverter.xmlToJson(content); break;
            case 'yaml': result = formatConverter.xmlToYaml(content); break;
            case 'toml': result = formatConverter.xmlToToml(content); break;
            case 'properties': result = formatConverter.xmlToProperties(content); break;
            case 'ini': result = formatConverter.xmlToIni(content); break;
          }
          break;
        case 'yaml':
          switch (targetFormat) {
            case 'json': result = formatConverter.yamlToJson(content); break;
            case 'xml': result = formatConverter.yamlToXml(content); break;
            case 'toml': result = formatConverter.yamlToToml(content); break;
            case 'properties': result = formatConverter.yamlToProperties(content); break;
            case 'ini': result = formatConverter.yamlToIni(content); break;
          }
          break;
        default:
          throw new Error('不支持的格式转换');
      }

      setContent(result);
      setCurrentFormat(targetFormat as FormatType);
      message.success(`已转换为 ${targetFormat.toUpperCase()} 格式`);
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleFormat = () => {
    try {
      let result = content;
      switch (currentFormat) {
        case 'json': result = formatConverter.formatJson(content); break;
        case 'xml': result = formatConverter.formatXml(content); break;
        case 'yaml': result = formatConverter.formatYaml(content); break;
        case 'toml': result = formatConverter.formatToml(content); break;
        case 'properties': result = formatConverter.formatProperties(content); break;
        case 'ini': result = formatConverter.formatIni(content); break;
      }
      setContent(result);
      message.success('格式化成功');
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleMinify = () => {
    try {
      let result = content;
      switch (currentFormat) {
        case 'json': result = JSON.stringify(JSON.parse(content)); break;
        case 'xml': result = content.replace(/>\s+</g, '><').trim(); break;
        case 'yaml': result = content.replace(/\n\s+/g, '\n').trim(); break;
        case 'toml': result = content.replace(/\n\s+/g, '\n').trim(); break;
        case 'properties': result = content.replace(/\n\s+/g, '\n').trim(); break;
        case 'ini': result = content.replace(/\n\s+/g, '\n').trim(); break;
      }
      setContent(result);
      message.success('压缩成功');
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const handleSearch = () => {
    if (!searchText) {
      message.info('请输入搜索内容');
      return;
    }

    try {
      const regex = searchOptions.useRegex
        ? new RegExp(searchText, searchOptions.caseSensitive ? 'g' : 'gi')
        : new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), searchOptions.caseSensitive ? 'g' : 'gi');

      const matches = content.match(regex);
      setMatchCount(matches ? matches.length : 0);
      message.info(`找到 ${matches ? matches.length : 0} 处匹配`);
    } catch (error) {
      message.error('无效的搜索表达式');
    }
  };

  const renderBody = () => {
    const language = responseFormatter.getLanguage(response.contentType);

    return (
      <div>
        <Space style={{ marginBottom: '16px' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索内容"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: '300px' }}
          />
          <Switch
            checkedChildren="区分大小写"
            unCheckedChildren="不区分大小写"
            checked={searchOptions.caseSensitive}
            onChange={checked => setSearchOptions(prev => ({ ...prev, caseSensitive: checked }))}
          />
          <Switch
            checkedChildren="正则表达式"
            unCheckedChildren="普通文本"
            checked={searchOptions.useRegex}
            onChange={checked => setSearchOptions(prev => ({ ...prev, useRegex: checked }))}
          />
          <Button onClick={handleSearch}>搜索</Button>
          {matchCount > 0 && (
            <Badge count={matchCount} style={{ backgroundColor: '#52c41a' }}>
              <Tag>匹配数</Tag>
            </Badge>
          )}
        </Space>
        <Space style={{ float: 'right', marginBottom: '8px' }}>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(content)}
          >
            复制
          </Button>
          <Dropdown
            menu={{
              items: formatOptions
                .filter(option => option.value !== currentFormat)
                .map(option => ({
                  key: option.value,
                  label: `转换为 ${option.label}`,
                  onClick: () => handleFormatConvert(option.value),
                })),
            }}
          >
            <Button type="text" icon={<SwapOutlined />}>
              格式转换
            </Button>
          </Dropdown>
          <Button
            type="text"
            icon={<FormatPainterOutlined />}
            onClick={handleFormat}
          >
            格式化
          </Button>
          <Button
            type="text"
            icon={<CompressOutlined />}
            onClick={handleMinify}
          >
            压缩
          </Button>
        </Space>
        <Editor
          height="300px"
          language={language}
          value={content}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            find: {
              addExtraSpaceOnTop: false,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'never',
            },
          }}
        />
      </div>
    );
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>响应数据</span>
          <Space>
            <Tag color={response.status < 400 ? 'success' : 'error'}>
              {response.status} {response.statusText}
            </Tag>
            <Tag>{response.duration.toFixed(2)} ms</Tag>
            <Tag>{(response.size / 1024).toFixed(2)} KB</Tag>
            <Tag>{response.contentType || '未知类型'}</Tag>
          </Space>
        </div>
      }
      style={{ marginTop: '16px' }}
    >
      <Tabs
        items={[
          {
            key: 'body',
            label: (
              <span>
                <FileTextOutlined />
                响应内容
              </span>
            ),
            children: renderBody(),
          },
          {
            key: 'headers',
            label: (
              <span>
                <SwapOutlined />
                响应头
              </span>
            ),
            children: (
              <Table
                dataSource={Object.entries(response.headers).map(([key, value]) => ({
                  key,
                  name: key,
                  value,
                }))}
                columns={[
                  {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: '30%',
                  },
                  {
                    title: '值',
                    dataIndex: 'value',
                    key: 'value',
                    ellipsis: true,
                  },
                ]}
                pagination={false}
                size="small"
              />
            ),
          },
          {
            key: 'stats',
            label: (
              <span>
                <BarChartOutlined />
                统计分析
              </span>
            ),
            children: <ResponseStats response={response} />,
          },
        ]}
      />
    </Card>
  );
}; 