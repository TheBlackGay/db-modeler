import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, message, Radio, Alert, Table, Progress, Space, Button, Tabs } from 'antd';
import type { Table as TableType, Field } from '../../types/models';
import { parseDDL, parseBatchDDL } from '../../utils/sqlParser';

interface DDLImportModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (table: TableType) => void;
  onBatchImport?: (tables: TableType[]) => void;
}

interface PreviewTable extends TableType {
  status?: 'success' | 'error';
  error?: string;
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
  const [previewTables, setPreviewTables] = useState<PreviewTable[]>([]);
  const [activeTab, setActiveTab] = useState<string>('edit');
  const [importProgress, setImportProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'edit' | 'preview' | 'importing'>('edit');

  // 重置状态
  useEffect(() => {
    if (!visible) {
      setPreviewTables([]);
      setImportProgress(0);
      setCurrentStep('edit');
      setActiveTab('edit');
    }
  }, [visible]);

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      try {
        if (mode === 'single') {
          const table = parseDDL(values.ddl);
          setPreviewTables([{ ...table, status: 'success' }]);
        } else {
          const tables = parseBatchDDL(values.ddl);
          if (tables.length === 0) {
            message.error('未找到有效的 CREATE TABLE 语句');
            return;
          }
          setPreviewTables(tables.map(table => ({ ...table, status: 'success' })));
        }
        setCurrentStep('preview');
        setActiveTab('preview');
      } catch (error) {
        message.error('DDL 解析失败: ' + (error as Error).message);
      }
    } catch (error) {
      // 表单验证失败
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (previewTables.length === 0) {
      message.error('请先预览 DDL');
      return;
    }

    setCurrentStep('importing');
    setImportProgress(0);

    try {
      if (mode === 'single') {
        const table = previewTables[0];
        onImport(table);
        setImportProgress(100);
        message.success('表结构导入成功');
      } else if (onBatchImport) {
        const totalTables = previewTables.length;
        const importedTables: PreviewTable[] = [];
        
        for (let i = 0; i < totalTables; i++) {
          const table = previewTables[i];
          try {
            importedTables.push(table);
            setImportProgress(Math.round(((i + 1) / totalTables) * 100));
            await new Promise(resolve => setTimeout(resolve, 100)); // 给UI更新的时间
          } catch (error) {
            table.status = 'error';
            table.error = (error as Error).message;
          }
        }

        onBatchImport(importedTables);
        message.success(`成功导入 ${importedTables.length} 个表结构`);
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('导入失败: ' + (error as Error).message);
    }
  };

  const previewColumns = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '字段数',
      key: 'fieldCount',
      render: (record: PreviewTable) => record.fields.length,
    },
    {
      title: '引擎',
      dataIndex: 'engine',
      key: 'engine',
    },
    {
      title: '字符集',
      key: 'charset',
      render: (record: PreviewTable) => 
        record.charset && record.collation ? 
        `${record.charset} (${record.collation})` : 
        record.charset || '-',
    },
    {
      title: '自增值',
      key: 'autoIncrement',
      render: (record: PreviewTable) => record.autoIncrement || '-',
    },
    {
      title: '状态',
      key: 'status',
      render: (record: PreviewTable) => (
        <span style={{ color: record.status === 'error' ? '#ff4d4f' : '#52c41a' }}>
          {record.status === 'error' ? '失败' : '成功'}
        </span>
      ),
    },
    {
      title: '错误信息',
      dataIndex: 'error',
      key: 'error',
    },
  ];

  const fieldColumns = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      key: 'type',
      render: (record: Field) => `${record.type}${record.length ? `(${record.length})` : ''}`,
    },
    {
      title: '可空',
      key: 'nullable',
      render: (record: Field) => record.nullable ? '是' : '否',
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
    },
    {
      title: '注释',
      dataIndex: 'comment',
      key: 'comment',
    },
  ];

  const renderTableDetails = (record: PreviewTable) => {
    const details = [
      { label: '表名', value: record.name },
      { label: '注释', value: record.description || '-' },
      { label: '引擎', value: record.engine || '-' },
      { label: '字符集', value: record.charset || '-' },
      { label: '排序规则', value: record.collation || '-' },
      { label: '自增值', value: record.autoIncrement || '-' },
      { label: '行格式', value: record.rowFormat || '-' },
      { label: '表空间', value: record.tableSpace || '-' },
    ];

    return (
      <div style={{ padding: '12px 0' }}>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            {details.map(({ label, value }) => (
              <span key={label}>
                {label}: <strong>{value}</strong>
              </span>
            ))}
          </Space>
        </div>
        <Tabs defaultActiveKey="fields">
          <Tabs.TabPane tab="字段" key="fields">
            <Table
              dataSource={record.fields}
              columns={fieldColumns}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="索引" key="indexes">
            <Table
              dataSource={record.indexes || []}
              columns={[
                {
                  title: '索引名',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                  key: 'type',
                },
                {
                  title: '字段',
                  key: 'fields',
                  render: (record: Index) => record.fields.join(', '),
                },
              ]}
              rowKey="name"
              pagination={false}
              size="small"
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  };

  return (
    <Modal
      title="从 DDL 导入"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="编辑" key="edit">
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

            <Form.Item>
              <Button type="primary" onClick={handlePreview} loading={loading}>
                预览
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="预览" key="preview" disabled={previewTables.length === 0}>
          {currentStep === 'importing' && (
            <div style={{ marginBottom: 16 }}>
              <Progress percent={importProgress} status="active" />
            </div>
          )}

          <Table
            dataSource={previewTables}
            columns={previewColumns}
            rowKey="id"
            expandable={{
              expandedRowRender: renderTableDetails,
            }}
            pagination={false}
          />

          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setActiveTab('edit')}>
                返回编辑
              </Button>
              <Button
                type="primary"
                onClick={handleImport}
                loading={currentStep === 'importing'}
                disabled={previewTables.some(t => t.status === 'error')}
              >
                确认导入
              </Button>
            </Space>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default DDLImportModal; 