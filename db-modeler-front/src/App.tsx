import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { ConfigProvider } from 'antd';
import { userState } from '@/store';
import AuthPersist from '@/components/AuthPersist';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import DatabaseDetail from '@/pages/DatabaseDetail';
import TableSchemaDesigner from '@/pages/TableSchemaDesigner';
import UserProfile from '@/pages/UserProfile';
import AdminDashboard from '@/pages/AdminDashboard';
import AuditLogs from '@/pages/AuditLogs';
import RoleBasedAccess from '@/components/RoleBasedAccess';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useRecoilValue(userState) || {};
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <ConfigProvider>
        <BrowserRouter>
          <AuthPersist>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/database/:id"
                element={
                  <PrivateRoute>
                    <DatabaseDetail />
                  </PrivateRoute>
                }
              />

              <Route
                path="/table-schema/:id"
                element={
                  <PrivateRoute>
                    <TableSchemaDesigner />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <RoleBasedAccess requiredRole="admin">
                      <AdminDashboard />
                    </RoleBasedAccess>
                  </PrivateRoute>
                }
              />

              <Route
                path="/audit-logs"
                element={
                  <PrivateRoute>
                    <RoleBasedAccess requiredRole="admin">
                      <AuditLogs />
                    </RoleBasedAccess>
                  </PrivateRoute>
                }
              />

              {/* 将所有未匹配的路由重定向到首页 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthPersist>
        </BrowserRouter>
      </ConfigProvider>
    </RecoilRoot>
  );
};

export default App;
