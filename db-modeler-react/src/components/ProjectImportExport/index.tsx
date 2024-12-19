import React, { useState } from 'react';
import { Modal, Upload, Button, message, Space } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { Project } from '../../types/models';
import { useDispatch } from 'react-redux';
import { importProject } from '../../store/projectsSlice';

interface ProjectImportExportProps {
  visible: boolean;
  onCancel: () => void;
  currentProject?: Project;
}

const ProjectImportExport: React.FC<ProjectImportExportProps> = ({
  visible,
  onCancel,
  currentProject,
}) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleExport = () => {
    if (!currentProject) {
      message.error('没有可导出的项目');
      return;
    }

    // 创建导出数据
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      project: currentProject,
    };

    // 创建并下载文件
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    message.success('项目导出成功');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        // 验证导入数据的格式
        if (!importData.version || !importData.project) {
          throw new Error('无效的项目文件格式');
        }

        // 验证项目数据结构
        const project = importData.project;
        if (!project.id || !project.name || !Array.isArray(project.tables)) {
          throw new Error('项目数据结构不完整');
        }

        // 导入项目
        dispatch(importProject(project));
        message.success('项目导入成功');
        setFileList([]);
        onCancel();
      } catch (error) {
        message.error('导入失败：' + (error as Error).message);
      }
    };
    reader.readAsText(file);
    return false;
  };

  const uploadProps = {
    accept: '.json',
    fileList,
    beforeUpload: handleImport,
    onRemove: () => {
      setFileList([]);
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1));
    },
  };

  return (
    <Modal
      title="项目导入导出"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <h4>导入项目</h4>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>选择项目文件</Button>
          </Upload>
          <div style={{ marginTop: 8, color: '#666' }}>
            支持导入 .json 格式的项目文件
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <h4>导出项目</h4>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!currentProject}
          >
            导出当前项目
          </Button>
          {!currentProject && (
            <div style={{ marginTop: 8, color: '#ff4d4f' }}>
              请先选择一个项目
            </div>
          )}
        </div>
      </Space>
    </Modal>
  );
};

export default ProjectImportExport; 