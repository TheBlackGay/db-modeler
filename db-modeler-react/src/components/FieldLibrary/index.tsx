import React, { useEffect, useState } from 'react';
import { Modal, Input, List, Space, Button, Tag } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { Field } from '../../types/models';
import { loadFieldLibrary, removeFieldFromLibrary } from '../../services/storage';

interface FieldLibraryProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (field: Field) => void;
}

const FieldLibrary: React.FC<FieldLibraryProps> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (visible) {
      loadFields();
    }
  }, [visible]);

  const loadFields = () => {
    const libraryFields = loadFieldLibrary();
    setFields(libraryFields);
  };

  const handleDelete = (fieldId: string) => {
    removeFieldFromLibrary(fieldId);
    loadFields();
  };

  const filteredFields = fields.filter(field => {
    const searchLower = searchText.toLowerCase();
    return (
      field.name.toLowerCase().includes(searchLower) ||
      field.type.toLowerCase().includes(searchLower) ||
      field.comment?.toLowerCase().includes(searchLower)
    );
  });

  const renderFieldTags = (field: Field) => {
    const tags = [];

    if (field.isPrimaryKey) {
      tags.push(<Tag key="pk" color="red">主键</Tag>);
    }
    if (field.isAutoIncrement) {
      tags.push(<Tag key="auto" color="orange">自增</Tag>);
    }
    if (field.unique) {
      tags.push(<Tag key="unique" color="green">唯一</Tag>);
    }
    if (field.index) {
      tags.push(<Tag key="index" color="blue">索引</Tag>);
    }
    if (field.nullable) {
      tags.push(<Tag key="null" color="default">可空</Tag>);
    } else {
      tags.push(<Tag key="notnull" color="purple">非空</Tag>);
    }
    if (field.unsigned) {
      tags.push(<Tag key="unsigned" color="cyan">无符号</Tag>);
    }
    if (field.zerofill) {
      tags.push(<Tag key="zerofill" color="magenta">补零</Tag>);
    }

    return tags;
  };

  return (
    <Modal
      title="字段库"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索字段名称、类型或注释"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
      </div>

      <List
        dataSource={filteredFields}
        renderItem={field => (
          <List.Item
            key={field.id}
            actions={[
              <Button key="use" type="primary" onClick={() => onSelect(field)}>
                使用此字段
              </Button>,
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(field.id)}
              >
                删除
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Space>
                  <span>{field.name}</span>
                  <span style={{ color: '#666' }}>
                    {field.type}
                    {field.length && `(${field.length})`}
                  </span>
                </Space>
              }
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>{field.comment}</div>
                  <Space>{renderFieldTags(field)}</Space>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FieldLibrary; 