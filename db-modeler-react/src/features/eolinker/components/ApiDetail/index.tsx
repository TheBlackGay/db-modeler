import React from 'react';
import { Empty, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import { ApiInfo } from '../ApiInfo';
import { ApiParamList } from '../ApiParamList';
import { ApiResponseList } from '../ApiResponseList';
import { MockConfigList } from '../MockConfigList';
import styles from './ApiDetail.module.scss';

export const ApiDetail: React.FC = () => {
  const { currentApi } = useSelector((state: RootState) => state.eolinker);

  if (!currentApi) {
    return (
      <div className={styles.empty}>
        <Empty description="请选择一个接口" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ApiInfo api={currentApi} />
      <Tabs
        items={[
          {
            key: 'params',
            label: '参数',
            children: <ApiParamList api={currentApi} />,
          },
          {
            key: 'responses',
            label: '响应',
            children: <ApiResponseList api={currentApi} />,
          },
          {
            key: 'mock',
            label: 'Mock',
            children: <MockConfigList api={currentApi} />,
          },
        ]}
      />
    </div>
  );
}; 