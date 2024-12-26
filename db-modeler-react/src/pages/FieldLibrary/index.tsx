import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, Space, Tag, Input, Tree, Modal, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined, ImportOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { RootState } from '../../store';
import { StandardField, StandardFieldCategory } from '../../types/models';
import FieldForm from './FieldForm';
import CategoryForm from './CategoryForm';

const { Search } = Input;

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 16px;
  border-right: 1px solid #f0f0f0;
`;

const Content = styled.div`
  flex: 1;
  padding: 16px;
`;

const Header = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FieldLibrary: React.FC = () => {
  const dispatch = useDispatch();
  const { fields, categories, loading } = useSelector((state: RootState) => state.standardFields);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingField, setEditingField] = useState<StandardField | null>(null);
  const [editingCategory, setEditingCategory] = useState<StandardFieldCategory | null>(null);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const columns = [
    {
      title: '字段名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '中文名称',
      dataIndex: 'alias',
      key: 'alias',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'green'}>
          {required ? '必填' : '可选'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: StandardField) => (
        <Space size="middle">
          <Tooltip title="复制字段">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleCopyField(record)}
            />
          </Tooltip>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingField(record);
              setShowFieldForm(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteField(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleAddField = () => {
    setEditingField(null);
    setShowFieldForm(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };

  const handleDeleteField = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字段吗？',
      onOk: () => {
        // dispatch(deleteField(id));
      },
    });
  };

  const handleCopyField = (field: StandardField) => {
    const { id, createdAt, updatedAt, ...fieldData } = field;
    navigator.clipboard.writeText(JSON.stringify(fieldData, null, 2))
      .then(() => message.success('字段已复制到剪贴板'))
      .catch(() => message.error('复制失败'));
  };

  const handleBatchAddFields = () => {
    Modal.confirm({
      title: '批量添加字段',
      content: '确定要将选中的字段添加到当前表吗？',
      onOk: () => {
        // TODO: 实现批量添加字段的逻辑
        message.success(`已添加 ${selectedFields.length} 个字段`);
        setSelectedFields([]);
      },
    });
  };

  const filteredFields = fields.filter(field => {
    const matchesSearch = searchText
      ? field.name.toLowerCase().includes(searchText.toLowerCase()) ||
        field.alias.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesCategory = selectedCategory
      ? field.categoryId === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container>
      <Sidebar>
        <Header>
          <h3>字段分类</h3>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={handleAddCategory}
          />
        </Header>
        <Tree
          treeData={categories.map(cat => ({
            key: cat.id,
            title: cat.name,
            children: categories
              .filter(child => child.parentId === cat.id)
              .map(child => ({
                key: child.id,
                title: child.name,
              })),
          }))}
          onSelect={([key]) => setSelectedCategory(key?.toString() || null)}
        />
      </Sidebar>
      <Content>
        <Header>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Search
              placeholder="搜索字段"
              allowClear
              style={{ width: 300 }}
              onChange={e => setSearchText(e.target.value)}
            />
            {selectedFields.length > 0 && (
              <Button
                type="primary"
                icon={<ImportOutlined />}
                onClick={handleBatchAddFields}
              >
                添加到表 ({selectedFields.length})
              </Button>
            )}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddField}
          >
            添加字段
          </Button>
        </Header>
        <Table
          columns={columns}
          dataSource={filteredFields}
          loading={loading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedFields,
            onChange: (selectedRowKeys) => setSelectedFields(selectedRowKeys as string[]),
          }}
        />
      </Content>

      {showFieldForm && (
        <FieldForm
          field={editingField}
          visible={showFieldForm}
          onClose={() => {
            setShowFieldForm(false);
            setEditingField(null);
          }}
          categories={categories}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          visible={showCategoryForm}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          categories={categories}
        />
      )}
    </Container>
  );
};

export default FieldLibrary; 