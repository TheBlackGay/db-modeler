import React, { useState } from 'react';
import { Modal, Form, Select, Switch, Input, Space, Button, message } from 'antd';
import type { Table } from '../../types/models';
import { generateSQLScript } from '../../utils/sqlGenerator';

interface SQLExportModalProps {
  visible: boolean;
  onCancel: () => void;
  table: Table;
}

const SQLExportModal: React.FC<SQLExportModalProps> = ({
  visible,
  onCancel,
  table,
}) => {
  const [form] = Form.useForm();
  const [sqlScript, setSqlScript] = useState<string>('');

  const handleGenerate = () => {
    form.validateFields().then((values) => {
      const script = generateSQLScript(table, values);
      setSqlScript(script);
    });
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
    link.download = `${table.name}_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal
      title="导出SQL"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          关闭
        </Button>,
        <Button key="generate" type="primary" onClick={handleGenerate}>
          生成SQL
        </Button>,
      ]}
    >
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
  );
};

export default SQLExportModal; 