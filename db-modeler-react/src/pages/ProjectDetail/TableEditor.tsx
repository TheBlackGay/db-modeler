import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Table, Space, Modal, message, Form, Input, Layout } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, ImportOutlined, PlusOutlined, TableOutlined } from '@ant-design/icons';
import type { Project, Table as TableType } from '../../types/models';
import { updateProject } from '../../store/projectsSlice';
import FieldEditor from './FieldEditor';
import { useNavigate } from 'react-router-dom';
import DDLImportModal from '../../components/DDLImportModal';
import { generateId } from '../../utils/helpers';

const { Sider, Content } = Layout;

interface TableEditorProps {
  project: Project;
}

const TableEditor: React.FC<TableEditorProps> = ({ project }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showDDLImportModal, setShowDDLImportModal] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);

  const handleEdit = (table: TableType) => {
    navigate(`/project/${project.id}/tables/${table.id}`);
  };

  const handleDelete = (tableId: string) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个表吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedProject = {
          ...project,
          tables: project.tables.filter(t => t.id !== tableId),
          updatedAt: new Date().toISOString(),
        };
        dispatch(updateProject(updatedProject));
        message.success('表删除成功');
      },
    });
  };

  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个表吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const updatedProject = {
          ...project,
          tables: project.tables.filter(t => !selectedRowKeys.includes(t.id)),
          updatedAt: new Date().toISOString(),
        };
        dispatch(updateProject(updatedProject));
        setSelectedRowKeys([]);
        message.success(`成功删除 ${selectedRowKeys.length} 个表`);
      },
    });
  };

  const handleBatchDDLImport = (tables: TableType[]) => {
    const now = new Date().toISOString();
    const updatedProject = {
      ...project,
      tables: [...project.tables, ...tables],
      updatedAt: now,
    };
    dispatch(updateProject(updatedProject));
    message.success(`成功导入 ${tables.length} 个表`);
  };

  const handleTableFormSubmit = (values: any) => {
    const now = new Date().toISOString();
    const newTable: TableType = {
      id: generateId(),
      name: values.name,
      description: values.description || '',
      fields: [],
      createdAt: now,
      updatedAt: now,
    };

    const updatedProject = {
      ...project,
      tables: [...project.tables, newTable],
      updatedAt: now,
    };

    dispatch(updateProject(updatedProject));
    setShowTableForm(false);
    message.success('表创建成功');
    navigate(`/project/${project.id}/tables/${newTable.id}`);
  };

  const validateTableName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('请输入表名');
    }
    // 表名规范：只能包含字母、数字和下划线，必须以字母开头，长度在1-64之间
    const tableNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/;
    if (!tableNamePattern.test(value)) {
      return Promise.reject('表名只能包含字母、数字和下划线，必须以字母开头，长度在1-64之间');
    }
    // 检查表名是否已存在
    if (project?.tables.some(t => t.name.toLowerCase() === value.toLowerCase())) {
      return Promise.reject('表名已存在');
    }
    return Promise.resolve();
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TableType) => (
        <a onClick={() => handleEdit(record)}>{text}</a>
      ),
      sorter: (a: TableType, b: TableType) => a.name.localeCompare(b.name),
      filterSearch: true,
      onFilter: (value: any, record: TableType) => 
        record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      filterSearch: true,
      onFilter: (value: any, record: TableType) => 
        record.description?.toLowerCase().includes(String(value).toLowerCase()) || false,
    },
    {
      title: '字段数',
      key: 'fieldCount',
      render: (_: any, record: TableType) => record.fields?.length || 0,
      sorter: (a: TableType, b: TableType) => (a.fields?.length || 0) - (b.fields?.length || 0),
    },
    {
      title: '索引数',
      key: 'indexCount',
      render: (_: any, record: TableType) => record.indexes?.length || 0,
      sorter: (a: TableType, b: TableType) => (a.indexes?.length || 0) - (b.indexes?.length || 0),
    },
    {
      title: '引擎',
      dataIndex: 'engine',
      key: 'engine',
      filters: [
        { text: 'InnoDB', value: 'InnoDB' },
        { text: 'MyISAM', value: 'MyISAM' },
      ],
      onFilter: (value: any, record: TableType) => record.engine === value,
    },
    {
      title: '字符集',
      key: 'charset',
      render: (_: any, record: TableType) => 
        record.charset && record.collation ? 
        `${record.charset} (${record.collation})` : 
        record.charset || '-',
      filters: [
        { text: 'utf8mb4', value: 'utf8mb4' },
        { text: 'utf8', value: 'utf8' },
      ],
      onFilter: (value: any, record: TableType) => record.charset === value,
    },
    {
      title: '创建时间',
      key: 'createdAt',
      render: (_: any, record: TableType) => new Date(record.createdAt).toLocaleString(),
      sorter: (a: TableType, b: TableType) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TableType) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ background: '#fff', minHeight: 'calc(100vh - 200px)' }}>
      <Content style={{ padding: '0 24px' }}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowTableForm(true)}
            >
              新建表
            </Button>
            <Button 
              type="primary" 
              icon={<ImportOutlined />}
              onClick={() => setShowDDLImportModal(true)}
            >
              从 DDL 导入
            </Button>
            {selectedRowKeys.length > 0 && (
              <>
                <span>已选择 {selectedRowKeys.length} 个表</span>
                <Button danger onClick={handleBatchDelete}>
                  批量删除
                </Button>
              </>
            )}
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={project.tables}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个表`,
          }}
        />

        <FieldEditor
          visible={editorVisible}
          table={selectedTable}
          onCancel={() => setEditorVisible(false)}
          project={project}
        />

        <DDLImportModal
          visible={showDDLImportModal}
          onCancel={() => setShowDDLImportModal(false)}
          onImport={() => {}}
          onBatchImport={handleBatchDDLImport}
        />

        <Modal
          title="新建表"
          open={showTableForm}
          onCancel={() => setShowTableForm(false)}
          onOk={() => {
            const form = document.querySelector('form');
            if (form) {
              form.requestSubmit();
            }
          }}
        >
          <Form onFinish={handleTableFormSubmit}>
            <Form.Item
              name="name"
              label="表名"
              rules={[
                { required: true, message: '请输入表名' },
                { validator: validateTableName }
              ]}
            >
              <Input placeholder="请输入表名，只能包含字母、数字和下划线，必须以字母开头" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="请输入表描述" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default TableEditor; 