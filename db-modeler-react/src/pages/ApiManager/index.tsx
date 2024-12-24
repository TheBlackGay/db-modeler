import React, { useState } from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { KawaiiCard } from '../../components/anime/AnimeComponents';
import styled from 'styled-components';
import type { Api } from '../../types/models';

const PageContainer = styled.div`
  padding: 24px;
  background: var(--anime-background);
  min-height: 100vh;
`;

const StyledKawaiiCard = styled(KawaiiCard)`
  margin-bottom: 24px;
`;

const methodColors = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  DELETE: 'red',
};

const ApiManager: React.FC = () => {
  const [apis, setApis] = useState<Api[]>([]);

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      render: (method: Api['method']) => (
        <Tag color={methodColors[method]}>{method}</Tag>
      ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Api) => (
        <Space size="middle">
          <Button size="small">查看文档</Button>
          <Button size="small">编辑</Button>
          <Button size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAddApi = () => {
    // TODO: 实现添加 API 的逻辑
    console.log('添加新 API');
  };

  return (
    <PageContainer>
      <StyledKawaiiCard>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <h2>API 管理</h2>
            <Button type="primary" onClick={handleAddApi}>
              添加 API
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={apis}
          rowKey="id"
          pagination={{
            total: apis.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </StyledKawaiiCard>
    </PageContainer>
  );
};

export default ApiManager; 