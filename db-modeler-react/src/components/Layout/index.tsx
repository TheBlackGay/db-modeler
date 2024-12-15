import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { DatabaseOutlined, TableOutlined, HomeOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentProject = useSelector((state: RootState) => state.projects.currentProject);

  // 生成菜单项
  const getMenuItems = () => {
    const items = [
      {
        key: '/',
        icon: <HomeOutlined />,
        label: '项目列表',
      }
    ];

    if (currentProject) {
      items.push({
        key: `/project/${currentProject.id}`,
        icon: <DatabaseOutlined />,
        label: currentProject.name,
        children: currentProject.tables.map(table => ({
          key: `/table/${table.id}`,
          icon: <TableOutlined />,
          label: table.name,
        }))
      });
    }

    return items;
  };

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    if (pathname === '/') {
      return ['/'];
    }
    return [pathname];
  };

  // 获取展开的子菜单
  const getOpenKeys = () => {
    if (currentProject) {
      return [`/project/${currentProject.id}`];
    }
    return [];
  };

  return (
    <AntLayout className="min-h-screen">
      <Header className="bg-white shadow-md flex items-center px-6">
        <h1 className="text-xl font-bold">DB Modeler</h1>
      </Header>
      <AntLayout>
        <Sider width={250} theme="light" className="border-r">
          <Menu
            mode="inline"
            items={getMenuItems()}
            onClick={handleMenuClick}
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            className="h-full"
          />
        </Sider>
        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 