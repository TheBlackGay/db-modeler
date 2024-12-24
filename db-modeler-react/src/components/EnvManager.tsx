import React, { useState } from 'react';
import { Modal, Form, Input, Button, Table, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Environment, EnvVariable, addEnvironment, updateEnvironment, deleteEnvironment } from '../store/envSlice';
import { v4 as uuidv4 } from 'uuid';

interface EnvManagerProps {
  open: boolean;
  onClose: () => void;
}

export const EnvManager: React.FC<EnvManagerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [variables, setVariables] = useState<EnvVariable[]>([]);

  const dispatch = useDispatch();
  const environments = useSelector((state: RootState) => state.env.environments);

  const handleAddVariable = () => {
    setVariables([
      ...variables,
      {
        key: '',
        value: '',
        description: '',
      },
    ]);
  };

  const handleDeleteVariable = (index: number) => {
    const newVariables = [...variables];
    newVariables.splice(index, 1);
    setVariables(newVariables);
  };

  const handleVariableChange = (index: number, field: keyof EnvVariable, value: string) => {
    const newVariables = [...variables];
    newVariables[index] = {
      ...newVariables[index],
      [field]: value,
    };
    setVariables(newVariables);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const env: Environment = {
        id: editingEnv?.id || uuidv4(),
        name: values.name,
        variables,
      };

      if (editingEnv) {
        dispatch(updateEnvironment(env));
        message.success('环境已更新');
      } else {
        dispatch(addEnvironment(env));
        message.success('环境已创建');
      }

      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (env: Environment) => {
    setEditingEnv(env);
    setVariables(env.variables);
    form.setFieldsValue({
      name: env.name,
    });
  };

  const handleDelete = (env: Environment) => {
    dispatch(deleteEnvironment(env.id));
    message.success('环境已删除');
  };

  const handleClose = () => {
    form.resetFields();
    setEditingEnv(null);
    setVariables([]);
    onClose();
  };

  const columns = [
    {
      title: '变量名',
      dataIndex: 'key',
      render: (key: string, _: any, index: number) => (
        <Input
          value={key}
          onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
          placeholder="变量名"
        />
      ),
    },
    {
      title: '变量值',
      dataIndex: 'value',
      render: (value: string, _: any, index: number) => (
        <Input
          value={value}
          onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
          placeholder="变量值"
        />
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      render: (description: string, _: any, index: number) => (
        <Input
          value={description}
          onChange={(e) => handleVariableChange(index, 'description', e.target.value)}
          placeholder="描述"
        />
      ),
    },
    {
      title: '操作',
      width: 100,
      render: (_: any, __: any, index: number) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteVariable(index)}
        >
          删除
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={editingEnv ? '编辑环境' : '添加环境'}
      open={open}
      onOk={handleSave}
      onCancel={handleClose}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="环境名称"
          rules={[{ required: true, message: '请输入环境名称' }]}
        >
          <Input placeholder="请输入环境名称" />
        </Form.Item>

        <div style={{ marginBottom: '16px' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddVariable}>
            添加变量
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={variables}
          rowKey={(_, index) => index?.toString() || '0'}
          pagination={false}
          size="small"
        />

        <Table
          style={{ marginTop: '24px' }}
          dataSource={environments}
          columns={[
            {
              title: '环境名称',
              dataIndex: 'name',
            },
            {
              title: '变量数量',
              dataIndex: 'variables',
              render: (variables: EnvVariable[]) => variables.length,
            },
            {
              title: '操作',
              render: (_: any, record: Environment) => (
                <Space>
                  <Button type="link" onClick={() => handleEdit(record)}>
                    编辑
                  </Button>
                  <Button type="link" danger onClick={() => handleDelete(record)}>
                    删除
                  </Button>
                </Space>
              ),
            },
          ]}
          pagination={false}
          size="small"
        />
      </Form>
    </Modal>
  );
}; 