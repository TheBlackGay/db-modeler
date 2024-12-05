import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  message,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CodeOutlined 
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { tableSchemaService, databaseService } from '@/services/api';

const { Content } = Layout;
const { Option } = Select;

interface TableColumn {
  key: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
}

const TableSchemaDesigner: React.FC = () => {
  const { databaseId } = useParams<{ databaseId: string }>();
  const [database, setDatabase] = useState<any>(null);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [columnModal, setColumnModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState<TableColumn | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (databaseId) {
      fetchDatabaseDetails();
    }
  }, [databaseId]);

  const fetchDatabaseDetails = async () => {
    try {
      const data = await databaseService.get(databaseId!);
      setDatabase(data);
    } catch (error) {
      message.error('获取数据库详情失败');
    }
  };

  const handleAddColumn = () => {
    setEditingColumn(null);
    form.resetFields();
    setColumnModal(true);
  };

  const handleEditColumn = (record: TableColumn) => {
    setEditingColumn(record);
    form.setFieldsValue(record);
    setColumnModal(true);
  };

  const handleDeleteColumn = (record: TableColumn) => {
    setColumns(columns.filter(col => col.key !== record.key));
  };

  const handleColumnSubmit = (values: TableColumn) => {
    const newColumn: TableColumn = {
      ...values,
      key: editingColumn ? editingColumn.key : `col_${Date.now()}`
    };

    if (editingColumn) {
      // 更新现有列
      setColumns(columns.map(col => 
        col.key === editingColumn.key ? newColumn : col
      ));
    } else {
      // 添加新列
      setColumns([...columns, newColumn]);
    }

    setColumnModal(false);
    form.resetFields();
  };

  const handleGenerateSQL = async () => {
    try {
      const tableSchema = {
        databaseId,
        name: database.name + '_table',
        columns: columns.map(col => ({
          name: col.name,
          type: col.type,
          nullable: col.nullable,
          primaryKey: col.primaryKey,
          unique: col.unique
        }))
      };

      const response = await tableSchemaService.create(tableSchema);
      const sqlScript = await tableSchemaService.generateSQL(response.id);
      
      Modal.info({
        title: 'SQL 脚本',
        content: (
          <pre style={{ 
            maxHeight: 400, 
            overflowY: 'auto', 
            backgroundColor: '#f4f4f4', 
            padding: 10 
          }}>
            {sqlScript.sql}
          </pre>
        ),
        width: 600
      });
    } catch (error) {
      message.error('生成SQL脚本失败');
    }
  };

  const tableColumns = [
    {
      title: '列名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '可空',
      dataIndex: 'nullable',
      key: 'nullable',
      render: (nullable: boolean) => nullable ? '是' : '否'
    },
    {
      title: '主键',
      dataIndex: 'primaryKey',
      key: 'primaryKey',
      render: (primaryKey: boolean) => primaryKey ? '是' : '否'
    },
    {
      title: '唯一',
      dataIndex: 'unique',
      key: 'unique',
      render: (unique: boolean) => unique ? '是' : '否'
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: TableColumn) => (
        <Space>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditColumn(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteColumn(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Layout>
      <Content style={{ padding: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: 16 
        }}>
          <h2>表结构设计：{database?.name}</h2>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddColumn}
            >
              添加列
            </Button>
            <Button 
              icon={<CodeOutlined />} 
              onClick={handleGenerateSQL}
              disabled={columns.length === 0}
            >
              生成SQL
            </Button>
          </Space>
        </div>

        <Table 
          columns={tableColumns} 
          dataSource={columns} 
          rowKey="key"
          pagination={false}
        />

        <Modal
          title={editingColumn ? '编辑列' : '添加列'}
          open={columnModal}
          onCancel={() => setColumnModal(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleColumnSubmit}
          >
            <Form.Item
              name="name"
              label="列名"
              rules={[{ required: true, message: '请输入列名' }]}
            >
              <Input placeholder="请输入列名" />
            </Form.Item>
            <Form.Item
              name="type"
              label="数据类型"
              rules={[{ required: true, message: '请选择数据类型' }]}
            >
              <Select placeholder="选择数据类型">
                <Option value="INT">整数 (INT)</Option>
                <Option value="VARCHAR(255)">可变字符串 (VARCHAR)</Option>
                <Option value="TEXT">长文本 (TEXT)</Option>
                <Option value="DATETIME">日期时间 (DATETIME)</Option>
                <Option value="BOOLEAN">布尔值 (BOOLEAN)</Option>
                <Option value="DECIMAL(10,2)">小数 (DECIMAL)</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="nullable"
              label="是否可空"
              initialValue={true}
            >
              <Select>
                <Option value={true}>可空</Option>
                <Option value={false}>不可空</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="primaryKey"
              label="是否主键"
              initialValue={false}
            >
              <Select>
                <Option value={false}>否</Option>
                <Option value={true}>是</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="unique"
              label="是否唯一"
              initialValue={false}
            >
              <Select>
                <Option value={false}>否</Option>
                <Option value={true}>是</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
              >
                {editingColumn ? '更新' : '添加'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default TableSchemaDesigner;
