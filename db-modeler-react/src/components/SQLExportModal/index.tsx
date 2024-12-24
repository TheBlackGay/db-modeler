import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Switch, Input, Space, Button, message, Tabs, Radio, Progress } from 'antd';
import type { Table } from '../../types/models';
import { generateSQLScript, generateBatchSQLScript } from '../../utils/sqlGenerator';
import { builtinTemplates, type SQLTemplate, renderTemplate } from '../../features/sql/templates';
import TemplateManager from '../../features/sql/components/TemplateManager';

interface SQLExportModalProps {
  visible: boolean;
  onCancel: () => void;
  table: Table;
  tables?: Table[]; // 可选的表列表，用于批量导出
}

const { TabPane } = Tabs;

const SQLExportModal: React.FC<SQLExportModalProps> = ({
  visible,
  onCancel,
  table,
  tables,
}) => {
  const [form] = Form.useForm();
  const [sqlScript, setSqlScript] = useState<string>('');
  const [exportMode, setExportMode] = useState<'single' | 'batch'>('single');
  const [templateMode, setTemplateMode] = useState<'builtin' | 'custom'>('builtin');
  const [selectedTemplate, setSelectedTemplate] = useState<SQLTemplate | null>(null);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [templateManagerVisible, setTemplateManagerVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      // 重置状态
      setSqlScript('');
      setExportMode('single');
      setTemplateMode('builtin');
      setSelectedTemplate(null);
      setSelectedTables([]);
      setProgress(0);
      
      // 设置默认模板
      const defaultTemplate = builtinTemplates.find(t => t.dialect === form.getFieldValue('dialect'));
      if (defaultTemplate) {
        setSelectedTemplate(defaultTemplate);
      }
    }
  }, [visible, form]);

  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();
      setGenerating(true);
      setProgress(0);

      if (templateMode === 'builtin') {
        if (exportMode === 'single') {
          // 单表导出
          const script = generateSQLScript(table, values);
          setSqlScript(script);
          setProgress(100);
        } else {
          // 批量导出
          const selectedTableObjects = tables?.filter(t => selectedTables.includes(t.id)) || [];
          if (selectedTableObjects.length === 0) {
            message.error('请选择要导出的表');
            return;
          }

          // 分批处理大量表
          const batchSize = 10;
          let processedTables: Table[] = [];
          
          for (let i = 0; i < selectedTableObjects.length; i += batchSize) {
            const batch = selectedTableObjects.slice(i, i + batchSize);
            processedTables = [...processedTables, ...batch];
            const script = generateBatchSQLScript(processedTables, values);
            setSqlScript(script);
            
            // 更新进度
            const progress = Math.round((processedTables.length / selectedTableObjects.length) * 100);
            setProgress(progress);
            
            // 给UI一个更新的机会
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
      } else {
        if (!selectedTemplate) {
          message.error('请选择一个模板');
          return;
        }
        
        const script = renderTemplate(selectedTemplate, table, values);
        setSqlScript(script);
        setProgress(100);
      }
    } catch (error) {
      message.error('生成失败：' + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript).then(() => {
      message.success('SQL已复制到剪贴板');
    });
  };

  const handleDownload = () => {
    const blob = new Blob([sqlScript], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exportMode === 'single' 
      ? `${table.name}_${new Date().toISOString().split('T')[0]}.sql`
      : `tables_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Modal
        title="导出SQL"
        open={visible}
        onCancel={onCancel}
        width={800}
        footer={[
          <Space key="actions">
            <Button onClick={() => setTemplateManagerVisible(true)}>
              模板管理
            </Button>
            <Button onClick={onCancel}>
              关闭
            </Button>
            <Button 
              type="primary" 
              onClick={handleGenerate}
              loading={generating}
              disabled={exportMode === 'batch' && selectedTables.length === 0}
            >
              生成SQL
            </Button>
          </Space>,
        ]}
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本设置" key="basic">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                dialect: 'mysql',
                version: '8.0',
                includeDropTable: true,
                includeIfNotExists: true,
                includeComments: true,
                includeAutoIncrement: true,
                includeCharset: true,
                charset: 'utf8mb4',
                collation: 'utf8mb4_unicode_ci',
              }}
            >
              <Form.Item label="导出模式">
                <Radio.Group 
                  value={exportMode} 
                  onChange={e => setExportMode(e.target.value)}
                  disabled={templateMode === 'custom'}
                >
                  <Radio.Button value="single">单表导出</Radio.Button>
                  <Radio.Button value="batch" disabled={!tables?.length}>批量导出</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {exportMode === 'batch' && (
                <Form.Item label="选择要导出的表">
                  <Select
                    mode="multiple"
                    placeholder="请选择要导出的表"
                    value={selectedTables}
                    onChange={setSelectedTables}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {tables?.map(t => (
                      <Select.Option key={t.id} value={t.id}>
                        {t.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item label="模板模式">
                <Radio.Group value={templateMode} onChange={e => setTemplateMode(e.target.value)}>
                  <Radio.Button value="builtin">内置模板</Radio.Button>
                  <Radio.Button value="custom">自定义模板</Radio.Button>
                </Radio.Group>
              </Form.Item>

              {templateMode === 'custom' && (
                <Form.Item label="选择模板">
                  <Select
                    placeholder="请选择模板"
                    value={selectedTemplate?.id}
                    onChange={id => setSelectedTemplate(builtinTemplates.find(t => t.id === id) || null)}
                    showSearch
                    optionFilterProp="children"
                  >
                    {builtinTemplates.map(template => (
                      <Select.Option key={template.id} value={template.id}>
                        {template.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                label="数据库类型"
                name="dialect"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="mysql">MySQL</Select.Option>
                  <Select.Option value="postgresql">PostgreSQL</Select.Option>
                  <Select.Option value="sqlite">SQLite</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="版本"
                name="version"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="8.0">MySQL 8.0</Select.Option>
                  <Select.Option value="5.7">MySQL 5.7</Select.Option>
                  <Select.Option value="5.6">MySQL 5.6</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="字符集"
                name="charset"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="utf8mb4">utf8mb4</Select.Option>
                  <Select.Option value="utf8">utf8</Select.Option>
                  <Select.Option value="latin1">latin1</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="排序规则"
                name="collation"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</Select.Option>
                  <Select.Option value="utf8mb4_general_ci">utf8mb4_general_ci</Select.Option>
                  <Select.Option value="utf8_general_ci">utf8_general_ci</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="包含DROP TABLE语句"
                name="includeDropTable"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="包含IF NOT EXISTS"
                name="includeIfNotExists"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="包含注释"
                name="includeComments"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="包含AUTO_INCREMENT"
                name="includeAutoIncrement"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="包含字符集设置"
                name="includeCharset"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </TabPane>

          {templateMode === 'custom' && selectedTemplate && (
            <TabPane tab="模板变量" key="variables">
              <Form layout="vertical">
                {selectedTemplate.variables.map(variable => (
                  <Form.Item
                    key={variable.name}
                    label={`${variable.name} (${variable.description})`}
                    name={['variables', variable.name]}
                    initialValue={variable.defaultValue}
                  >
                    <Input />
                  </Form.Item>
                ))}
              </Form>
            </TabPane>
          )}
        </Tabs>

        {generating && (
          <div style={{ marginTop: 16 }}>
            <Progress percent={progress} status="active" />
          </div>
        )}

        {sqlScript && (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <h4>生成的SQL脚本</h4>
              <Space>
                <Button onClick={handleCopy}>复制</Button>
                <Button type="primary" onClick={handleDownload}>下载</Button>
              </Space>
            </div>
            <Input.TextArea
              value={sqlScript}
              autoSize={{ minRows: 10, maxRows: 20 }}
              readOnly
            />
          </div>
        )}
      </Modal>

      <TemplateManager
        visible={templateManagerVisible}
        onCancel={() => setTemplateManagerVisible(false)}
      />
    </>
  );
};

export default SQLExportModal; 