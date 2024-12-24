import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from '../AppHeader';
import AppSider from '../AppSider';

const { Content } = AntLayout;

export const Layout: React.FC = () => {
  const location = useLocation();
  const paths = location.pathname.split('/');
  const showSider = paths[1] === 'project';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {showSider && <AppSider />}
      <AntLayout>
        <AppHeader />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}; 