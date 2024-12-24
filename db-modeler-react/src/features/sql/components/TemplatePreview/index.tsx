import React from 'react';
import { Modal } from 'antd';
import type { SQLTemplate } from '../../templates/types';

interface TemplatePreviewProps {
  visible: boolean;
  template: SQLTemplate | null;
  onCancel: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  visible,
  template,
  onCancel,
}) => {
  if (!template) {
    return null;
  }

  return (
    <Modal
      title={`预览: ${template.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {template.content}
      </pre>
    </Modal>
  );
}; 