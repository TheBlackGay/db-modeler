import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Table, Button, Modal, Form, Input, Select, Space, Tooltip, Switch, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined, LinkOutlined } from '@ant-design/icons';
import { KawaiiButton } from '../../components/anime/AnimeComponents';
import { Field, Table as TableType, Project } from '../../types/models';
import { updateProject } from '../../store/projectsSlice';
import { useSound } from '../../hooks/useSound';
import { RootState } from '../../store';

const EditorContainer = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.backgroundLight};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableInfo = styled.div`
  h2 {
    margin: 0;
    color: ${props => props.theme.colors.primary};
    font-family: ${props => props.theme.fonts.kawaii};
  }
  
  p {
    margin: 4px 0 0;
    color: ${props => props.theme.colors.textLight};
  }
`;

interface FieldEditorProps {
  projectId: string;
  tableId: string;
  onBack: () => void;
}

const fieldTypes = [
  { label: '整数', value: 'int' },
  { label: '长整数', value: 'bigint' },
  { label: '小数', value: 'decimal' },
  { label: '文本', value: 'varchar' },
  { label: '长文本', value: 'text' },
  { label: '日期', value: 'date' },
  { label: '时间戳', value: 'timestamp' },
  { label: '布尔值', value: 'boolean' },
];

