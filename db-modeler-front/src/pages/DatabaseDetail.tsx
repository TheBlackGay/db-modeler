import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message,
  Tag
} from 'antd';
import { 
  DatabaseOutlined, 
  TableOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { databaseService, tableSchemaService } from '@/services/api';

const { Content } = Layout;
const { Option } = Select;

const DatabaseDetail: React.FC = () => {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();
  const [database, setDatabase] = useState<any>(null);
  const [tableSchemas, setTableSchemas] = useState<any[]>([]);
  const [tableSchemaModal, setTableSchemaModal] = useState(false);
  const [editingTableSchema, setEditingTableSchema] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (databaseId) {
      fetchDatabaseDetails();
      fetchTableSchemas();
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

  const fetchTableSchemas = async () => {
    try {
      const data = await tableSchemaService.list(databaseId);
      setTableSchemas(data);
    } catch (error) {
      message.error('获取表结构列表失败');
    }
  };

  const handleCreateTableSchema = () => {
    setEditingTableSchema(null);
    form.resetFields();
    setTableSchemaModal(true);
  };

  const handleEditTableSchema = (record: any) => {
    setEditingTableSchema(record);
    form.setFieldsValue(record);
    setTableSchemaModal(true);
  };

  const handleDeleteTableSchema = async (record: any) => {
    try {
      await tableSchemaService.delete(record.id);
      message.success('删除成功');
      fetchTableSchemas();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleTableSchemaSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        databaseId
      };

      if (editingTableSchema) {
        await tableSchemaService.update(editingTableSchema.id, payload);
      } else {
        await tableSchemaService.create(payload);
      }

      message.success(editingTableSchema ? '更新成功' : '创建成功');
      setTableSchemaModal(false);
      fetchTableSchemas();
    } catch (error) {
      message.error(editingTableSchema ? '更新失败' : '创建失败');
    }
  };

  const handleDesignTableSchema = (record: any) => {
    navigate(`/table-schema-designer/${record.id}`);
  };

  const columns = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '列数',
      dataIndex: 'columns',
      key: 'columns',
      render: (columns: any[]) => columns?.length || 0
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: any) => (
        <div>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditTableSchema(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<TableOutlined />} 
            onClick={() => handleDesignTableSchema(record)}
          >
            设计
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteTableSchema(record)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  if (!database) return null;

  return (
    <Layout>
      <Content style={{ padding: 24 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="数据库类型"
                value={database.type}
                prefix={<DatabaseOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="表结构数量"
                value={tableSchemas.length}
                prefix={<TableOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="数据库状态"
                value={
                  <Tag color="green">活跃</Tag>
                }
              />
            </Card>
          </Col>
        </Row>

        <Card 
          title={`数据库：${database.name}`}
          extra={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleCreateTableSchema}
            >
              创建表结构
            </Button>
          }
        >
          <Table 
            columns={columns} 
            dataSource={tableSchemas} 
            rowKey="id"
          />
        </Card>

        <Modal
          title={editingTableSchema ? '编辑表结构' : '创建表结构'}
          open={tableSchemaModal}
          onCancel={() => setTableSchemaModal(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleTableSchemaSubmit}
          >
            <Form.Item
              name="name"
              label="表名"
              rules={[{ required: true, message: '请输入表名' }]}
            >
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="表结构描述（可选）" />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
              >
                {editingTableSchema ? '更新' : '创建'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default DatabaseDetail;
