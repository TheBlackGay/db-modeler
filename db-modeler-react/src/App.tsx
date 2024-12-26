import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, theme as antdTheme, Layout, Menu } from 'antd';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { store } from './store';
import AppRouter from './router/AppRouter';
import { GlobalStyles } from './styles/GlobalStyles';
import { animeTheme } from './styles/anime-theme';
import SoundControl from './components/anime/SoundControl';
import SakuraEffect from './components/anime/SakuraEffect';
import { Mascot } from './components/anime/Mascot';
import AchievementSystem from './components/anime/AchievementSystem';
import { Transition } from './components/anime/TransitionEffects';
import {
  ProjectOutlined,
  DatabaseOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  height: 64px;
`;

const Logo = styled(Link)`
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px;
  color: var(--anime-primary);
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: var(--anime-primary-hover);
  }
`;

const StyledContent = styled(Content)`
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  background: var(--anime-background);
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const NavigationMenu = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: '项目管理',
    },
    {
      key: '/connections',
      icon: <DatabaseOutlined />,
      label: '数据库连接',
    },
    {
      key: '/api',
      icon: <ApiOutlined />,
      label: 'API 管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems.map(item => ({
        ...item,
        label: <Link to={item.key}>{item.label}</Link>,
      }))}
      style={{ flex: 1, border: 'none' }}
    />
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: animeTheme.colors.primary,
            borderRadius: 8,
          },
        }}
      >
        <ThemeProvider theme={animeTheme}>
          <GlobalStyles />
          <BrowserRouter>
            <StyledLayout>
              <StyledHeader>
                <Logo to="/">DB Modeler</Logo>
                <NavigationMenu />
                <AchievementSystem />
              </StyledHeader>
              <StyledContent>
                <Transition type="fade">
                  <SakuraEffect />
                  <Mascot />
                  <SoundControl />
                  <AppRouter />
                </Transition>
              </StyledContent>
            </StyledLayout>
          </BrowserRouter>
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App; 