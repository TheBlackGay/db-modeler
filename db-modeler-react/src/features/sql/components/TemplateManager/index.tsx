import React, { useState } from 'react';
import { Modal, Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import type { FieldTemplate } from '../../../../types/models';
import { useTemplates } from '../../hooks/useTemplates';
import TemplateEditor from './TemplateEditor';
import TemplatePreview from './TemplatePreview';

interface TemplateManagerProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (template: FieldTemplate) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  const {
    templates,
    categories,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTemplates();

  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FieldTemplate | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<FieldTemplate | null>(null);

  const handleEdit = (template: FieldTemplate) => {
    setSelectedTemplate(template);
    setEditorVisible(true);
  };

  const handlePreview = (template: FieldTemplate) => {
    setPreviewTemplate(template);
    setPreviewVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    message.success('模板删除成功');
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setEditorVisible(true);
  };

  const handleEditorCancel = () => {
    setEditorVisible(false);
    setSelectedTemplate(null);
  };

  const handleSave = (template: FieldTemplate) => {
    const now = new Date().toISOString();

    if (selectedTemplate) {
      updateTemplate({
        ...selectedTemplate,
        ...template,
        updatedAt: now,
      });
      message.success('模板更新成功');
    } else {
      addTemplate({
        ...template,
        id: uuidv4(),
        isBuiltin: false,
        createdAt: now,
        updatedAt: now,
      });
      message.success('模板创建成功');
    }
    setEditorVisible(false);
    setSelectedTemplate(null);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FieldTemplate) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            预览
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {!record.isBuiltin && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              删除
            </Button>
          )}
          <Button
            type="link"
            onClick={() => {
              onSelect(record);
              onCancel();
            }}
          >
            使用
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="模板管理"
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Space key="actions">
          <Button onClick={handleCreate}>新建模板</Button>
          <Button onClick={onCancel}>关闭</Button>
        </Space>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={templates}
        rowKey="id"
        pagination={false}
      />
      <TemplateEditor
        visible={editorVisible}
        template={selectedTemplate}
        categories={categories}
        onCancel={handleEditorCancel}
        onSave={handleSave}
      />
      <TemplatePreview
        visible={previewVisible}
        template={previewTemplate}
        onCancel={() => setPreviewVisible(false)}
      />
    </Modal>
  );
};

export default TemplateManager; 