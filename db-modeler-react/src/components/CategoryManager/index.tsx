import React, { useState } from 'react';
import { Modal, Form, Input, Space, Button, Table, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { FieldCategory } from '../../types/models';

interface CategoryManagerProps {
  visible: boolean;
  onClose: () => void;
  categories: Record<FieldCategory, string>;
  onUpdateCategories: (categories: Record<FieldCategory, string>) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  visible,
  onClose,
  categories,
  onUpdateCategories,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (key: string) => {
    form.setFieldsValue({
      key,
      name: categories[key as FieldCategory],
    });
    setEditingKey(key);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除分类后，该分类下的字段将被移动到基础分类中。确定要删除吗？',
      onOk: () => {
        const newCategories = { ...categories };
        delete newCategories[key as FieldCategory];
        onUpdateCategories(newCategories);
        message.success('分类删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newCategories = { ...categories };
      
      if (editingKey) {
        // 编辑现有分类
        delete newCategories[editingKey as FieldCategory];
        newCategories[values.key as FieldCategory] = values.name;
      } else {
        // 添加新分类
        newCategories[values.key as FieldCategory] = values.name;
      }

      onUpdateCategories(newCategories);
      setIsModalVisible(false);
      setEditingKey('');
      message.success(editingKey ? '分类更新成功' : '分类添加成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const columns = [
    {
      title: '分类键名',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: { key: string }) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.key)}
          >
            编辑
          </Button>
          {record.key !== 'basic' && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
            >
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const data = Object.entries(categories).map(([key, name]) => ({
    key,
    name,
  }));

  return (
    <Modal
      title="分类管理"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加分类
        </Button>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={false}
        />

        <Modal
          title={editingKey ? '编辑分类' : '添加分类'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingKey('');
          }}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="key"
              label="分类键名"
              rules={[
                { required: true, message: '请输入分类键名' },
                { pattern: /^[a-z]+$/, message: '键名只能包含小写字母' },
              ]}
            >
              <Input placeholder="请输入分类键名，如：custom" />
            </Form.Item>

            <Form.Item
              name="name"
              label="分类名称"
              rules={[
                { required: true, message: '请输入分类名称' },
              ]}
            >
              <Input placeholder="请输入分类名称，如：自定义字段" />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Modal>
  );
};

export default CategoryManager; 