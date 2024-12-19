import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AppHeader from '../AppHeader';
import AppSider from '../AppSider';
import FloatActions from '../FloatActions';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useSelector((state: RootState) => 
    state.projects.items.find(p => p.id === projectId)
  );

  return (
    <AntLayout className="min-h-screen">
      <AppHeader />
      <AntLayout>
        <AppSider />
        <Content className="p-6 bg-gray-50">
          <Outlet context={{ project }} />
        </Content>
      </AntLayout>
      <FloatActions />
    </AntLayout>
  );
};

export default Layout; 