const FieldEditor: React.FC<FieldEditorProps> = ({ projectId, tableId, onBack }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const { playClick, playHover } = useSound();

  const currentProject = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );
  
  const currentTable = currentProject?.tables.find(t => t.id === tableId);

  if (!currentProject || !currentTable) {
    return null;
  }

  const handleAddField = () => {
    playClick();
    setEditingField(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditField = (field: Field) => {
    playClick();
    setEditingField(field);
    form.setFieldsValue({
      ...field,
      foreignKey: field.foreignKey ? {
        tableId: field.foreignKey.tableId,
        fieldId: field.foreignKey.fieldId,
      } : undefined,
    });
    setIsModalVisible(true);
  };

  const handleDeleteField = (fieldId: string) => {
    playClick();
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个字段吗？此操作不可恢复。',
      onOk: () => {
        const updatedFields = currentTable.fields.filter(f => f.id !== fieldId);
        const updatedTables = currentProject.tables.map(t =>
          t.id === tableId ? { ...t, fields: updatedFields } : t
        );

        dispatch(updateProject({
          ...currentProject,
          tables: updatedTables,
        }));
        message.success('字段已删除');
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newField: Field = {
        id: editingField?.id || crypto.randomUUID(),
        name: values.name,
        type: values.type,
        length: values.length,
        precision: values.precision,
        scale: values.scale,
        nullable: values.nullable,
        defaultValue: values.defaultValue,
        isPrimaryKey: values.isPrimaryKey,
        isAutoIncrement: values.isAutoIncrement,
        unique: values.unique,
        index: values.index,
        comment: values.comment,
        foreignKey: values.foreignKey ? {
          ...values.foreignKey,
          tableName: currentProject.tables.find(t => t.id === values.foreignKey.tableId)?.name || '',
          fieldName: currentProject.tables
            .find(t => t.id === values.foreignKey.tableId)
            ?.fields.find(f => f.id === values.foreignKey.fieldId)?.name || '',
        } : undefined,
      };

      const updatedFields = editingField
        ? currentTable.fields.map(f => f.id === editingField.id ? newField : f)
        : [...currentTable.fields, newField];

      const updatedTables = currentProject.tables.map(t =>
        t.id === tableId ? { ...t, fields: updatedFields } : t
      );

      dispatch(updateProject({
        ...currentProject,
        tables: updatedTables,
      }));

      setIsModalVisible(false);
      message.success(`字段${editingField ? '已更新' : '已创建'}`);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const columns = [
    {
      title: '字段名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string, record: Field) => {
        let typeStr = text;
        if (record.length) {
          typeStr += `(${record.length})`;
        } else if (record.precision && record.scale) {
          typeStr += `(${record.precision},${record.scale})`;
        }
        return typeStr;
      },
    },
    {
      title: '可空',
      dataIndex: 'nullable',
      key: 'nullable',
      render: (value: boolean) => (value ? '是' : '否'),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
    },
    {
      title: '主键',
      dataIndex: 'isPrimaryKey',
      key: 'isPrimaryKey',
      render: (value: boolean) => (value ? <KeyOutlined style={{ color: '#ff69b4' }} /> : null),
    },
    {
      title: '外键',
      key: 'foreignKey',
      render: (_: unknown, record: Field) => (
        record.foreignKey ? (
          <Tooltip title={`关联到 ${record.foreignKey.tableName}.${record.foreignKey.fieldName}`}>
            <LinkOutlined style={{ color: '#ff69b4' }} />
          </Tooltip>
        ) : null
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Field) => (
        <Space>
          <Tooltip title="编辑字段">
            <KawaiiButton
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditField(record)}
              onMouseEnter={playHover}
            />
          </Tooltip>
          <Tooltip title="删除字段">
            <KawaiiButton
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteField(record.id)}
              onMouseEnter={playHover}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <EditorContainer>
      <EditorHeader>
        <TableInfo>
          <h2>{currentTable.name}</h2>
          <p>{currentTable.description}</p>
        </TableInfo>
        <Space>
          <KawaiiButton onClick={onBack} onMouseEnter={playHover}>
            返回表列表
          </KawaiiButton>
          <KawaiiButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddField}
            onMouseEnter={playHover}
          >
            添加字段
          </KawaiiButton>
        </Space>
      </EditorHeader>

      <Table
        columns={columns}
        dataSource={currentTable.fields}
        rowKey="id"
      />

      <Modal
        title={editingField ? '编辑字段' : '添加字段'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="字段名"
            rules={[{ required: true, message: '请输入字段名' }]}
          >
            <Input placeholder="请输入字段名" />
          </Form.Item>

          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择字段类型' }]}
          >
            <Select options={fieldTypes} />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.type !== curr.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'varchar') {
                return (
                  <Form.Item
                    name="length"
                    label="长度"
                    rules={[{ required: true, message: '请输入长度' }]}
                  >
                    <InputNumber min={1} max={65535} />
                  </Form.Item>
                );
              }
              if (type === 'decimal') {
                return (
                  <Space>
                    <Form.Item
                      name="precision"
                      label="精度"
                      rules={[{ required: true, message: '请输入精度' }]}
                    >
                      <InputNumber min={1} max={65} />
                    </Form.Item>
                    <Form.Item
                      name="scale"
                      label="小数位"
                      rules={[{ required: true, message: '请输入小数位数' }]}
                    >
                      <InputNumber min={0} max={30} />
                    </Form.Item>
                  </Space>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="nullable"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="可空" unCheckedChildren="不可空" />
          </Form.Item>

          <Form.Item name="defaultValue" label="默认值">
            <Input placeholder="请输入默认值" />
          </Form.Item>

          <Form.Item
            name="isPrimaryKey"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="主键" unCheckedChildren="非主键" />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.isPrimaryKey !== curr.isPrimaryKey}
          >
            {({ getFieldValue }) => {
              const isPrimaryKey = getFieldValue('isPrimaryKey');
              if (isPrimaryKey) {
                return (
                  <Form.Item
                    name="isAutoIncrement"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch checkedChildren="自增" unCheckedChildren="非自增" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="unique"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="唯一" unCheckedChildren="非唯一" />
          </Form.Item>

          <Form.Item
            name="index"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="索引" unCheckedChildren="非索引" />
          </Form.Item>

          <Form.Item
            name={['foreignKey', 'tableId']}
            label="外键表"
          >
            <Select
              allowClear
              options={currentProject.tables
                .filter(t => t.id !== tableId)
                .map(t => ({ label: t.name, value: t.id }))}
              onChange={() => form.setFieldValue(['foreignKey', 'fieldId'], undefined)}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => 
              prev.foreignKey?.tableId !== curr.foreignKey?.tableId
            }
          >
            {({ getFieldValue }) => {
              const foreignTableId = getFieldValue(['foreignKey', 'tableId']);
              if (foreignTableId) {
                const foreignTable = currentProject.tables.find(t => t.id === foreignTableId);
                return (
                  <Form.Item
                    name={['foreignKey', 'fieldId']}
                    label="关联字段"
                    rules={[{ required: true, message: '请选择关联字段' }]}
                  >
                    <Select
                      options={foreignTable?.fields.map(f => ({
                        label: f.name,
                        value: f.id,
                      }))}
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item name="comment" label="注释">
            <Input.TextArea placeholder="请输入字段注释" />
          </Form.Item>
        </Form>
      </Modal>
    </EditorContainer>
  );
};

export default FieldEditor; 