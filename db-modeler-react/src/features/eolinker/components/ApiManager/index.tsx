import React from 'react';
import { Layout } from 'antd';
import { ApiList } from '../ApiList';
import { ApiDetail } from '../ApiDetail';
import styles from './ApiManager.module.scss';

const { Content, Sider } = Layout;

const ApiManager: React.FC = () => {
  return (
    <Layout className={styles.container}>
      <Sider width={300} className={styles.sider}>
        <ApiList />
      </Sider>
      <Content className={styles.content}>
        <ApiDetail />
      </Content>
    </Layout>
  );
};

export default ApiManager; 