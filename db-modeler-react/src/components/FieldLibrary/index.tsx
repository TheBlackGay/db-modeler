import React, { useEffect, useState, useRef } from 'react';
import { Drawer, Input, List, Space, Button, Tag, Typography, Tabs, Select, Empty, Upload, message, Modal, Dropdown, Table, Form, InputNumber, Checkbox, Badge } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusOutlined, EyeOutlined, UploadOutlined, DownloadOutlined, SettingOutlined, EditOutlined, CopyOutlined, RestOutlined } from '@ant-design/icons';
import type { Field, FieldCategory } from '../../types/models';
import { loadFieldLibrary, removeFieldFromLibrary, saveFieldLibrary } from '../../services/storage';
import CategoryManager from '../CategoryManager';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Dragger } = Upload;

// 字段分类定义
const FIELD_CATEGORIES: Record<FieldCategory, string> = {
  basic: '基础字段',
  user: '用户相关',
  time: '时间日期',
  status: '状态标记',
  address: '地址相关',
  system: '系统字段',
  custom: '自定义',
} as const;

interface FieldWithCategory extends Field {
  category: FieldCategory;
}

interface FieldLibraryProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (field: Field) => void;
  existingFields: Field[];
}

const FieldLibrary: React.FC<FieldLibraryProps> = ({
  visible,
  onClose,
  onSelect,
  existingFields,
}) => {
  const [fields, setFields] = useState<FieldWithCategory[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentCategory, setCurrentCategory] = useState<FieldCategory | 'all'>('all');
  const [searchCategory, setSearchCategory] = useState<FieldCategory | 'all'>('all');
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [previewField, setPreviewField] = useState<Field | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    isPrimaryKey: false,
    isAutoIncrement: false,
    unique: false,
    index: false,
    nullable: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCategoryManagerVisible, setIsCategoryManagerVisible] = useState(false);
  const [categories, setCategories] = useState<Record<FieldCategory, string>>(FIELD_CATEGORIES);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [deletedFields, setDeletedFields] = useState<FieldWithCategory[]>([]);
  const [isRecycleBinVisible, setIsRecycleBinVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      loadFields();
    }
  }, [visible]);

  const loadFields = () => {
    const libraryFields = loadFieldLibrary();
    // 为现有字段添加默认分类
    const fieldsWithCategory = libraryFields.map(field => ({
      ...field,
      category: inferFieldCategory(field),
    }));
    setFields(fieldsWithCategory);
  };

  // 根据字段名和类型推断分类
  const inferFieldCategory = (field: Field): FieldCategory => {
    const name = field.name.toLowerCase();
    const type = field.type.toLowerCase();

    if (name.includes('user') || name.includes('account') || name.includes('password')) {
      return 'user';
    }
    if (name.includes('time') || name.includes('date') || type.includes('time') || type.includes('date')) {
      return 'time';
    }
    if (name.includes('status') || name.includes('state') || name.includes('flag')) {
      return 'status';
    }
    if (name.includes('address') || name.includes('city') || name.includes('country')) {
      return 'address';
    }
    if (name.includes('created') || name.includes('updated') || name.includes('deleted')) {
      return 'system';
    }
    if (field.category) {
      return field.category;
    }
    return 'basic';
  };

  const handleDelete = (fieldId: string) => {
    removeFieldFromLibrary(fieldId);
    loadFields();
  };

  const filteredFields = fields.filter(field => {
    const searchLower = searchText.toLowerCase();
    const categoryMatch = currentCategory === 'all' || field.category === currentCategory;
    
    // 基本搜索匹配
    const basicSearchMatch = 
      field.name.toLowerCase().includes(searchLower) ||
      field.type.toLowerCase().includes(searchLower) ||
      field.comment?.toLowerCase().includes(searchLower) ||
      field.defaultValue?.toLowerCase().includes(searchLower);

    // 高级搜索匹配
    const advancedSearchMatch = !advancedSearch || (
      (!searchFilters.isPrimaryKey || field.isPrimaryKey) &&
      (!searchFilters.isAutoIncrement || field.isAutoIncrement) &&
      (!searchFilters.unique || field.unique) &&
      (!searchFilters.index || field.index) &&
      (!searchFilters.nullable || !field.nullable)
    );
    
    return categoryMatch && basicSearchMatch && advancedSearchMatch;
  });

  const renderFieldTags = (field: Field) => {
    const tags = [];

    if (field.isPrimaryKey) {
      tags.push(<Tag key="pk" color="red">主键</Tag>);
    }
    if (field.isAutoIncrement) {
      tags.push(<Tag key="ai" color="orange">自增</Tag>);
    }
    if (field.unique) {
      tags.push(<Tag key="unique" color="green">唯一</Tag>);
    }
    if (field.index) {
      tags.push(<Tag key="index" color="blue">索引</Tag>);
    }
    if (!field.nullable) {
      tags.push(<Tag key="required" color="purple">必填</Tag>);
    }
    if (field.category) {
      tags.push(
        <Tag key="category" color="cyan">
          {FIELD_CATEGORIES[field.category]}
        </Tag>
      );
    }

    return tags;
  };

  // 生成示例数据
  const generateSampleValue = (field: Field) => {
    const type = field.type.toLowerCase();
    switch (type) {
      case 'int':
      case 'bigint':
        return field.isAutoIncrement ? 1 : Math.floor(Math.random() * 1000);
      case 'varchar':
      case 'char':
        if (field.name.toLowerCase().includes('email')) {
          return 'example@email.com';
        }
        if (field.name.toLowerCase().includes('phone')) {
          return '13800138000';
        }
        if (field.name.toLowerCase().includes('name')) {
          return '张三';
        }
        return `示例文本_${Math.random().toString(36).substring(7)}`;
      case 'decimal':
        return (Math.random() * 1000).toFixed(2);
      case 'datetime':
        return new Date().toISOString();
      case 'date':
        return new Date().toISOString().split('T')[0];
      case 'time':
        return new Date().toISOString().split('T')[1].split('.')[0];
      case 'boolean':
        return Math.random() > 0.5;
      case 'text':
        return '这是一段较长的示例文本内容，用于演示字段的文本类型数据。';
      default:
        return null;
    }
  };

  const renderPreviewModal = () => {
    if (!previewField) return null;

    const sampleValue = generateSampleValue(previewField);
    const sqlDefinition = `${previewField.name} ${previewField.type.toUpperCase()}${
      previewField.length ? `(${previewField.length})` : ''
    }${!previewField.nullable ? ' NOT NULL' : ''}${
      previewField.isAutoIncrement ? ' AUTO_INCREMENT' : ''
    }${previewField.defaultValue ? ` DEFAULT ${previewField.defaultValue}` : ''}${
      previewField.isPrimaryKey ? ' PRIMARY KEY' : ''
    }${previewField.unique ? ' UNIQUE' : ''}`;

    return (
      <Modal
        title="字段预览"
        open={!!previewField}
        onCancel={() => setPreviewField(null)}
        footer={null}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={5}>基本信息</Title>
            <Space direction="vertical">
              <div>字段名：{previewField.name}</div>
              <div>类型：{previewField.type}{previewField.length ? `(${previewField.length})` : ''}</div>
              <div>描述：{previewField.comment || '无'}</div>
              <div>默认值：{previewField.defaultValue || '无'}</div>
              <div>
                属性：
                <Space>
                  {renderFieldTags(previewField)}
                </Space>
              </div>
            </Space>
          </div>

          <div>
            <Title level={5}>SQL 定义</Title>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '8px', 
              borderRadius: '4px',
              overflowX: 'auto' 
            }}>
              {sqlDefinition}
            </pre>
          </div>

          <div>
            <Title level={5}>示例数据</Title>
            <div style={{ 
              background: '#f5f5f5', 
              padding: '8px', 
              borderRadius: '4px' 
            }}>
              {sampleValue !== null ? String(sampleValue) : '无示例数据'}
            </div>
          </div>
        </Space>
      </Modal>
    );
  };

  const renderFieldList = (fields: FieldWithCategory[]) => {
    if (fields.length === 0) {
      return <Empty description="没有找到匹配的字段" />;
    }

    const columns = [
      {
        title: '字段名',
        dataIndex: 'name',
        key: 'name',
        width: '45%',
        render: (_: any, record: Field) => (
          <Space wrap size={[0, 4]}>
            <Typography.Text strong>{record.name}</Typography.Text>
            <Tag>{record.type}{record.length ? `(${record.length})` : ''}</Tag>
            {renderFieldTags(record)}
          </Space>
        ),
      },
      {
        title: '描述',
        dataIndex: 'comment',
        key: 'comment',
        width: '40%',
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        width: '15%',
        render: (_: any, record: Field) => (
          <Space size={0}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => setPreviewField(record)}
            />
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditField(record)}
            />
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopyField(record)}
            />
          </Space>
        ),
      },
    ];

    return (
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as string[]),
        }}
        columns={columns}
        dataSource={fields}
        rowKey="id"
        size="middle"
        pagination={false}
        scroll={{ x: 800, y: 'calc(100vh - 300px)' }}
      />
    );
  };

  // 导出字段库
  const handleExport = () => {
    try {
      const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        fields: fields.map(field => ({
          ...field,
          id: undefined, // 导出时不包含 id
          createdAt: undefined,
          updatedAt: undefined,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `field-library-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success('字段库导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('字段库导出失败');
    }
  };

  // 导入字段库
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);
        
        // 验证导入数据格式
        if (!importData.version || !Array.isArray(importData.fields)) {
          throw new Error('无效的导入文件格式');
        }

        // 处理导入的字段
        const now = new Date().toISOString();
        const newFields = importData.fields.map((field: any) => ({
          ...field,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        }));

        // 合并现有字段和新导入的字段
        const mergedFields = [...fields, ...newFields];
        
        // 保存到本地存储
        await saveFieldLibrary(mergedFields);
        
        // 重新加载字段库
        loadFields();
        
        message.success(`成功导入 ${newFields.length} 个字段`);
        setImportModalVisible(false);
      } catch (error) {
        console.error('导入失败:', error);
        message.error('字段库导入失败');
      }
    };
    reader.readAsText(file);
  };

  const renderImportModal = () => (
    <Modal
      title="导入字段库"
      open={importModalVisible}
      onCancel={() => setImportModalVisible(false)}
      footer={null}
    >
      <Dragger
        accept=".json"
        beforeUpload={(file) => {
          handleImport(file);
          return false;
        }}
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域</p>
        <p className="ant-upload-hint">
          支持导入 .json 格式的字段库文件
        </p>
      </Dragger>
    </Modal>
  );

  const renderSearchBar = () => (
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      <Space style={{ width: '100%' }}>
        <Input
          placeholder="搜索字段..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          value={searchCategory}
          onChange={setSearchCategory}
          style={{ width: 120 }}
          options={[
            { label: '全部分类', value: 'all' },
            ...Object.entries(FIELD_CATEGORIES).map(([key, label]) => ({
              label,
              value: key,
            }))
          ]}
        />
        <Button
          type={advancedSearch ? 'primary' : 'default'}
          onClick={() => setAdvancedSearch(!advancedSearch)}
        >
          高级搜索
        </Button>
      </Space>
      
      {advancedSearch && (
        <Space wrap>
          <Button
            type={searchFilters.isPrimaryKey ? 'primary' : 'default'}
            size="small"
            onClick={() => setSearchFilters(prev => ({ ...prev, isPrimaryKey: !prev.isPrimaryKey }))}
          >
            主键
          </Button>
          <Button
            type={searchFilters.isAutoIncrement ? 'primary' : 'default'}
            size="small"
            onClick={() => setSearchFilters(prev => ({ ...prev, isAutoIncrement: !prev.isAutoIncrement }))}
          >
            自增
          </Button>
          <Button
            type={searchFilters.unique ? 'primary' : 'default'}
            size="small"
            onClick={() => setSearchFilters(prev => ({ ...prev, unique: !prev.unique }))}
          >
            唯一
          </Button>
          <Button
            type={searchFilters.index ? 'primary' : 'default'}
            size="small"
            onClick={() => setSearchFilters(prev => ({ ...prev, index: !prev.index }))}
          >
            索引
          </Button>
          <Button
            type={searchFilters.nullable ? 'primary' : 'default'}
            size="small"
            onClick={() => setSearchFilters(prev => ({ ...prev, nullable: !prev.nullable }))}
          >
            必填
          </Button>
        </Space>
      )}
    </Space>
  );

  const handleUpdateCategories = (newCategories: Record<FieldCategory, string>) => {
    setCategories(newCategories);
    // 更新所有字段的分类
    const updatedFields = fields.map(field => {
      if (!newCategories[field.category as FieldCategory]) {
        return { ...field, category: 'basic' as FieldCategory };
      }
      return field;
    });
    saveFieldLibrary(updatedFields);
    setFields(updatedFields);
  };

  const handleBatchCategoryChange = (category: FieldCategory) => {
    Modal.confirm({
      title: '批量修改分类',
      content: `确定要将选中的字段移动到"${categories[category]}"分类吗？`,
      onOk: () => {
        const updatedFields = fields.map(field => {
          if (selectedRowKeys.includes(field.id)) {
            return { ...field, category };
          }
          return field;
        });
        saveFieldLibrary(updatedFields);
        setFields(updatedFields);
        setSelectedRowKeys([]);
        message.success('批量修改分类成功');
      },
    });
  };

  // 检查字段名是否重复
  const checkFieldNameExists = (fieldName: string) => {
    return existingFields.some(f => f.name.toLowerCase() === fieldName.toLowerCase());
  };

  // 处理单个字段添加
  const handleFieldAdd = (field: Field) => {
    if (checkFieldNameExists(field.name)) {
      message.error(`字段名 "${field.name}" 已存在`);
      return;
    }
    onSelect(field);
  };

  // 处理批量添加
  const handleBatchAdd = () => {
    const selectedFields = fields.filter(field => selectedRowKeys.includes(field.id));
    const duplicateFields: string[] = [];
    const validFields: Field[] = [];

    selectedFields.forEach(field => {
      if (checkFieldNameExists(field.name)) {
        duplicateFields.push(field.name);
      } else {
        validFields.push(field);
      }
    });

    // 添加有效字段
    validFields.forEach(field => onSelect(field));

    // 显示结果消息
    if (validFields.length > 0) {
      message.success(`成功添加 ${validFields.length} 个字段`);
    }
    if (duplicateFields.length > 0) {
      message.error(`以下字段名已存在，未添加：${duplicateFields.join(', ')}`);
    }

    // 清空选择
    setSelectedRowKeys([]);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的字段');
      return;
    }

    Modal.confirm({
      title: '删除字段',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个字段吗？`,
      onOk: () => {
        const fieldsToDelete = fields.filter(f => selectedRowKeys.includes(f.id));
        const remainingFields = fields.filter(f => !selectedRowKeys.includes(f.id));
        
        // 添加到回收站
        const now = new Date().toISOString();
        const newDeletedFields = [
          ...fieldsToDelete.map(f => ({ ...f, deletedAt: now })),
          ...deletedFields,
        ].slice(0, 100); // 只保留最近100条

        setDeletedFields(newDeletedFields);
        setFields(remainingFields);
        saveFieldLibrary(remainingFields);
        setSelectedRowKeys([]);
        message.success(`已删除 ${selectedRowKeys.length} 个字段`);
      },
    });
  };

  // 处理字段恢复
  const handleRestore = (fieldIds: string[]) => {
    const fieldsToRestore = deletedFields.filter(f => fieldIds.includes(f.id));
    const remainingDeletedFields = deletedFields.filter(f => !fieldIds.includes(f.id));

    // 检查字段名是否重复
    const duplicateFields = fieldsToRestore.filter(f => 
      fields.some(existing => existing.name === f.name)
    );

    if (duplicateFields.length > 0) {
      message.error(`以下字段名已存在，无法恢复：${duplicateFields.map(f => f.name).join(', ')}`);
      return;
    }

    const now = new Date().toISOString();
    const restoredFields = fieldsToRestore.map(f => ({
      ...f,
      updatedAt: now,
      deletedAt: undefined,
    }));

    setFields([...fields, ...restoredFields]);
    setDeletedFields(remainingDeletedFields);
    saveFieldLibrary([...fields, ...restoredFields]);
    message.success(`已恢复 ${fieldIds.length} 个字段`);
  };

  // 渲染回收站抽屉
  const renderRecycleBin = () => {
    const columns = [
      {
        title: '字段名',
        dataIndex: 'name',
        key: 'name',
        render: (_: any, record: Field) => (
          <Space>
            <span>{record.name}</span>
            <Tag>{record.type}{record.length ? `(${record.length})` : ''}</Tag>
            {renderFieldTags(record)}
          </Space>
        ),
      },
      {
        title: '描述',
        dataIndex: 'comment',
        key: 'comment',
        ellipsis: true,
      },
      {
        title: '删除时间',
        dataIndex: 'deletedAt',
        key: 'deletedAt',
        render: (text: string) => new Date(text).toLocaleString(),
      },
    ];

    return (
      <Drawer
        title="回收站"
        placement="right"
        width={800}
        onClose={() => setIsRecycleBinVisible(false)}
        open={isRecycleBinVisible}
        extra={
          <Button
            type="primary"
            onClick={() => {
              if (selectedRowKeys.length === 0) {
                message.warning('请选择要恢复的字段');
                return;
              }
              handleRestore(selectedRowKeys);
            }}
          >
            恢复选中
          </Button>
        }
      >
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
          }}
          columns={columns}
          dataSource={deletedFields}
          rowKey="id"
          size="middle"
          pagination={false}
        />
      </Drawer>
    );
  };

  const renderToolbar = () => (
    <Space style={{ marginBottom: 16 }}>
      <Button
        icon={<SettingOutlined />}
        onClick={() => setIsCategoryManagerVisible(true)}
      >
        分类管理
      </Button>
      <Button
        icon={<RestOutlined />}
        onClick={() => setIsRecycleBinVisible(true)}
      >
        回收站 {deletedFields.length > 0 && <Badge count={deletedFields.length} />}
      </Button>
      {selectedRowKeys.length > 0 && (
        <>
          <Dropdown
            menu={{
              items: Object.entries(categories).map(([key, name]) => ({
                key,
                label: name,
                onClick: () => handleBatchCategoryChange(key as FieldCategory),
              })),
            }}
          >
            <Button>
              批量修改分类
            </Button>
          </Dropdown>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleBatchAdd}
          >
            批量添加
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>
        </>
      )}
    </Space>
  );

  const handleEditField = (field: Field) => {
    setEditingField(field);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!editingField) return;

    const updatedField = {
      ...editingField,
      ...values,
      updatedAt: new Date().toISOString(),
    };

    const updatedFields = fields.map(f => 
      f.id === editingField.id ? updatedField : f
    );

    await saveFieldLibrary(updatedFields);
    setFields(updatedFields);
    setIsEditModalVisible(false);
    setEditingField(null);
    message.success('字段更新成功');
  };

  // 处理字段复制
  const handleCopyField = (field: Field) => {
    const now = new Date().toISOString();
    const newField: FieldWithCategory = {
      ...field,
      id: crypto.randomUUID(),
      name: `${field.name}_copy`,
      createdAt: now,
      updatedAt: now,
      category: field.category || 'basic',
    };

    const updatedFields = [...fields, newField];
    saveFieldLibrary(updatedFields);
    setFields(updatedFields);
    message.success('字段复制成功');
  };

  // 优化的表单验证规则
  const fieldValidationRules = {
    name: [
      { required: true, message: '请输入字段名' },
      { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头' },
      { max: 64, message: '字段名长度不能超过64个字符' },
    ],
    type: [
      { required: true, message: '请选择字段类型' },
    ],
    length: [
      { type: 'number' as const, min: 1, message: '长度必须大于0' },
      { type: 'number' as const, max: 65535, message: '长度不能超过65535' },
    ],
    precision: [
      { type: 'number' as const, min: 1, message: '精度必须大于0' },
      { type: 'number' as const, max: 65, message: '精度不能超过65' },
    ],
    scale: [
      { type: 'number' as const, min: 0, message: '小数位必须大于等于0' },
      { type: 'number' as const, max: 30, message: '小数位不能超过30' },
    ],
    comment: [
      { max: 500, message: '注释长度不能超过500个字符' },
    ],
    defaultValue: [
      { max: 255, message: '默认值长度不能超过255个字符' },
    ],
    category: [
      { required: true, message: '请选择字段分类' },
    ],
  };

  // 根据字段类型显示相关属性
  const getTypeSpecificFields = (type: string) => {
    const showLength = ['varchar', 'char', 'binary', 'varbinary'].includes(type.toLowerCase());
    const showPrecision = ['decimal', 'numeric', 'float', 'double'].includes(type.toLowerCase());
    const showUnsigned = ['tinyint', 'smallint', 'mediumint', 'int', 'bigint', 'decimal', 'float', 'double'].includes(type.toLowerCase());
    
    return { showLength, showPrecision, showUnsigned };
  };

  const renderEditModal = () => {
    if (!editingField) return null;

    const [form] = Form.useForm();
    const type = Form.useWatch('type', form);
    const { showLength, showPrecision, showUnsigned } = getTypeSpecificFields(type || editingField.type);

    return (
      <Modal
        title="编辑字段"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingField(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={editingField}
          onFinish={handleEditSubmit}
        >
          <Form.Item
            label="字段名"
            name="name"
            rules={fieldValidationRules.name}
            tooltip="字段名必须以字母或下划线开头，只能包含字母、数字和下划线"
          >
            <Input placeholder="请输入字段名" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="type"
            rules={fieldValidationRules.type}
          >
            <Select>
              <Select.OptGroup label="字符串">
                <Select.Option value="varchar">VARCHAR</Select.Option>
                <Select.Option value="char">CHAR</Select.Option>
                <Select.Option value="text">TEXT</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="数值">
                <Select.Option value="int">INT</Select.Option>
                <Select.Option value="bigint">BIGINT</Select.Option>
                <Select.Option value="decimal">DECIMAL</Select.Option>
                <Select.Option value="float">FLOAT</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="日期时间">
                <Select.Option value="datetime">DATETIME</Select.Option>
                <Select.Option value="date">DATE</Select.Option>
                <Select.Option value="time">TIME</Select.Option>
                <Select.Option value="timestamp">TIMESTAMP</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="其他">
                <Select.Option value="boolean">BOOLEAN</Select.Option>
                <Select.Option value="json">JSON</Select.Option>
              </Select.OptGroup>
            </Select>
          </Form.Item>

          {showLength && (
            <Form.Item
              label="长度"
              name="length"
              rules={fieldValidationRules.length}
              tooltip="字符串类型的最大长度"
            >
              <InputNumber min={1} max={65535} placeholder="字段长度" />
            </Form.Item>
          )}

          {showPrecision && (
            <Space>
              <Form.Item
                label="精度"
                name="precision"
                rules={fieldValidationRules.precision}
                tooltip="数字的总位数"
              >
                <InputNumber min={1} max={65} placeholder="总位数" />
              </Form.Item>

              <Form.Item
                label="小数位"
                name="scale"
                rules={fieldValidationRules.scale}
                tooltip="小数点后的位数"
              >
                <InputNumber min={0} max={30} placeholder="小数位数" />
              </Form.Item>
            </Space>
          )}

          <Form.Item
            label="分类"
            name="category"
            rules={fieldValidationRules.category}
          >
            <Select>
              {Object.entries(categories).map(([key, name]) => (
                <Select.Option key={key} value={key}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="注释"
            name="comment"
            rules={fieldValidationRules.comment}
          >
            <Input.TextArea placeholder="请输入字段注释" />
          </Form.Item>

          <Form.Item
            label="默认值"
            name="defaultValue"
            rules={fieldValidationRules.defaultValue}
          >
            <Input placeholder="请输入默认值" />
          </Form.Item>

          <Form.Item name="nullable" valuePropName="checked">
            <Checkbox>允许为空</Checkbox>
          </Form.Item>

          <Form.Item name="isPrimaryKey" valuePropName="checked">
            <Checkbox>主键</Checkbox>
          </Form.Item>

          <Form.Item name="isAutoIncrement" valuePropName="checked">
            <Checkbox>自增</Checkbox>
          </Form.Item>

          <Form.Item name="unique" valuePropName="checked">
            <Checkbox>唯一</Checkbox>
          </Form.Item>

          <Form.Item name="index" valuePropName="checked">
            <Checkbox>索引</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setEditingField(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <Drawer
      title="字段库"
      placement="right"
      width={1000}
      onClose={onClose}
      open={visible}
      bodyStyle={{ padding: '12px' }}
      extra={
        <Space>
          <Button
            icon={<UploadOutlined />}
            onClick={() => setImportModalVisible(true)}
          >
            导入
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {renderToolbar()}
        {renderSearchBar()}
        <Tabs
          activeKey={currentCategory}
          onChange={key => setCurrentCategory(key as FieldCategory | 'all')}
          type="card"
          size="small"
          items={[
            {
              key: 'all',
              label: '全部',
              children: renderFieldList(filteredFields),
            },
            ...Object.entries(categories).map(([key, label]) => ({
              key,
              label,
              children: renderFieldList(
                filteredFields.filter(f => f.category === key)
              ),
            }))
          ]}
        />
      </Space>
      {renderImportModal()}
      {renderPreviewModal()}
      {renderEditModal()}
      {renderRecycleBin()}
      <CategoryManager
        visible={isCategoryManagerVisible}
        onClose={() => setIsCategoryManagerVisible(false)}
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
      />
    </Drawer>
  );
};

export default FieldLibrary; 