import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, message, Modal, Select, Dropdown } from 'antd';
import { PlusOutlined, CodeOutlined, MenuOutlined, SortAscendingOutlined, CopyOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { ColumnsType } from 'antd/es/table';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RootState } from '../../store';
import { addField, updateField, deleteField, setCurrentProject, reorderFields } from '../../store/projectsSlice';
import FieldForm from '../FieldForm';
import type { Field } from '../../types/models';
import { SQLGenerator, DatabaseType } from '../../utils/sqlGenerator';
import FieldTemplateSelect from '../FieldTemplateSelect';
import type { FieldTemplate } from '../../types/models';

const { Option } = Select;

interface SQLOptions {
  dbType: DatabaseType;
  includeComments: boolean;
  charset: string;
  collate: string;
  engine: 'InnoDB' | 'MyISAM';
  autoIncrement: boolean;
}

// 可拖拽的表格行组件
const DraggableRow = ({ children, ...props }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 9999 } : {}),
    cursor: 'move',
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as any)?.key === 'sort') {
          return React.cloneElement(child as any, {
            children: (
              <MenuOutlined
                className="text-gray-400 cursor-move"
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

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
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);

  // 设置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (tableId) {
      const projectWithTable = projects.find(project => 
        project.tables.some(table => table.id === tableId)
      );

      if (projectWithTable) {
        dispatch(setCurrentProject(projectWithTable.id));
      } else {
        if (projects.length > 0) {
          message.error('表不存在');
          navigate('/');
        }
      }
    }
  }, [tableId, projects, dispatch, navigate]);

  if (projects.length === 0) {
    return <div className="p-6">正在加载...</div>;
  }

  const currentTable = currentProject?.tables.find(t => t.id === tableId);

  if (!currentProject || !currentTable) {
    return <div className="p-6">表不存在</div>;
  }

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = currentTable.fields.findIndex(field => field.id === active.id);
      const newIndex = currentTable.fields.findIndex(field => field.id === over.id);
      
      dispatch(reorderFields({
        projectId: currentProject.id,
        tableId: currentTable.id,
        oldIndex,
        newIndex,
      }));
      dispatch(setCurrentProject(currentProject.id));
    }
  };

  // 处理排序方式变更
  const handleSortTypeChange = (type: 'custom' | 'name' | 'type') => {
    if (type === 'name') {
      const sortedFields = [...currentTable.fields].sort((a, b) => a.name.localeCompare(b.name));
      dispatch(reorderFields({
        projectId: currentProject.id,
        tableId: currentTable.id,
        fields: sortedFields,
      }));
    } else if (type === 'type') {
      const sortedFields = [...currentTable.fields].sort((a, b) => a.type.localeCompare(b.type));
      dispatch(reorderFields({
        projectId: currentProject.id,
        tableId: currentTable.id,
        fields: sortedFields,
      }));
    }
  };

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

  // 处理字段复制
  const handleCopyField = (record: Field) => {
    if (!currentProject || !tableId) return;

    const newField: Omit<Field, 'id'> = {
      ...record,
      name: `${record.name}_copy`,
      comment: record.comment ? `${record.comment} (复制)` : undefined,
    };

    // 删除 id 属性，让 Redux 生成新的 id
    delete (newField as any).id;

    dispatch(addField({
      projectId: currentProject.id,
      tableId,
      field: newField,
    }));
    dispatch(setCurrentProject(currentProject.id));
    message.success('字段复制成功');
  };

  // 处理多字段复制
  const handleBatchCopy = () => {
    if (!currentProject || !tableId || selectedFields.length === 0) return;

    const newFields = selectedFields.map(field => {
      const newField = {
        ...field,
        name: `${field.name}_copy`,
        comment: field.comment ? `${field.comment} (复制)` : undefined,
      };
      // 删除 id 属性，让 Redux 生成新的 id
      delete (newField as any).id;
      return newField;
    });

    newFields.forEach(field => {
      dispatch(addField({
        projectId: currentProject.id,
        tableId,
        field,
      }));
    });

    dispatch(setCurrentProject(currentProject.id));
    message.success(`成功复制 ${selectedFields.length} 个字段`);
    setSelectedFields([]);
  };

  // 处理表格选择变化
  const handleSelectionChange = (_: React.Key[], selectedRows: Field[]) => {
    setSelectedFields(selectedRows);
  };

  // 处理从模板创建字段
  const handleTemplateSelect = (template: FieldTemplate) => {
    if (!currentProject || !tableId) return;

    // 生成字段名
    let baseName = template.name.toLowerCase().replace(/\s+/g, '_');
    let fieldName = baseName;
    let counter = 1;

    // 检查字段名是否已存在
    while (currentTable.fields.some(f => f.name === fieldName)) {
      fieldName = `${baseName}_${counter}`;
      counter++;
    }

    // 创建新字段
    const newField: Omit<Field, 'id'> = {
      name: fieldName,
      type: template.type,
      length: template.length,
      nullable: template.nullable,
      defaultValue: template.defaultValue,
      comment: template.description,
      isPrimaryKey: template.isPrimaryKey,
      isAutoIncrement: template.isAutoIncrement,
    };

    dispatch(addField({
      projectId: currentProject.id,
      tableId,
      field: newField,
    }));
    dispatch(setCurrentProject(currentProject.id));
    message.success('字段创建成功');
  };

  const columns: ColumnsType<Field> = [
    {
      key: 'sort',
      width: 30,
      render: () => <MenuOutlined className="text-gray-400" />,
    },
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
          <a onClick={() => handleCopyField(record)}>复制</a>
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
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'custom',
                    label: '自定义排序',
                    onClick: () => handleSortTypeChange('custom'),
                  },
                  {
                    key: 'name',
                    label: '按字段名排序',
                    onClick: () => handleSortTypeChange('name'),
                  },
                  {
                    key: 'type',
                    label: '按类型排序',
                    onClick: () => handleSortTypeChange('type'),
                  },
                ],
              }}
              trigger={['click']}
            >
              <Button icon={<SortAscendingOutlined />}>排序方式</Button>
            </Dropdown>
            {selectedFields.length > 0 && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleBatchCopy}
              >
                复制所选字段
              </Button>
            )}
            <Button 
              icon={<CodeOutlined />} 
              onClick={handleExportSQL}
            >
              导出SQL
            </Button>
            <Button
              icon={<AppstoreAddOutlined />}
              onClick={() => setTemplateModalVisible(true)}
            >
              从模板创建
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentTable.fields.map(f => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table<Field>
              columns={columns}
              dataSource={currentTable.fields}
              rowKey={record => record.id}
              pagination={false}
              components={{
                body: {
                  row: DraggableRow,
                },
              }}
              rowSelection={{
                type: 'checkbox',
                onChange: handleSelectionChange,
                selectedRowKeys: selectedFields.map(f => f.id),
                getCheckboxProps: (record) => ({
                  id: record.id,
                }),
              }}
            />
          </SortableContext>
        </DndContext>
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

      <FieldTemplateSelect
        visible={templateModalVisible}
        onCancel={() => setTemplateModalVisible(false)}
        onSelect={handleTemplateSelect}
      />
    </>
  );
};

export default TableDesigner; 