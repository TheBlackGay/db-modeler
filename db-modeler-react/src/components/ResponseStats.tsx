import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Space, Tag } from 'antd';
import { Area, Pie } from '@ant-design/charts';
import { responseAnalyzer } from '../utils/responseAnalyzer';
import { ResponseData } from '../pages/interface/types';

interface ResponseStatsProps {
  response: ResponseData;
}

export const ResponseStats: React.FC<ResponseStatsProps> = ({ response }) => {
  const stats = responseAnalyzer.generateStats(
    response.status,
    response.statusText,
    response.headers,
    response.rawData,
    response.duration
  );

  const complexity = responseAnalyzer.analyzeComplexity(response.data);

  // 响应时间瀑布图数据
  const timingData = [
    { stage: 'DNS 解析', time: stats.timing.dns || 0 },
    { stage: 'TCP 连接', time: stats.timing.tcp || 0 },
    { stage: 'TLS 握手', time: stats.timing.tls || 0 },
    { stage: '请求时间', time: stats.timing.request },
    { stage: '响应时间', time: stats.timing.response },
  ].filter(item => item.time > 0);

  // 响应大小饼图数据
  const sizeData = [
    { type: '响应头', value: stats.size.headers },
    { type: '响应体', value: stats.size.body },
  ];

  return (
    <Card title="响应统计" style={{ marginTop: '16px' }}>
      <Row gutter={[16, 16]}>
        {/* 基本统计信息 */}
        <Col span={6}>
          <Card>
            <Statistic
              title="状态码"
              value={stats.status.code}
              suffix={stats.status.text}
              valueStyle={{
                color:
                  stats.status.category === 'success'
                    ? '#3f8600'
                    : stats.status.category === 'redirect'
                    ? '#1890ff'
                    : '#cf1322',
              }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总响应时间"
              value={stats.timing.total}
              suffix="ms"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总大小"
              value={(stats.size.total / 1024).toFixed(2)}
              suffix="KB"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="响应头数量"
              value={stats.headers.count}
              suffix="个"
            />
          </Card>
        </Col>

        {/* 响应时间分析 */}
        <Col span={12}>
          <Card title="响应时间分析">
            <Area
              data={timingData}
              xField="stage"
              yField="time"
              seriesField="stage"
              color={['#1890ff']}
              areaStyle={{ fillOpacity: 0.6 }}
              height={200}
            />
          </Card>
        </Col>

        {/* 响应大小分析 */}
        <Col span={12}>
          <Card title="响应大小分析">
            <Pie
              data={sizeData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                formatter: (text, item) => 
                  `${item._origin.type}: ${(item._origin.value / 1024).toFixed(2)}KB`,
              }}
              height={200}
            />
          </Card>
        </Col>

        {/* 响应头分析 */}
        <Col span={24}>
          <Card title="响应头分析">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={Object.entries(response.headers).map(([key, value]) => ({
                    key,
                    name: key,
                    value,
                  }))}
                  columns={[
                    {
                      title: '名称',
                      dataIndex: 'name',
                      key: 'name',
                      width: '30%',
                    },
                    {
                      title: '值',
                      dataIndex: 'value',
                      key: 'value',
                      ellipsis: true,
                    },
                  ]}
                  scroll={{ y: 300 }}
                />
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <h4>安全响应头</h4>
                    <Space wrap>
                      {stats.headers.securityHeaders.map(header => (
                        <Tag key={header} color="success">
                          {header}
                        </Tag>
                      ))}
                      {stats.headers.securityHeaders.length === 0 && (
                        <Tag color="warning">未发现安全响应头</Tag>
                      )}
                    </Space>
                  </div>
                  <div>
                    <h4>缓存控制</h4>
                    <Tag color={stats.headers.cacheControl ? 'processing' : 'default'}>
                      {stats.headers.cacheControl || '未设置'}
                    </Tag>
                  </div>
                  <div>
                    <h4>服务器信息</h4>
                    <Tag color={stats.headers.server ? 'processing' : 'default'}>
                      {stats.headers.server || '未提供'}
                    </Tag>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 响应数据复杂度分析 */}
        <Col span={24}>
          <Card title="数据复杂度分析">
            <Row gutter={16}>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={Math.min((complexity.depth / 10) * 100, 100)}
                  format={() => `深度: ${complexity.depth}`}
                />
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={Math.min((complexity.breadth / 20) * 100, 100)}
                  format={() => `广度: ${complexity.breadth}`}
                />
              </Col>
              <Col span={8}>
                <Progress
                  type="dashboard"
                  percent={Math.min((complexity.leafNodes / 100) * 100, 100)}
                  format={() => `叶节点: ${complexity.leafNodes}`}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}; 