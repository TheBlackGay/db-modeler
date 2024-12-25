import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Layout, Menu } from 'antd';
import {
  ProjectOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import SoundManager from '../anime/SoundManager';
import SakuraEffect from '../anime/SakuraEffect';

const { Header, Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 24px;
  color: var(--anime-primary);
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: var(--anime-primary-hover);
  }
`;

const StyledContent = styled(Content)`
  margin-top: 64px;
  min-height: calc(100vh - 64px);
`;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
    },
    {
      key: '/connections',
      icon: <DatabaseOutlined />,
      label: '数据库连接',
    },
    {
      key: '/api',
      icon: <ApiOutlined />,
      label: 'API 管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  return (
    <StyledLayout>
      <StyledHeader>
        <Logo to="/">DB Modeler</Logo>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            ...item,
            label: <Link to={item.key}>{item.label}</Link>,
          }))}
          style={{ flex: 1, border: 'none' }}
        />
      </StyledHeader>
      <StyledContent>{children}</StyledContent>
      <SoundManager />
      <SakuraEffect />
    </StyledLayout>
  );
};

export default MainLayout; 