import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TableOutlined,
  ApiOutlined,
  SettingOutlined,
  DatabaseOutlined,
  PartitionOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { Project } from '../../types/models';

const { Sider } = Layout;

interface AppSiderProps {
  project: Project;
}

const AppSider: React.FC<AppSiderProps> = ({ project }) => {
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    {
      key: 'tables',
      icon: <TableOutlined />,
      label: '数据表',
      children: [
        {
          key: 'table-list',
          icon: <UnorderedListOutlined />,
          label: '表列表',
        },
        {
          key: 'er-diagram',
          icon: <PartitionOutlined />,
          label: 'ER 图',
        },
      ],
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: 'API 管理',
      children: [
        {
          key: 'api-list',
          label: '接口列表',
        },
        {
          key: 'api-debug',
          label: '接口调试',
        },
      ],
    },
    {
      key: 'connections',
      icon: <DatabaseOutlined />,
      label: '数据库连接',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '项目设置',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    if (!project?.id) {
      console.error('Project ID is undefined');
      return;
    }

    switch (info.key) {
      case 'table-list':
        navigate(`/project/${project.id}`);
        break;
      case 'er-diagram':
        navigate(`/project/${project.id}/er-diagram`);
        break;
      case 'api-list':
        navigate(`/project/${project.id}/api`);
        break;
      case 'api-debug':
        navigate(`/project/${project.id}/api/debug`);
        break;
      case 'connections':
        navigate(`/project/${project.id}/connections`);
        break;
      case 'settings':
        navigate(`/project/${project.id}/settings`);
        break;
    }
  };

  return (
    <Sider width={200} theme="light">
      <Menu
        mode="inline"
        defaultOpenKeys={['tables']}
        style={{ height: '100%', borderRight: 0 }}
        items={items}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default AppSider; 