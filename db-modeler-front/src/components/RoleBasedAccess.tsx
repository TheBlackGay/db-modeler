import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/store';
import { Result, Button } from 'antd';

interface RoleBasedAccessProps {
  requiredRoles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  requiredRoles = [],
  children,
  fallback
}) => {
  const user = useRecoilValue(userState);

  const hasRequiredRole = () => {
    if (!requiredRoles.length) return true;
    return requiredRoles.includes(user?.role || 'user');
  };

  if (!hasRequiredRole()) {
    return fallback || (
      <Result
        status="403"
        title="权限不足"
        subTitle="您没有权限访问此页面"
        extra={
          <Button type="primary" href="/dashboard">
            返回仪表盘
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
