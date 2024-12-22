import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styles from './Sidebar.module.scss';

const { Sider } = Layout;

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '项目列表',
    },
    {
      key: '/connections',
      icon: <DatabaseOutlined />,
      label: '数据库连接',
    },
    {
      key: '/api-manager',
      icon: <ApiOutlined />,
      label: '接口管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider className={styles.sider} width={200}>
      <div className={styles.logo}>DB Modeler</div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}; 