import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, List, Modal, Form, Input, message, Dropdown, Space, Input as AntInput } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import { setCurrentProject, addTable, updateTable, deleteTable } from '../../store/projectsSlice';
import type { Table } from '../../types/models';
import type { MenuProps } from 'antd';

const { Search } = AntInput;

const ProjectDetail: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (projectId) {
      dispatch(setCurrentProject(projectId));
    }
  }, [projectId, dispatch]);

  const handleCreateTable = () => {
    setEditingTable(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    form.resetFields();
    form.setFieldsValue({
      name: table.name,
      comment: table.comment,
    });
    setIsModalVisible(true);
  };

  const handleDeleteTable = (table: Table) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除表"${table.name}"吗？此操作不可恢复。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        if (currentProject) {
          dispatch(deleteTable({
            projectId: currentProject.id,
            tableId: table.id,
          }));
          dispatch(setCurrentProject(currentProject.id));
          message.success('表删除成功');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentProject) {
        // 检查表名是否重复
        const isDuplicate = currentProject.tables.some(
          table => table.name === values.name && table.id !== editingTable?.id
        );

        if (isDuplicate) {
          message.error('表名已存在，请使用其他名称');
          return;
        }

        if (editingTable) {
          // 更新表
          dispatch(updateTable({
            projectId: currentProject.id,
            tableId: editingTable.id,
            data: values,
          }));
          message.success('表更新成功');
        } else {
          // 创建表
          dispatch(addTable({
            projectId: currentProject.id,
            name: values.name,
            comment: values.comment,
          }));
          message.success('表创建成功');
        }
        dispatch(setCurrentProject(currentProject.id));
        setIsModalVisible(false);
        setEditingTable(null);
        form.resetFields();
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleTableClick = (table: Table) => {
    navigate(`/table/${table.id}`);
  };

  const getFilteredTables = () => {
    if (!currentProject) return [];
    return currentProject.tables.filter(table => 
      table.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (table.comment || '').toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const getDropdownItems = (table: Table): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => setTimeout(() => handleEditTable(table), 0),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => setTimeout(() => handleDeleteTable(table), 0),
    },
  ];

  if (!currentProject) {
    return <div className="p-6">项目不存在</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">{currentProject.name}</h2>
        <Space>
          <Search
            placeholder="搜索表名或注释"
            allowClear
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTable}>
            创建表
          </Button>
        </Space>
      </div>
      
      <p className="text-gray-600 mb-6">{currentProject.description}</p>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={getFilteredTables()}
        renderItem={(table) => (
          <List.Item>
            <Card
              hoverable
              title={
                <div className="flex justify-between items-center">
                  <span>{table.name}</span>
                  <Dropdown
                    menu={{ 
                      items: getDropdownItems(table),
                      onClick: e => {
                        e.domEvent.stopPropagation();
                        e.domEvent.preventDefault();
                      }
                    }}
                    trigger={['click']}
                    destroyPopupOnHide
                  >
                    <Button
                      type="text"
                      icon={<MoreOutlined />}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    />
                  </Dropdown>
                </div>
              }
              onClick={() => handleTableClick(table)}
            >
              <p className="text-gray-600">{table.comment || '暂无描述'}</p>
              <p className="text-sm text-gray-400 mt-4">
                字段数量：{table.fields.length}
              </p>
              <p className="text-sm text-gray-400">
                最后更新：{new Date(table.updatedAt).toLocaleString()}
              </p>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingTable ? '编辑表' : '创建表'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingTable(null);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          initialValues={editingTable ? {
            name: editingTable.name,
            comment: editingTable.comment,
          } : undefined}
        >
          <Form.Item
            name="name"
            label="表名"
            rules={[
              { required: true, message: '请输入表名' },
              { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '表名只能包含字母、数字和下划线，且不能以数字开头' }
            ]}
          >
            <Input placeholder="例如：users" />
          </Form.Item>
          <Form.Item
            name="comment"
            label="表注释"
          >
            <Input.TextArea rows={4} placeholder="请输入表的描述信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetail; 