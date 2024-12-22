import React from 'react';
import { Descriptions, Tag, Space } from 'antd';
import type { Api } from '../../types/api.types';
import styles from './ApiInfo.module.scss';

interface ApiInfoProps {
  api: Api;
}

export const ApiInfo: React.FC<ApiInfoProps> = ({ api }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'deprecated':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return '#61affe';
      case 'post':
        return '#49cc90';
      case 'put':
        return '#fca130';
      case 'delete':
        return '#f93e3e';
      default:
        return '#999';
    }
  };

  return (
    <div className={styles.container}>
      <Descriptions bordered>
        <Descriptions.Item label="名称" span={3}>
          {api.name}
        </Descriptions.Item>
        <Descriptions.Item label="URL" span={3}>
          {api.url}
        </Descriptions.Item>
        <Descriptions.Item label="请求方法">
          <Tag color={getMethodColor(api.method)}>{api.method}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={getStatusColor(api.status)}>{api.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="版本">
          {api.version}
        </Descriptions.Item>
        <Descriptions.Item label="标签" span={3}>
          <Space>
            {api.tags?.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {api.created_at}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {api.updated_at}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {api.created_by}
        </Descriptions.Item>
      </Descriptions>
      {api.description && (
        <div className={styles.description}>
          <h3>描述</h3>
          <p>{api.description}</p>
        </div>
      )}
    </div>
  );
}; 