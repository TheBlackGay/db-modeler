import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: !isDev,
    },
  });

  // 加载应用
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // Vite 默认开发端口
    mainWindow.webContents.openDevTools(); // 打开开发工具
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(createWindow);

// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 在这里处理与渲染进程的通信
ipcMain.on('api-request', async (event, { method, url, headers, data }) => {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    const responseData = await response.json();
    event.reply('api-response', {
      status: response.status,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error: any) {
    event.reply('api-response', {
      error: error?.message || '未知错误',
    });
  }
}); 