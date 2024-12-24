import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Table as TableType } from '../../types/models';
import styled from '@emotion/styled';

const StyledSpace = styled(Space)`
  margin-bottom: 16px;
`;

const TableList: React.FC = () => {
  const project = useSelector((state: RootState) => state.project.currentProject);

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
      render: (text: string, record: TableType) => record.fields.length,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: TableType) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {}}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {}}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <StyledSpace>
        <Button type="primary">新建表</Button>
      </StyledSpace>
      <Table
        columns={columns}
        dataSource={project?.tables || []}
        rowKey="id"
      />
    </div>
  );
};

export default TableList; 