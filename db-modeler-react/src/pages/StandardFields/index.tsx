import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { RootState } from '../../store';
import { StandardField } from '../../types/models';
import { setFields, addField, updateField, deleteField } from '../../store/standardFieldsSlice';
import { loadStandardFields, saveStandardFields } from '../../services/storage';
import FieldForm from './FieldForm';

const { Search } = Input;

const StandardFields: React.FC = () => {
  const dispatch = useDispatch();
  const { fields } = useSelector((state: RootState) => state.standardFields);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<StandardField | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadedFields = loadStandardFields();
    dispatch(setFields(loadedFields));
  }, [dispatch]);

  const handleAdd = () => {
    setEditingField(null);
    setIsModalVisible(true);
  };

  const handleEdit = (field: StandardField) => {
    setEditingField(field);
    setIsModalVisible(true);
  };

  const handleDelete = (field: StandardField) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除字段"${field.name}"吗？`,
      onOk: () => {
        dispatch(deleteField(field.id));
        saveStandardFields(fields.filter(f => f.id !== field.id));
        message.success('删除成功');
      },
    });
  };

  const handleSave = (field: StandardField) => {
    if (editingField) {
      dispatch(updateField(field));
      saveStandardFields(fields.map(f => (f.id === field.id ? field : f)));
      message.success('更新成功');
    } else {
      dispatch(addField(field));
      saveStandardFields([...fields, field]);
      message.success('添加成功');
    }
    setIsModalVisible(false);
  };

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
      title: '长度',
      dataIndex: 'length',
      key: 'length',
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (required ? '是' : '否'),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: StandardField) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const filteredFields = fields.filter(field =>
    searchText
      ? field.name.toLowerCase().includes(searchText.toLowerCase()) ||
        field.alias.toLowerCase().includes(searchText.toLowerCase())
      : true
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="搜索字段"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加字段
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredFields}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
      <FieldForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSave={handleSave}
        field={editingField}
      />
    </div>
  );
};

export default StandardFields; 