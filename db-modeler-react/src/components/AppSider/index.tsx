import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DatabaseOutlined,
  TableOutlined,
  SettingOutlined,
  CloudServerOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Sider } = Layout;

const AppSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const currentProject = useSelector((state: RootState) => {
    const projectId = location.pathname.split('/')[2];
    return state.projects.items.find(p => p.id === projectId);
  });

  if (!currentProject) {
    return null;
  }

  const items = [
    {
      key: 'tables',
      icon: <DatabaseOutlined />,
      label: '数据表',
      children: [
        {
          key: 'tables-list',
          icon: <TableOutlined />,
          label: '表列表',
          onClick: () => navigate(`/project/${currentProject.id}`),
        },
        ...(currentProject.tables || []).map(table => ({
          key: `table-${table.id}`,
          icon: <TableOutlined />,
          label: table.name,
          onClick: () => navigate(`/project/${currentProject.id}/tables/${table.id}`),
        })),
        {
          key: 'new-table',
          icon: <PlusOutlined />,
          label: '新建表',
          onClick: () => navigate(`/project/${currentProject.id}/tables/new`),
        },
      ],
    },
    {
      key: 'connections',
      icon: <CloudServerOutlined />,
      label: '数据库连接',
      onClick: () => navigate(`/project/${currentProject.id}/connections`),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '项目设置',
      onClick: () => navigate(`/project/${currentProject.id}/settings`),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      width={200}
      className="border-r border-gray-200"
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['tables']}
        defaultOpenKeys={['tables']}
        items={items}
        className="h-full"
      />
    </Sider>
  );
};

export default AppSider; 