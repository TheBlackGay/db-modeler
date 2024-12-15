import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, message, Modal, Select } from 'antd';
import { PlusOutlined, CodeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { ColumnsType } from 'antd/es/table';
import { RootState } from '../../store';
import { addField, updateField, deleteField, setCurrentProject } from '../../store/projectsSlice';
import FieldForm from '../FieldForm';
import type { Field } from '../../types/models';
import { SQLGenerator, DatabaseType } from '../../utils/sqlGenerator';

const { Option } = Select;

interface SQLOptions {
  dbType: DatabaseType;
  includeComments: boolean;
  charset: string;
  collate: string;
  engine: 'InnoDB' | 'MyISAM';
  autoIncrement: boolean;
}

const TableDesigner: React.FC = () => {
  const { id: tableId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.projects.items);
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [sqlModalVisible, setSqlModalVisible] = useState(false);
  const [sqlContent, setSqlContent] = useState('');
  const [sqlOptions, setSqlOptions] = useState<SQLOptions>({
    dbType: 'mysql',
    includeComments: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    engine: 'InnoDB',
    autoIncrement: true,
  });

  useEffect(() => {
    if (tableId) {
      // 查找包含该表的项目
      const projectWithTable = projects.find(project => 
        project.tables.some(table => table.id === tableId)
      );

      if (projectWithTable) {
        dispatch(setCurrentProject(projectWithTable.id));
      } else {
        // 如果找不到表，并且 projects 数组不为空（说明数据已加载），则导航到首页
        if (projects.length > 0) {
          message.error('表不存在');
          navigate('/');
        }
      }
    }
  }, [tableId, projects, dispatch, navigate]);

  // 如果 projects 为空，显示加载状态
  if (projects.length === 0) {
    return <div className="p-6">正在加载...</div>;
  }

  const currentTable = currentProject?.tables.find(t => t.id === tableId);

  if (!currentProject || !currentTable) {
    return <div className="p-6">表不存在</div>;
  }

  const handleAddField = () => {
    setEditingField(null);
    setIsModalVisible(true);
  };

  const handleEditField = (record: Field) => {
    setEditingField(record);
    setIsModalVisible(true);
  };

  const handleDeleteField = (record: Field) => {
    if (!currentProject || !tableId) return;

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字段吗？此操作不可恢复。',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch(deleteField({
          projectId: currentProject.id,
          tableId,
          fieldId: record.id,
        }));
        dispatch(setCurrentProject(currentProject.id));
        message.success('字段删除成功');
      },
    });
  };

  const handleFieldSubmit = (values: Omit<Field, 'id'>) => {
    if (!currentProject || !tableId) return;

    if (editingField) {
      dispatch(updateField({
        projectId: currentProject.id,
        tableId,
        fieldId: editingField.id,
        field: values,
      }));
      dispatch(setCurrentProject(currentProject.id));
      message.success('字段更新成功');
    } else {
      dispatch(addField({
        projectId: currentProject.id,
        tableId,
        field: values,
      }));
      dispatch(setCurrentProject(currentProject.id));
      message.success('字段添加成功');
    }
    setIsModalVisible(false);
  };

  const handleExportSQL = () => {
    const sqlGenerator = new SQLGenerator(sqlOptions);
    const sql = sqlGenerator.generateTableSQL(currentTable);
    setSqlContent(sql);
    setSqlModalVisible(true);
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(sqlContent)
      .then(() => message.success('SQL已复制到剪贴板'))
      .catch(() => message.error('复制失败，请手动复制'));
  };

  const columns: ColumnsType<Field> = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '长度',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '允许为空',
      dataIndex: 'nullable',
      key: 'nullable',
      render: (nullable: boolean) => (nullable ? '是' : '否'),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      render: (value: string | null) => value === null ? '(NULL)' : value || '-',
    },
    {
      title: '注释',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditField(record)}>编辑</a>
          <a onClick={() => handleDeleteField(record)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={`表结构设计 - ${currentTable.name}`}
        extra={
          <Space>
            <Button 
              icon={<CodeOutlined />} 
              onClick={handleExportSQL}
            >
              导出SQL
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddField}
            >
              添加字段
            </Button>
          </Space>
        }
      >
        <Table<Field>
          columns={columns}
          dataSource={currentTable.fields}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <FieldForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleFieldSubmit}
        initialValues={editingField}
      />

      <Modal
        title="导出SQL"
        open={sqlModalVisible}
        onCancel={() => setSqlModalVisible(false)}
        footer={[
          <Space key="options">
            <Select
              value={sqlOptions.dbType}
              onChange={(value) => setSqlOptions(prev => ({ ...prev, dbType: value }))}
              style={{ width: 120 }}
            >
              <Option value="mysql">MySQL</Option>
              <Option value="postgresql">PostgreSQL</Option>
            </Select>
            {sqlOptions.dbType === 'mysql' && (
              <>
                <Select
                  value={sqlOptions.engine}
                  onChange={(value) => setSqlOptions(prev => ({ ...prev, engine: value }))}
                  style={{ width: 120 }}
                >
                  <Option value="InnoDB">InnoDB</Option>
                  <Option value="MyISAM">MyISAM</Option>
                </Select>
                <Select
                  value={sqlOptions.charset}
                  onChange={(value) => setSqlOptions(prev => ({ ...prev, charset: value }))}
                  style={{ width: 120 }}
                >
                  <Option value="utf8mb4">utf8mb4</Option>
                  <Option value="utf8">utf8</Option>
                  <Option value="latin1">latin1</Option>
                </Select>
              </>
            )}
            <Button
              type="link"
              onClick={() => setSqlOptions(prev => ({ ...prev, includeComments: !prev.includeComments }))}
            >
              {sqlOptions.includeComments ? '不包含注释' : '包含注释'}
            </Button>
            <Button
              type="link"
              onClick={() => setSqlOptions(prev => ({ ...prev, autoIncrement: !prev.autoIncrement }))}
            >
              {sqlOptions.autoIncrement ? '禁用自增' : '启用自增'}
            </Button>
          </Space>,
          <Button key="copy" type="primary" onClick={handleCopySQL}>
            复制SQL
          </Button>,
        ]}
        width={1000}
      >
        <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
          {sqlContent}
        </pre>
      </Modal>
    </>
  );
};

export default TableDesigner; 