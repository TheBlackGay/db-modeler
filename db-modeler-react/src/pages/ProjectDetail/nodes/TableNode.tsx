import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Typography, Badge, Space } from 'antd';

const { Title, Text } = Typography;

interface Field {
  name: string;
  type: string;
  length?: number;
  icons: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

interface TableNodeData {
  label: string;
  description?: string;
  fields: Field[];
  isSimpleMode: boolean;
}

interface TableNodeProps {
  data: TableNodeData;
  isConnectable: boolean;
}

export const TableNode = memo(({ data, isConnectable }: TableNodeProps) => {
  const primaryKeyCount = data.fields.filter(f => f.isPrimaryKey).length;
  const foreignKeyCount = data.fields.filter(f => f.isForeignKey).length;
  const indexCount = data.fields.filter(f => f.icons.includes('📇')).length;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ 
          width: 10,
          height: 10,
          background: '#1890ff',
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ 
          width: 10,
          height: 10,
          background: '#1890ff',
          border: '2px solid #fff',
        }}
      />
      <Card
        title={
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>
              {data.label}
            </Title>
            {data.description && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {data.description}
              </Text>
            )}
          </Space>
        }
        size="small"
        style={{
          width: data.isSimpleMode ? 200 : 280,
          background: '#fff',
          border: '2px solid #1890ff',
          borderRadius: 8,
        }}
        bodyStyle={{
          padding: '12px',
          maxHeight: data.isSimpleMode ? '100px' : '300px',
          overflowY: 'auto',
        }}
      >
        {data.isSimpleMode ? (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge count={primaryKeyCount} color="#1890ff" overflowCount={99} title="主键">
              <Text>🔑</Text>
            </Badge>
            <Badge count={foreignKeyCount} color="#52c41a" overflowCount={99} title="外键">
              <Text>🔗</Text>
            </Badge>
            <Badge count={indexCount} color="#faad14" overflowCount={99} title="索引">
              <Text>📇</Text>
            </Badge>
            <Text type="secondary">
              共 {data.fields.length} 个字段
            </Text>
          </div>
        ) : (
          data.fields.map((field, index) => (
            <div
              key={index}
              style={{
                padding: '4px 8px',
                marginBottom: 4,
                background: field.isPrimaryKey ? '#e6f7ff' : field.isForeignKey ? '#f6ffed' : 'transparent',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>{field.icons}</span>
              <Text strong={field.isPrimaryKey || field.isForeignKey}>
                {field.name}
              </Text>
              <Text type="secondary">
                {field.type}{field.length ? `(${field.length})` : ''}
              </Text>
            </div>
          ))
        )}
      </Card>
    </>
  );
});

TableNode.displayName = 'TableNode'; 