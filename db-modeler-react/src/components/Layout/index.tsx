import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import styles from './Layout.module.scss';

const { Content } = AntLayout;

export const Layout: React.FC = () => {
  return (
    <AntLayout className={styles.layout}>
      <Sidebar />
      <AntLayout className={styles.mainLayout}>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}; 