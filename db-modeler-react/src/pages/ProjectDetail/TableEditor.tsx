import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Table, Button, Modal, Form, Input, Space, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { KawaiiButton } from '../../components/anime/AnimeComponents';
import { Table as TableType, Field, Project } from '../../types/models';
import { updateProject } from '../../store/projectsSlice';
import { useSound } from '../../hooks/useSound';
import { RootState } from '../../store';

const EditorContainer = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.backgroundLight};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const TableTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

interface TableEditorProps {
  projectId: string;
  tables: TableType[];
  onTableClick: (tableId: string) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ projectId, tables, onTableClick }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const { playClick, playHover } = useSound();
  const currentProject = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );

  const handleAddTable = () => {
    playClick();
    setEditingTable(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTable = (table: TableType) => {
    playClick();
    setEditingTable(table);
    form.setFieldsValue(table);
    setIsModalVisible(true);
  };

  const handleDeleteTable = (tableId: string) => {
    playClick();
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个表吗？此操作不可恢复。',
      onOk: () => {
        if (currentProject) {
          const updatedTables = tables.filter(t => t.id !== tableId);
          dispatch(updateProject({
            ...currentProject,
            tables: updatedTables,
          }));
          message.success('表已删除');
        }
      }
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!currentProject) return;

      const newTable: TableType = {
        id: editingTable?.id || crypto.randomUUID(),
        name: values.name,
        description: values.description,
        fields: editingTable?.fields || [],
        createdAt: editingTable?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTables = editingTable
        ? tables.map(t => t.id === editingTable.id ? newTable : t)
        : [...tables, newTable];

      dispatch(updateProject({
        ...currentProject,
        tables: updatedTables,
      }));
      setIsModalVisible(false);
      message.success(`表${editingTable ? '已更新' : '已创建'}`);
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  const columns = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '字段数',
      key: 'fieldCount',
      render: (_: unknown, record: TableType) => record.fields?.length || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: TableType) => (
        <Space>
          <Tooltip title="编辑表">
            <KawaiiButton
              type="text"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditTable(record);
              }}
              onMouseEnter={playHover}
            />
          </Tooltip>
          <Tooltip title="管理字段">
            <KawaiiButton
              type="text"
              icon={<SettingOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onTableClick(record.id);
              }}
              onMouseEnter={playHover}
            />
          </Tooltip>
          <Tooltip title="删除表">
            <KawaiiButton
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTable(record.id);
              }}
              onMouseEnter={playHover}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <EditorContainer>
      <TableTitle>
        <KawaiiButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddTable}
          onMouseEnter={playHover}
        >
          创建表
        </KawaiiButton>
      </TableTitle>

      <Table
        columns={columns}
        dataSource={tables}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => onTableClick(record.id),
          style: { cursor: 'pointer' }
        })}
      />

      <Modal
        title={editingTable ? '编辑表' : '创建表'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="表名"
            rules={[{ required: true, message: '请输入表名' }]}
          >
            <Input placeholder="请输入表名" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入表的描述" />
          </Form.Item>
        </Form>
      </Modal>
    </EditorContainer>
  );
};

export default TableEditor; 