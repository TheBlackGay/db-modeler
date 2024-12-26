import React from 'react';
import { Card, Tree, Typography, Tabs, Table, Tag, Space, Button } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { EolinkerApi, EolinkerApiGroup } from '../../types/models';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ApiDocs: React.FC = () => {
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  const paramColumns = [
    {
      title: '参数名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '必填',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (required ? '是' : '否'),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const renderApiDetail = (api: EolinkerApi) => (
    <Card key={api.id} style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4}>{api.name}</Title>
        <Space>
          <Tag color="blue">{api.method}</Tag>
          <Text copyable>{api.url}</Text>
        </Space>
        <Paragraph type="secondary">{api.description}</Paragraph>

        <Tabs defaultActiveKey="1">
          <TabPane tab="请求参数" key="1">
            <Table
              columns={paramColumns}
              dataSource={[]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </TabPane>
          <TabPane tab="响应参数" key="2">
            <Table
              columns={paramColumns}
              dataSource={[]}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </TabPane>
          <TabPane tab="示例" key="3">
            <Card size="small" title="请求示例">
              <pre>{JSON.stringify({ example: 'request' }, null, 2)}</pre>
            </Card>
            <Card size="small" title="响应示例" style={{ marginTop: 16 }}>
              <pre>{JSON.stringify({ example: 'response' }, null, 2)}</pre>
            </Card>
          </TabPane>
        </Tabs>
      </Space>
    </Card>
  );

  return (
    <Card
      title="API文档"
      extra={
        <Space>
          <Button type="primary">导出文档</Button>
          <Button>刷新</Button>
        </Space>
      }
    >
      {/* TODO: 实现API列表和文档内容 */}
      <Text>暂无API文档</Text>
    </Card>
  );
};

export default ApiDocs; 