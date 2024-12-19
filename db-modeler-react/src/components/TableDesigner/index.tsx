import React, { useCallback, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Space, Table, Tooltip, Modal, Select } from 'antd';
import { DeleteOutlined, EditOutlined, ExportOutlined, MenuOutlined, CopyOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import type { Table as TableType, Field, FieldTemplate } from '../../types/models';
import { updateTable, setCurrentProject } from '../../store/projectsSlice';
import { generateId } from '../../utils/helpers';
import { RootState } from '../../store';
import FieldForm from '../FieldForm';
import SQLExportModal from '../SQLExportModal';
import FieldLibrary from '../FieldLibrary';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import BatchEditForm from '../BatchEditForm';
import TemplateManager from '../TemplateManager';

interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}: DraggableBodyRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: 'row',
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: { index: number }) => {
      moveRow(item.index, index);
    },
  });

  const [, drag] = useDrag({
    type: 'row',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const TableDesigner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  
  // 从 Redux store 中选择数据
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);
  const projects = useSelector((state: RootState) => state.projects.items);
  
  // 使用 useMemo 计算派生状态
  const { table, projectId } = useMemo(() => {
    // 如果没有 currentProject，尝试从 URL 中的表 ID 找到对应的项目
    if (!currentProject) {
      for (const project of projects) {
        const table = project.tables.find(t => t.id === id);
        if (table) {
          // 找到表所属的项目，自动设置为当前项目
          dispatch(setCurrentProject(project.id));
          return {
            table,
            projectId: project.id
          };
        }
      }
    }
    
    // 如果有 currentProject，按原来的逻辑查找
    if (currentProject) {
      const table = currentProject.tables.find(t => t.id === id);
      return {
        table,
        projectId: currentProject.id
      };
    }
    
    return { table: null, projectId: null };
  }, [currentProject, projects, id, dispatch]);

  const [editingField, setEditingField] = useState<Field | undefined>();
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showSQLModal, setShowSQLModal] = useState(false);
  const [showFieldLibrary, setShowFieldLibrary] = useState(false);
  const [showBatchEditForm, setShowBatchEditForm] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showCopyFieldsModal, setShowCopyFieldsModal] = useState(false);
  const [targetTableId, setTargetTableId] = useState<string>('');

  if (!table || !projectId) {
    return <div>表格不存在</div>;
  }

  const handleFieldSubmit = useCallback((values: Partial<Field>) => {
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
    };

    const updatedTable = {
      ...table,
      fields: [...table.fields],
      updatedAt: new Date().toISOString(),
    };

    if (editingField) {
      const index = updatedTable.fields.findIndex(f => f.id === editingField.id);
      if (index !== -1) {
        updatedTable.fields[index] = fieldData;
      }
    } else {
      updatedTable.fields.push(fieldData);
    }

    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowFieldForm(false);
    setEditingField(undefined);
  }, [dispatch, editingField, projectId, table]);

  const handleDeleteField = useCallback((fieldId: string) => {
    const updatedTable = {
      ...table,
      fields: table.fields.filter(f => f.id !== fieldId),
    };
    dispatch(updateTable({ projectId, tableId: table.id, data: updatedTable }));
  }, [dispatch, projectId, table]);

  const handleEditField = useCallback((field: Field) => {
    setEditingField(field);
    setShowFieldForm(true);
  }, []);

  const handleAddField = useCallback(() => {
    setEditingField(undefined);
    setShowFieldForm(true);
  }, []);

  const handleFieldLibrarySelect = useCallback((field: Field) => {
    const updatedTable = {
      ...table,
      fields: [...table.fields, { ...field, id: generateId() }],
    };
    dispatch(updateTable({ projectId, tableId: table.id, data: updatedTable }));
    setShowFieldLibrary(false);
  }, [dispatch, projectId, table]);

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const updatedTable = {
        ...table,
        fields: update(table.fields, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, table.fields[dragIndex]],
          ],
        }),
      };
      
      dispatch(updateTable({ 
        projectId, 
        tableId: table.id, 
        data: updatedTable 
      }));
    },
    [dispatch, projectId, table]
  );

  const handleBatchEdit = (values: Partial<Field>) => {
    const updatedTable = {
      ...table,
      fields: table.fields.map(field => 
        selectedRowKeys.includes(field.id) 
          ? { ...field, ...values }
          : field
      ),
    };
    
    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowBatchEditForm(false);
    setSelectedRowKeys([]);
  };

  const handleBatchDelete = () => {
    const updatedTable = {
      ...table,
      fields: table.fields.filter(field => !selectedRowKeys.includes(field.id)),
    };
    
    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setSelectedRowKeys([]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns = [
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
  ];

  const components = {
    body: {
      row: (props: any) => <DraggableBodyRow {...props} moveRow={moveRow} />,
    },
  };

  const handleTemplateSelect = (template: FieldTemplate) => {
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
    };

    const updatedTable = {
      ...table,
      fields: [...table.fields, fieldData],
    };

    dispatch(updateTable({ 
      projectId, 
      tableId: table.id, 
      data: updatedTable 
    }));
    setShowTemplateManager(false);
  };

  // 获取当前项目中的其他表
  const otherTables = useMemo(() => {
    if (!currentProject) return [];
    return currentProject.tables.filter(t => t.id !== table.id);
  }, [currentProject, table.id]);

  const handleCopyFields = () => {
    if (!targetTableId || selectedRowKeys.length === 0) return;

    const targetTable = currentProject?.tables.find(t => t.id === targetTableId);
    if (!targetTable) return;

    const selectedFields = table.fields.filter(f => selectedRowKeys.includes(f.id));
    const newFields = selectedFields.map(field => ({
      ...field,
      id: generateId(),
    }));

    const updatedTable = {
      ...targetTable,
      fields: [...targetTable.fields, ...newFields],
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
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          components={components}
          rowSelection={rowSelection}
          columns={[
            {
              title: '',
              dataIndex: 'sort',
              width: 30,
              className: 'drag-visible',
              render: () => <MenuOutlined style={{ cursor: 'move', color: '#999' }} />,
            },
            ...columns,
          ]}
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
    </DndProvider>
  );
};

export default TableDesigner; 