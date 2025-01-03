import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Space, Table, Tooltip, Modal, Select, message, Spin, Result } from 'antd';
import { DeleteOutlined, EditOutlined, ExportOutlined, MenuOutlined, CopyOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { Table as TableType, Field, FieldTemplate, Project } from '../../types/models';
import { updateTable, setCurrentProject, loadProjects } from '../../store/projectsSlice';
import { generateId } from '../../utils/helpers';
import { RootState } from '../../store';
import FieldForm from '../FieldForm';
import SQLExportModal from '../SQLExportModal';
import FieldLibrary from '../FieldLibrary';
import BatchEditForm from '../BatchEditForm';
import TemplateManager from '../../features/sql/components/TemplateManager';

const PROJECTS_STORAGE_KEY = 'db_modeler_projects';

const loadProjectsFromStorage = (): Project[] => {
  try {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  } catch (error) {
    console.error('加载项目失败:', error);
    return [];
  }
};

const TableDesigner: React.FC = () => {
  const { projectId, tableId } = useParams<{ projectId: string; tableId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const currentProject = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );

  const table = currentProject?.tables.find(t => t.id === tableId);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId || !tableId) {
        setError('项目或表 ID 无效');
        setLoading(false);
        return;
      }

      if (!currentProject && !initialized) {
        try {
          const projects = loadProjectsFromStorage();
          if (projects.length > 0) {
            dispatch(loadProjects(projects));
            const foundProject = projects.find(p => p.id === projectId);
            if (foundProject) {
              dispatch(setCurrentProject(foundProject));
              const foundTable = foundProject.tables.find(t => t.id === tableId);
              if (!foundTable) {
                setError('表不存在');
              }
            } else {
              setError('项目不存在');
            }
          } else {
            setError('没有找到任何项目');
          }
        } catch (err) {
          setError('加载项目时出错');
          console.error('加载项目失败:', err);
        }
        setInitialized(true);
      }
      setLoading(false);
    };

    loadProject();
  }, [dispatch, projectId, tableId, currentProject, initialized]);

  // 等待 Redux store 更新完成
  useEffect(() => {
    if (initialized && !loading) {
      if (!currentProject) {
        setError('项目不存在');
      } else if (!table) {
        setError('表不存在');
      }
    }
  }, [initialized, loading, currentProject, table]);

  const [editingField, setEditingField] = useState<Field | undefined>();
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showSQLModal, setShowSQLModal] = useState(false);
  const [showFieldLibrary, setShowFieldLibrary] = useState(false);
  const [showBatchEditForm, setShowBatchEditForm] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showCopyFieldsModal, setShowCopyFieldsModal] = useState(false);
  const [targetTableId, setTargetTableId] = useState<string>('');

  const handleFieldSubmit = useCallback((values: Partial<Field>) => {
    if (!table || !projectId) return;

    const now = new Date().toISOString();
    const fieldData: Field = {
      id: editingField?.id || generateId(),
      name: values.name || '',
      type: values.type || 'VARCHAR',
      length: values.length,
      nullable: values.nullable ?? true,
      defaultValue: values.defaultValue || '',
      comment: values.comment || '',
      isPrimaryKey: values.isPrimaryKey ?? false,
      isAutoIncrement: values.isAutoIncrement ?? false,
      unique: values.unique ?? false,
      index: values.index ?? false,
      unsigned: values.unsigned ?? false,
      zerofill: values.zerofill ?? false,
      createdAt: editingField?.createdAt || now,
      updatedAt: now,
    };

    const updatedTable = {
      ...table,
      fields: editingField
        ? table.fields.map(f => (f.id === editingField.id ? fieldData : f))
        : [...table.fields, fieldData],
      updatedAt: now,
    };

    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowFieldForm(false);
    setEditingField(undefined);
  }, [dispatch, editingField, projectId, table]);

  const handleAddField = useCallback(() => {
    setEditingField(undefined);
    setShowFieldForm(true);
  }, []);

  const handleEditField = useCallback((field: Field) => {
    setEditingField(field);
    setShowFieldForm(true);
  }, []);

  const handleDeleteField = useCallback((fieldId: string) => {
    if (!table || !projectId) return;

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字段吗？',
      onOk: () => {
        const updatedTable = {
          ...table,
          fields: table.fields.filter(f => f.id !== fieldId),
          updatedAt: new Date().toISOString(),
        };
        dispatch(updateTable({ 
          projectId, 
          tableId: table.id, 
          data: updatedTable 
        }));
      },
    });
  }, [dispatch, projectId, table]);

  const handleFieldLibrarySelect = useCallback((field: Field) => {
    if (!table || !projectId) return;

    const now = new Date().toISOString();
    const fieldData: Field = {
      ...field,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedTable = {
      ...table,
      fields: [...table.fields, fieldData],
      updatedAt: now,
    };

    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowFieldLibrary(false);
  }, [dispatch, projectId, table]);

  const handleBatchEdit = useCallback((values: Partial<Field>) => {
    if (!table || !projectId) return;

    const now = new Date().toISOString();
    const updatedTable = {
      ...table,
      fields: table.fields.map(field => 
        selectedRowKeys.includes(field.id) 
          ? { ...field, ...values, updatedAt: now }
          : field
      ),
      updatedAt: now,
    };
    
    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowBatchEditForm(false);
    setSelectedRowKeys([]);
  }, [dispatch, projectId, selectedRowKeys, table]);

  const handleBatchDelete = useCallback(() => {
    if (!table || !projectId) return;

    Modal.confirm({
      title: '确认批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个字段吗？`,
      onOk: () => {
        const updatedTable = {
          ...table,
          fields: table.fields.filter(field => !selectedRowKeys.includes(field.id)),
          updatedAt: new Date().toISOString(),
        };
        
        dispatch(updateTable({ 
          projectId, 
          tableId: table.id, 
          data: updatedTable 
        }));
        setSelectedRowKeys([]);
      },
    });
  }, [dispatch, projectId, selectedRowKeys, table]);

  const handleTemplateSelect = useCallback((template: FieldTemplate) => {
    if (!table || !projectId) return;

    const now = new Date().toISOString();
    const fieldData: Field = {
      id: generateId(),
      name: template.name,
      type: template.type,
      length: template.length,
      nullable: template.nullable,
      defaultValue: template.defaultValue,
      comment: template.description,
      isPrimaryKey: template.isPrimaryKey,
      isAutoIncrement: template.isAutoIncrement,
      unique: template.unique,
      index: template.index,
      unsigned: template.unsigned,
      zerofill: template.zerofill,
      createdAt: now,
      updatedAt: now,
    };

    const updatedTable = {
      ...table,
      fields: [...table.fields, fieldData],
      updatedAt: now,
    };

    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowTemplateManager(false);
  }, [dispatch, projectId, table]);

  const handleCopyFields = useCallback(() => {
    if (!targetTableId || selectedRowKeys.length === 0 || !currentProject || !projectId) return;

    const targetTable = currentProject?.tables.find(t => t.id === targetTableId);
    if (!targetTable) return;

    const now = new Date().toISOString();
    const selectedFields = table?.fields.filter(f => selectedRowKeys.includes(f.id)) || [];
    const newFields = selectedFields.map(field => ({
      ...field,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }));

    const updatedTable = {
      ...targetTable,
      fields: [...targetTable.fields, ...newFields],
      updatedAt: now,
    };

    dispatch(updateTable({
      projectId,
      tableId: targetTableId,
      data: updatedTable,
    }));

    setShowCopyFieldsModal(false);
    setTargetTableId('');
    setSelectedRowKeys([]);
    message.success('字段已复制到目标表');
  }, [currentProject, dispatch, projectId, selectedRowKeys, table, targetTableId]);

  const otherTables = useMemo(() => {
    if (!currentProject || !table) return [];
    return currentProject.tables.filter(t => t.id !== table.id);
  }, [currentProject, table]);

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  }), [selectedRowKeys]);

  const columns = useMemo(() => [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      sorter: (a: Field, b: Field) => a.name.localeCompare(b.name),
      filterSearch: true,
      onFilter: (value: any, record: Field) => record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string, record: Field) => (
        <span>{type}{record.length ? `(${record.length})` : ''}</span>
      ),
      filters: [
        { text: 'INT', value: 'INT' },
        { text: 'VARCHAR', value: 'VARCHAR' },
        { text: 'TEXT', value: 'TEXT' },
        { text: 'DATETIME', value: 'DATETIME' },
        { text: 'DECIMAL', value: 'DECIMAL' },
      ],
      onFilter: (value: any, record: Field) => record.type === value,
    },
    {
      title: '允许空值',
      dataIndex: 'nullable',
      key: 'nullable',
      width: 100,
      render: (nullable: boolean) => (nullable ? '是' : '否'),
      filters: [
        { text: '是', value: 'true' },
        { text: '否', value: 'false' },
      ],
      onFilter: (value: any, record: Field) => record.nullable === (value === 'true'),
    },
    {
      title: '主键',
      dataIndex: 'isPrimaryKey',
      key: 'isPrimaryKey',
      width: 80,
      render: (isPrimaryKey: boolean) => (isPrimaryKey ? '是' : '否'),
      filters: [
        { text: '是', value: 'true' },
        { text: '否', value: 'false' },
      ],
      onFilter: (value: any, record: Field) => record.isPrimaryKey === (value === 'true'),
      sorter: (a: Field, b: Field) => Number(a.isPrimaryKey) - Number(b.isPrimaryKey),
    },
    {
      title: '自增',
      dataIndex: 'isAutoIncrement',
      key: 'isAutoIncrement',
      width: 80,
      render: (isAutoIncrement: boolean) => (isAutoIncrement ? '是' : '否'),
      filters: [
        { text: '是', value: 'true' },
        { text: '否', value: 'false' },
      ],
      onFilter: (value: any, record: Field) => record.isAutoIncrement === (value === 'true'),
    },
    {
      title: '唯一',
      dataIndex: 'unique',
      key: 'unique',
      width: 80,
      render: (unique: boolean) => (unique ? '是' : '否'),
      filters: [
        { text: '是', value: 'true' },
        { text: '否', value: 'false' },
      ],
      onFilter: (value: any, record: Field) => record.unique === (value === 'true'),
    },
    {
      title: '索引',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (index: boolean) => (index ? '是' : '否'),
      filters: [
        { text: '是', value: 'true' },
        { text: '否', value: 'false' },
      ],
      onFilter: (value: any, record: Field) => record.index === (value === 'true'),
    },
    {
      title: '无符号',
      dataIndex: 'unsigned',
      key: 'unsigned',
      width: 80,
      render: (unsigned: boolean) => (unsigned ? '是' : '否'),
      filters: [
        { text: '是', value: 'true' },
        { text: '否', value: 'false' },
      ],
      onFilter: (value: any, record: Field) => record.unsigned === (value === 'true'),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 120,
      sorter: (a: Field, b: Field) => (a.defaultValue || '').localeCompare(b.defaultValue || ''),
    },
    {
      title: '注释',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      filterSearch: true,
      onFilter: (value: any, record: Field) => 
        record.comment?.toLowerCase().includes(String(value).toLowerCase()) || false,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Field) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditField(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteField(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ], [handleEditField, handleDeleteField]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="加载表格中..." />
      </div>
    );
  }

  if (error || !table || !projectId || !currentProject) {
    return (
      <Result
        status="404"
        title="表格不存在"
        subTitle={error || '请确认项目和表 ID 是否正确'}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 16 }}>表结构设计 - {table.name}</h2>
        <Space>
          <Button type="primary" onClick={handleAddField}>
            添加字段
          </Button>
          <Button onClick={() => setShowFieldLibrary(true)}>
            从字段库添加
          </Button>
          <Button onClick={() => setShowTemplateManager(true)}>
            从模板添加
          </Button>
          <Button onClick={() => setShowSQLModal(true)} icon={<ExportOutlined />}>
            导出SQL
          </Button>
          {selectedRowKeys.length > 0 && (
            <>
              <Button onClick={() => setShowBatchEditForm(true)}>
                批量编辑
              </Button>
              <Button danger onClick={handleBatchDelete}>
                批量删除
              </Button>
              <Button 
                icon={<CopyOutlined />}
                onClick={() => setShowCopyFieldsModal(true)}
              >
                复制到其他表
              </Button>
            </>
          )}
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={table.fields}
        rowKey="id"
        size="middle"
        pagination={false}
        bordered
        scroll={{ x: 1500 }}
      />

      <FieldForm
        visible={showFieldForm}
        onCancel={() => setShowFieldForm(false)}
        initialValues={editingField}
        onSubmit={handleFieldSubmit}
      />

      <SQLExportModal
        visible={showSQLModal}
        onCancel={() => setShowSQLModal(false)}
        table={table}
      />

      <FieldLibrary
        visible={showFieldLibrary}
        onCancel={() => setShowFieldLibrary(false)}
        onSelect={handleFieldLibrarySelect}
      />

      <BatchEditForm
        visible={showBatchEditForm}
        onCancel={() => setShowBatchEditForm(false)}
        onSubmit={handleBatchEdit}
        selectedCount={selectedRowKeys.length}
      />

      <TemplateManager
        visible={showTemplateManager}
        onCancel={() => setShowTemplateManager(false)}
        onSelect={handleTemplateSelect}
      />

      <Modal
        title="复制字段到其他表"
        open={showCopyFieldsModal}
        onCancel={() => {
          setShowCopyFieldsModal(false);
          setTargetTableId('');
        }}
        onOk={handleCopyFields}
        okButtonProps={{ disabled: !targetTableId }}
      >
        <div style={{ marginBottom: 16 }}>
          已选择 {selectedRowKeys.length} 个字段
        </div>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择目标表"
          value={targetTableId}
          onChange={setTargetTableId}
        >
          {otherTables.map(t => (
            <Select.Option key={t.id} value={t.id}>
              {t.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default TableDesigner; 