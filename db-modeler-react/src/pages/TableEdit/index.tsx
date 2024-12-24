import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Modal, Form, Input, Select, Switch, message, Card, Tooltip, Badge, Tag, Typography, Breadcrumb, Divider, Alert, Statistic } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SaveOutlined,
  RollbackOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  DatabaseOutlined,
  TableOutlined,
  FieldTimeOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { fieldTypes, type IField, type IProject, type ITable } from '../../types';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateProject } from '../../store/projectSlice';
import type { ColumnsType } from 'antd/es/table';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface ProjectContextType {
  project: IProject;
}

const TableEdit: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { project } = useOutletContext<ProjectContextType>();
  const [form] = Form.useForm();

  // 基础状态
  const [tableName, setTableName] = useState('');
  const [tableComment, setTableComment] = useState('');
  const [fields, setFields] = useState<IField[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<IField | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // 加载现有表数据
  useEffect(() => {
    if (project && tableId) {
      const table = project.tables.find(t => t.id === tableId);
      if (table) {
        setTableName(table.name);
        setTableComment(table.comment || '');
        setFields(table.fields || []);
      }
    }
  }, [project, tableId]);

  // 监听变更
  useEffect(() => {
    setHasChanges(true);
  }, [tableName, tableComment, fields]);

  // 保存表格
  const handleSaveTable = () => {
    if (!tableName) {
      message.error('请输入表名');
      return;
    }

    if (!project) {
      message.error('项目不存在');
      return;
    }

    // 验证表名格式
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      message.error('表名只能包含字母、数字和下划线，且必须以字母或下划线开头');
      return;
    }

    // 验证是否有主键
    if (fields.length > 0 && !fields.some(f => f.isPrimaryKey)) {
      Modal.confirm({
        title: '未设置主键',
        content: '当前表没有设置主键，是否继续保存？',
        okText: '继续保存',
        cancelText: '返回修改',
        onOk: () => saveTableData(),
      });
      return;
    }

    saveTableData();
  };

  const saveTableData = () => {
    const now = new Date().toISOString();
    const updatedTable: ITable = {
      id: tableId || uuidv4(),
      name: tableName,
      comment: tableComment,
      fields: fields,
      createdAt: now,
      updatedAt: now,
    };

    const updatedProject = { ...project };
    if (tableId) {
      // 更新现有表
      updatedProject.tables = project.tables.map(t => 
        t.id === tableId ? updatedTable : t
      );
    } else {
      // 创建新表
      updatedProject.tables = [...project.tables, updatedTable];
    }
    updatedProject.updatedAt = now;

    dispatch(updateProject(updatedProject));
    message.success('保存成功');
    setHasChanges(false);
    navigate(`/project/${project.id}`);
  };

  // 保存字段
  const handleSaveField = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();
      
      // 验证字段名是否重复
      const isDuplicateName = fields.some(f => 
        f.name === values.name && f.id !== editingField?.id
      );
      if (isDuplicateName) {
        message.error('字段名已存在');
        return;
      }

      if (editingField) {
        // 更新现有字段
        setFields(fields.map(f => 
          f.id === editingField.id 
            ? { ...f, ...values, updatedAt: now }
            : f
        ));
      } else {
        // 创建新字段
        const newField: IField = {
          id: uuidv4(),
          ...values,
          createdAt: now,
          updatedAt: now,
        };
        setFields([...fields, newField]);
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingField(null);
      message.success(`${editingField ? '更新' : '创建'}字段成功`);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 删除字段
  const handleDeleteField = (fieldId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字段吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        setFields(fields.filter(f => f.id !== fieldId));
        message.success('字段删除成功');
      },
    });
  };

  // 处理离开页面
  const handleLeavePage = () => {
    if (hasChanges) {
      Modal.confirm({
        title: '确认离开',
        content: '您有未保存的更改，确定要离开吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          navigate(`/project/${project.id}`);
        },
      });
    } else {
      navigate(`/project/${project.id}`);
    }
  };

  // 表格列定义
  const columns: ColumnsType<IField> = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record) => (
        <Space>
          {record.isPrimaryKey && <KeyOutlined style={{ color: '#1890ff' }} />}
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string, record) => (
        <Tag color="blue">
          {fieldTypes.find(t => t.value === type)?.label || type}
          {record.length && `(${record.length})`}
        </Tag>
      ),
    },
    {
      title: '属性',
      key: 'attributes',
      width: 200,
      render: (_, record) => (
        <Space size={[0, 4]} wrap>
          {record.isPrimaryKey && <Tag color="blue">主键</Tag>}
          {record.isAutoIncrement && <Tag color="green">自增</Tag>}
          {!record.isNullable && <Tag color="red">非空</Tag>}
          {record.defaultValue && (
            <Tooltip title={`默认值: ${record.defaultValue}`}>
              <Tag color="orange">默认值</Tag>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '注释',
      dataIndex: 'comment',
      key: 'comment',
      width: 200,
      render: (comment: string) => comment && (
        <Tooltip title={comment}>
          <Text ellipsis style={{ maxWidth: 180 }}>{comment}</Text>
        </Tooltip>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (time: string) => (
        <Text type="secondary">
          {new Date(time).toLocaleString()}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑字段">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setEditingField(record);
                form.setFieldsValue(record);
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="删除字段">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteField(record.id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 获取主键字段数量
  const primaryKeyCount = fields.filter(f => f.isPrimaryKey).length;
  // 获取必填字段数量
  const requiredFieldCount = fields.filter(f => !f.isNullable).length;
  // 获取自增字段数量
  const autoIncrementCount = fields.filter(f => f.isAutoIncrement).length;

  const tableInfo = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-blue-50 border-blue-200">
        <Statistic
          title={<Text className="text-blue-600">字段总数</Text>}
          value={fields.length}
          prefix={<DatabaseOutlined className="text-blue-500" />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Card>
      <Card className="bg-green-50 border-green-200">
        <Statistic
          title={<Text className="text-green-600">主键字段</Text>}
          value={primaryKeyCount}
          prefix={<KeyOutlined className="text-green-500" />}
          valueStyle={{ color: '#52c41a' }}
          suffix={`/ ${fields.length}`}
        />
      </Card>
      <Card className="bg-orange-50 border-orange-200">
        <Statistic
          title={<Text className="text-orange-600">必填字段</Text>}
          value={requiredFieldCount}
          prefix={<ExclamationCircleOutlined className="text-orange-500" />}
          valueStyle={{ color: '#fa8c16' }}
          suffix={`/ ${fields.length}`}
        />
      </Card>
      <Card className="bg-purple-50 border-purple-200">
        <Statistic
          title={<Text className="text-purple-600">自增字段</Text>}
          value={autoIncrementCount}
          prefix={<FieldTimeOutlined className="text-purple-500" />}
          valueStyle={{ color: '#722ed1' }}
          suffix={`/ ${fields.length}`}
        />
      </Card>
    </div>
  );

  const validationStatus = (
    <div className="mb-4">
      {fields.length === 0 ? (
        <Alert
          message="表结构未定义"
          description="请添加至少一个字段来定义表结构。"
          type="warning"
          showIcon
        />
      ) : !fields.some(f => f.isPrimaryKey) ? (
        <Alert
          message="未设置主键"
          description="建议为表设置主键字段，以确保数据的唯一性。"
          type="warning"
          showIcon
        />
      ) : (
        <Alert
          message="表结构完整"
          description="已设置主键和必要字段。"
          type="success"
          showIcon
        />
      )}
    </div>
  );

  if (!project) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">项目不存在或已被删除</div>
          <Button type="primary" onClick={() => navigate('/')}>
            返回项目列表
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                <DatabaseOutlined /> 项目列表
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/project/${project.id}`} className="text-blue-600 hover:text-blue-800">
                <TableOutlined /> {project.name}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="text-gray-600">
                {tableId ? '编辑表' : '新建表'}
              </span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card 
          className="mb-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          title={
            <div className="flex items-center space-x-2">
              <TableOutlined className="text-blue-500" />
              <span className="text-lg font-medium">表设计</span>
            </div>
          }
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-8">
              <Input
                size="large"
                placeholder="请输入表名称"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                prefix={<TableOutlined className="text-blue-500" />}
                className="mb-4 hover:border-blue-400 focus:border-blue-500"
                style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                }}
              />
              <Input.TextArea
                placeholder="请输入表注释"
                value={tableComment}
                onChange={(e) => setTableComment(e.target.value)}
                autoSize={{ minRows: 2, maxRows: 6 }}
                className="hover:border-blue-400 focus:border-blue-500"
              />
            </div>
            <Space direction="vertical" align="end">
              <Space>
                <Tooltip title="返回项目">
                  <Button 
                    icon={<RollbackOutlined />}
                    onClick={handleLeavePage}
                    className="hover:bg-gray-100"
                  >
                    返回
                  </Button>
                </Tooltip>
                <Tooltip title="保存表">
                  <Button 
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSaveTable}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    保存
                  </Button>
                </Tooltip>
              </Space>
              {hasChanges && (
                <Text type="warning" className="text-sm">
                  <ExclamationCircleOutlined /> 有未保存的更改
                </Text>
              )}
            </Space>
          </div>

          <Divider className="my-6" />
          
          {validationStatus}
          {tableInfo}
        </Card>

        <Card
          className="shadow-sm hover:shadow-md transition-shadow duration-300"
          title={
            <div className="flex items-center justify-between">
              <Space>
                <DatabaseOutlined className="text-blue-500" />
                <span className="text-lg font-medium">字段列表</span>
                <Badge 
                  count={fields.length} 
                  style={{ 
                    backgroundColor: fields.length > 0 ? '#52c41a' : '#d9d9d9',
                  }} 
                />
              </Space>
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingField(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
                className="bg-blue-500 hover:bg-blue-600"
              >
                新建字段
              </Button>
            </div>
          }
        >
          <Table
            columns={columns}
            dataSource={fields}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1300 }}
            bordered
            rowClassName={(record, index) => 
              classNames(
                'transition-colors duration-300',
                {
                  'bg-blue-50 hover:bg-blue-100': record.isPrimaryKey,
                  'hover:bg-gray-50': !record.isPrimaryKey,
                }
              )
            }
          />
        </Card>

        <Modal
          title={
            <Space className="text-lg">
              {editingField ? (
                <EditOutlined className="text-orange-500" />
              ) : (
                <PlusOutlined className="text-green-500" />
              )}
              {`${editingField ? '编辑' : '新建'}字段`}
            </Space>
          }
          open={isModalVisible}
          onOk={handleSaveField}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingField(null);
          }}
          destroyOnClose
          width={600}
          okText="确认"
          cancelText="取消"
          className="top-8"
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={editingField || {
              isPrimaryKey: false,
              isAutoIncrement: false,
              isNullable: true,
            }}
            className="pt-4"
          >
            <Form.Item
              name="name"
              label={
                <Space>
                  <span>字段名</span>
                  <Tag color="red">必填</Tag>
                </Space>
              }
              rules={[
                { required: true, message: '请输入字段名' },
                { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头' }
              ]}
              tooltip={{
                title: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头',
                icon: <InfoCircleOutlined className="text-blue-500" />
              }}
            >
              <Input 
                placeholder="请输入字段名"
                className="hover:border-blue-400 focus:border-blue-500" 
              />
            </Form.Item>

            <Form.Item
              name="type"
              label={
                <Space>
                  <span>类型</span>
                  <Tag color="red">必填</Tag>
                </Space>
              }
              rules={[{ required: true, message: '请选择字段类型' }]}
              tooltip={{
                title: '选择合适的数据类型',
                icon: <InfoCircleOutlined className="text-blue-500" />
              }}
            >
              <Select
                placeholder="请选择字段类型"
                showSearch
                optionFilterProp="children"
                className="hover:border-blue-400 focus:border-blue-500"
              >
                {fieldTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    <Space>
                      <Tag color="blue">{type.label}</Tag>
                      {type.description && (
                        <Text type="secondary">({type.description})</Text>
                      )}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="length"
                label="长度/精度"
                tooltip={{
                  title: '某些类型需要指定长度或精度',
                  icon: <InfoCircleOutlined className="text-blue-500" />
                }}
              >
                <Input 
                  type="number" 
                  placeholder="请输入字段长度"
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>

              <Form.Item
                name="defaultValue"
                label="默认值"
                tooltip={{
                  title: '设置字段的默认值',
                  icon: <InfoCircleOutlined className="text-blue-500" />
                }}
              >
                <Input 
                  placeholder="请输入默认值"
                  className="hover:border-blue-400 focus:border-blue-500"
                />
              </Form.Item>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Title level={5} className="mb-4 text-gray-700">字段属性</Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="isPrimaryKey"
                  valuePropName="checked"
                  tooltip={{
                    title: '设置为主键',
                    icon: <InfoCircleOutlined className="text-blue-500" />
                  }}
                >
                  <Switch 
                    checkedChildren={<><KeyOutlined /> 主键</>} 
                    unCheckedChildren="主键"
                    className="bg-gray-400"
                  />
                </Form.Item>

                <Form.Item
                  name="isAutoIncrement"
                  valuePropName="checked"
                  tooltip={{
                    title: '设置为自增字段',
                    icon: <InfoCircleOutlined className="text-blue-500" />
                  }}
                >
                  <Switch 
                    checkedChildren="自增" 
                    unCheckedChildren="自增"
                    disabled={!form.getFieldValue('isPrimaryKey')}
                    className="bg-gray-400"
                  />
                </Form.Item>

                <Form.Item
                  name="isNullable"
                  valuePropName="checked"
                  tooltip={{
                    title: '是否允许为空',
                    icon: <InfoCircleOutlined className="text-blue-500" />
                  }}
                >
                  <Switch 
                    checkedChildren="可空" 
                    unCheckedChildren="不可空"
                    disabled={form.getFieldValue('isPrimaryKey')}
                    className="bg-gray-400"
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="comment"
              label="注释"
              tooltip={{
                title: '添加字段说明',
                icon: <InfoCircleOutlined className="text-blue-500" />
              }}
            >
              <Input.TextArea 
                placeholder="请输入字段注释"
                showCount
                maxLength={200}
                rows={4}
                className="hover:border-blue-400 focus:border-blue-500"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export { TableEdit }; 