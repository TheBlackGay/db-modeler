import React from 'react';
import { Modal, Descriptions } from 'antd';
import type { FieldTemplate } from '../../../../types/models';

interface TemplatePreviewProps {
  visible: boolean;
  template: FieldTemplate | null;
  onCancel: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  visible,
  template,
  onCancel,
}) => {
  if (!template) {
    return null;
  }

  return (
    <Modal
      title="模板预览"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="名称">{template.name}</Descriptions.Item>
        <Descriptions.Item label="描述">{template.description}</Descriptions.Item>
        <Descriptions.Item label="分类">{template.category}</Descriptions.Item>
        <Descriptions.Item label="类型">{template.type}</Descriptions.Item>
        <Descriptions.Item label="长度">{template.length}</Descriptions.Item>
        <Descriptions.Item label="可空">{template.nullable ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="默认值">{template.defaultValue || '-'}</Descriptions.Item>
        <Descriptions.Item label="注释">{template.comment || '-'}</Descriptions.Item>
        <Descriptions.Item label="主键">{template.isPrimaryKey ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="自增">{template.isAutoIncrement ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="唯一">{template.unique ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="索引">{template.index ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="无符号">{template.unsigned ? '是' : '否'}</Descriptions.Item>
        <Descriptions.Item label="补零">{template.zerofill ? '是' : '否'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TemplatePreview; 