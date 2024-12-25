import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { store } from './store';
import AppRouter from './router/AppRouter';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './theme';
import SoundControl from './components/anime/SoundControl';
import SakuraEffect from './components/anime/SakuraEffect';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: theme.colors.primary,
            borderRadius: 8,
          },
        }}
      >
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <BrowserRouter>
            <SakuraEffect />
            <SoundControl />
            <AppRouter />
          </BrowserRouter>
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  );
};

export default App; 