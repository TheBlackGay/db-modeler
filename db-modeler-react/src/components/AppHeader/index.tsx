import React from 'react';
import { Layout, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentProject = useSelector((state: RootState) => {
    const projectId = location.pathname.split('/')[2];
    return state.projects.items.find(p => p.id === projectId);
  });

  const showBackButton = location.pathname !== '/';

  return (
    <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            className="mr-4"
          />
        )}
        <h1 className="text-lg font-bold m-0">
          {currentProject ? currentProject.name : '数据库设计工具'}
        </h1>
      </div>
    </Header>
  );
};

export default AppHeader; 