import React, { useState } from 'react';
import { Modal, Input, Form, message, Radio, Alert } from 'antd';
import type { Table } from '../../types/models';
import { parseDDL, parseBatchDDL } from '../../utils/sqlParser';

interface DDLImportModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (table: Table) => void;
  onBatchImport?: (tables: Table[]) => void;
}

const DDLImportModal: React.FC<DDLImportModalProps> = ({
  visible,
  onCancel,
  onImport,
  onBatchImport,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'single' | 'batch'>('single');

  const handleImport = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      try {
        if (mode === 'single') {
          const table = parseDDL(values.ddl);
          onImport(table);
          message.success('表结构导入成功');
        } else {
          const tables = parseBatchDDL(values.ddl);
          if (tables.length === 0) {
            message.error('未找到有效的 CREATE TABLE 语句');
            return;
          }
          if (onBatchImport) {
            onBatchImport(tables);
            message.success(`成功导入 ${tables.length} 个表结构`);
          } else {
            message.warning('当前模式不支持批量导入');
            return;
          }
        }
        form.resetFields();
        onCancel();
      } catch (error) {
        message.error('DDL 解析失败: ' + (error as Error).message);
      }
    } catch (error) {
      // 表单验证失败
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="从 DDL 导入"
      open={visible}
      onCancel={onCancel}
      onOk={handleImport}
      okText="导入"
      cancelText="取消"
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item>
          <Radio.Group value={mode} onChange={e => setMode(e.target.value)}>
            <Radio.Button value="single">单表导入</Radio.Button>
            <Radio.Button value="batch">批量导入</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {mode === 'batch' && !onBatchImport && (
          <Form.Item>
            <Alert
              type="warning"
              message="当前模式不支持批量导入"
              description="请在项目详情页面使用批量导入功能"
              showIcon
            />
          </Form.Item>
        )}

        <Form.Item
          name="ddl"
          label="DDL 语句"
          rules={[{ required: true, message: '请输入 DDL 语句' }]}
          extra={mode === 'single' ? 
            "请输入单个 CREATE TABLE 语句，支持字段定义、索引定义、表注释等" :
            "请输入多个 CREATE TABLE 语句，每个语句以分号结尾"}
        >
          <Input.TextArea
            placeholder={mode === 'single' ? 
`例如：
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  email VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username),
  KEY idx_email (email)
) COMMENT='用户表';` :
`例如：
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
) COMMENT='用户表';

CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id)
) COMMENT='订单表';`}
            autoSize={{ minRows: 10, maxRows: 20 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DDLImportModal; 