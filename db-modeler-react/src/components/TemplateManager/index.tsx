import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Button, Space, List, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { FieldTemplate, FieldTemplateCategory } from '../../types/models';
import {
  loadFieldTemplates,
  loadTemplateCategories,
  addFieldTemplate,
  updateFieldTemplate,
  deleteFieldTemplate,
  addTemplateCategory,
  updateTemplateCategory,
  deleteTemplateCategory,
} from '../../services/storage';
import TemplateForm from './TemplateForm';
import CategoryForm from './CategoryForm';

interface TemplateManagerProps {
  visible: boolean;
  onCancel: () => void;
  onSelect?: (template: FieldTemplate) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState<FieldTemplate[]>([]);
  const [categories, setCategories] = useState<FieldTemplateCategory[]>([]);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FieldTemplate | undefined>();
  const [editingCategory, setEditingCategory] = useState<FieldTemplateCategory | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setTemplates(loadFieldTemplates());
      setCategories(loadTemplateCategories());
    }
  }, [visible]);

  const handleTemplateSubmit = (values: Partial<FieldTemplate>) => {
    if (editingTemplate) {
      updateFieldTemplate(editingTemplate.id, values);
      message.success('模板已更新');
    } else {
      addFieldTemplate(values as FieldTemplate);
      message.success('模板已添加');
    }
    setTemplates(loadFieldTemplates());
    setShowTemplateForm(false);
    setEditingTemplate(undefined);
  };

  const handleCategorySubmit = (values: Partial<FieldTemplateCategory>) => {
    if (editingCategory) {
      updateTemplateCategory(editingCategory.id, values);
      message.success('分类已更新');
    } else {
      addTemplateCategory(values as FieldTemplateCategory);
      message.success('分类已添加');
    }
    setCategories(loadTemplateCategories());
    setShowCategoryForm(false);
    setEditingCategory(undefined);
  };

  const handleDeleteTemplate = (id: string) => {
    deleteFieldTemplate(id);
    setTemplates(loadFieldTemplates());
    message.success('模板已删除');
  };

  const handleDeleteCategory = (id: string) => {
    deleteTemplateCategory(id);
    setCategories(loadTemplateCategories());
    message.success('分类已删除');
  };

  const categoryTemplates = templates.filter(t => t.category === selectedCategory);

  const items = [
    {
      key: 'templates',
      label: '字段模板',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setEditingTemplate(undefined);
                  setShowTemplateForm(true);
                }}
              >
                添加模板
              </Button>
              {categories.length > 0 && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: 200 }}
                >
                  <option value="">全部分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </Space>
          </div>

          <List
            dataSource={selectedCategory ? categoryTemplates : templates}
            renderItem={(template) => (
              <List.Item
                actions={[
                  <Button
                    key="select"
                    type="link"
                    onClick={() => onSelect?.(template)}
                  >
                    选择
                  </Button>,
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowTemplateForm(true);
                    }}
                  />,
                  <Popconfirm
                    key="delete"
                    title="确定要删除这个模板吗？"
                    onConfirm={() => handleDeleteTemplate(template.id)}
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={template.isBuiltin}
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={template.name}
                  description={template.description}
                />
                <div>
                  {template.type}
                  {template.length && `(${template.length})`}
                </div>
              </List.Item>
            )}
          />
        </div>
      ),
    },
    {
      key: 'categories',
      label: '模板分类',
      children: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              onClick={() => {
                setEditingCategory(undefined);
                setShowCategoryForm(true);
              }}
            >
              添加分类
            </Button>
          </div>

          <List
            dataSource={categories}
            renderItem={(category) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryForm(true);
                    }}
                    disabled={category.isBuiltin}
                  />,
                  <Popconfirm
                    key="delete"
                    title="确定要删除这个分类吗？"
                    onConfirm={() => handleDeleteCategory(category.id)}
                  >
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={category.isBuiltin}
                    />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={category.name}
                  description={category.description}
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="模板管理"
        open={visible}
        onCancel={onCancel}
        width={800}
        footer={null}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
        />
      </Modal>

      <TemplateForm
        visible={showTemplateForm}
        onCancel={() => {
          setShowTemplateForm(false);
          setEditingTemplate(undefined);
        }}
        initialValues={editingTemplate}
        onSubmit={handleTemplateSubmit}
        categories={categories}
      />

      <CategoryForm
        visible={showCategoryForm}
        onCancel={() => {
          setShowCategoryForm(false);
          setEditingCategory(undefined);
        }}
        initialValues={editingCategory}
        onSubmit={handleCategorySubmit}
      />
    </>
  );
};

export default TemplateManager; 