import React, { useState } from 'react';
import { Modal, Table, Button, Space, Tag, Input, message } from 'antd';
import { useSelector } from 'react-redux';
import { StandardField } from '../../types/models';
import { RootState } from '../../store';

const { Search } = Input;

interface FieldReuseProps {
  visible: boolean;
  onClose: () => void;
  onFieldsSelect: (fields: StandardField[]) => void;
  currentFields?: string[]; // 当前表已有的字段名列表
}

const FieldReuse: React.FC<FieldReuseProps> = ({
  visible,
  onClose,
  onFieldsSelect,
  currentFields = [],
}) => {
  const { fields } = useSelector((state: RootState) => state.standardFields);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: '字段名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ color: currentFields.includes(name) ? '#ff4d4f' : 'inherit' }}>
          {name}
          {currentFields.includes(name) && (
            <Tag color="error" style={{ marginLeft: 8 }}>已存在</Tag>
          )}
        </span>
      ),
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
      title: '是否必填',
      dataIndex: 'required',
      key: 'required',
      render: (required: boolean) => (
        <Tag color={required ? 'red' : 'green'}>
          {required ? '必填' : '可选'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const handleOk = () => {
    if (selectedFields.length === 0) {
      message.warning('请选择要添加的字段');
      return;
    }

    const fieldsToAdd = fields.filter(field => selectedFields.includes(field.id));
    const duplicateFields = fieldsToAdd.filter(field => currentFields.includes(field.name));

    if (duplicateFields.length > 0) {
      Modal.confirm({
        title: '字段重复',
        content: `以下字段在当前表中已存在：${duplicateFields.map(f => f.name).join(', ')}。是否继续添加其他字段？`,
        onOk: () => {
          const uniqueFields = fieldsToAdd.filter(field => !currentFields.includes(field.name));
          if (uniqueFields.length > 0) {
            onFieldsSelect(uniqueFields);
            onClose();
          }
        },
      });
    } else {
      onFieldsSelect(fieldsToAdd);
      onClose();
    }
  };

  const filteredFields = fields.filter(field =>
    searchText
      ? field.name.toLowerCase().includes(searchText.toLowerCase()) ||
        field.alias.toLowerCase().includes(searchText.toLowerCase())
      : true
  );

  return (
    <Modal
      title="复用字段"
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
        >
          添加所选字段 ({selectedFields.length})
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="搜索字段"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredFields}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedFields,
          onChange: (selectedRowKeys) => setSelectedFields(selectedRowKeys as string[]),
          getCheckboxProps: (record) => ({
            disabled: currentFields.includes(record.name),
          }),
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Modal>
  );
};

export default FieldReuse; 