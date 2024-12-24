import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Project } from '../../types/models';
import { updateProject } from '../../store/projectsSlice';
import FieldEditor from './FieldEditor';
import { useNavigate } from 'react-router-dom';

interface TableEditorProps {
  project: Project;
}

const TableEditor: React.FC<TableEditorProps> = ({ project }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editorVisible, setEditorVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleEdit = (table: any) => {
    navigate(`/project/${project.id}/table/${table.id}`);
  };

  const columns = [
    {
      title: '表名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => handleEdit(record)}>{text}</a>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '字段数',
      key: 'fieldCount',
      render: (text: string, record: any) => record.fields?.length || 0,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={project.tables}
        rowKey="id"
        pagination={false}
      />
      <FieldEditor
        visible={editorVisible}
        table={selectedTable}
        onCancel={() => setEditorVisible(false)}
        project={project}
      />
    </div>
  );
};

export default TableEditor; 