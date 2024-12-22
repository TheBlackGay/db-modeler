import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// 懒加载页面组件
const InterfaceList = lazy(() => import('./list/InterfaceList'));
const InterfaceDetail = lazy(() => import('./detail/InterfaceDetail'));
const InterfaceEdit = lazy(() => import('./edit/InterfaceEdit'));
const InterfaceMonitor = lazy(() => import('./monitor/InterfaceMonitor'));
const InterfaceDebug = lazy(() => import('./debug/InterfaceDebug'));

/**
 * 接口管理模块路由配置
 */
export const interfaceRoutes: RouteObject[] = [
  {
    path: '/interface',
    children: [
      {
        path: 'list',
        element: <InterfaceList />,
        index: true,
      },
      {
        path: 'detail/:id',
        element: <InterfaceDetail />,
      },
      {
        path: 'edit/:id?',
        element: <InterfaceEdit />,
      },
      {
        path: 'monitor/:id',
        element: <InterfaceMonitor />,
      },
      {
        path: 'debug/:id',
        element: <InterfaceDebug />,
      },
    ],
  },
]; 