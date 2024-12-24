import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Typography } from 'antd';

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
}

interface TableNodeProps {
  data: TableNodeData;
}

export const TableNode = memo(({ data }: TableNodeProps) => {
  return (
    <Card
      title={
        <Title level={5} style={{ margin: 0 }}>
          {data.label}
        </Title>
      }
      size="small"
      style={{
        width: 280,
        background: '#fff',
        border: '2px solid #1890ff',
        borderRadius: 8,
      }}
      bodyStyle={{
        padding: '12px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      
      {data.description && (
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
          {data.description}
        </Text>
      )}
      
      {data.fields.map((field, index) => (
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
      ))}
    </Card>
  );
});

TableNode.displayName = 'TableNode'; 