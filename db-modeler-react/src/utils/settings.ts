interface ThemeSettings {
  darkMode: boolean;
  primaryColor: string;
  compactMode: boolean;
}

interface DatabaseSettings {
  connectionTimeout: number;
  maxConnections: number;
  defaultDatabase: 'mysql' | 'postgresql' | 'sqlserver' | 'oracle';
  sslEnabled: boolean;
}

interface ExportSettings {
  indentStyle: 'space' | 'tab';
  indentSize: number;
  lineEnding: 'lf' | 'crlf';
  upperCase: boolean;
}

export interface SystemSettings {
  theme: ThemeSettings;
  database: DatabaseSettings;
  export: ExportSettings;
}

const SETTINGS_KEY = 'system_settings';

export const defaultSettings: SystemSettings = {
  theme: {
    darkMode: false,
    primaryColor: '#1890ff',
    compactMode: false,
  },
  database: {
    connectionTimeout: 30,
    maxConnections: 10,
    defaultDatabase: 'mysql',
    sslEnabled: true,
  },
  export: {
    indentStyle: 'space',
    indentSize: 2,
    lineEnding: 'lf',
    upperCase: false,
  },
};

class SettingsManager {
  private settings: SystemSettings;
  private listeners: Set<(settings: SystemSettings) => void>;

  constructor() {
    this.listeners = new Set();
    this.settings = this.loadSettings();
  }

  // 加载设置
  private loadSettings(): SystemSettings {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('加载设置失败:', error);
      return defaultSettings;
    }
  }

  // 保存设置
  private saveSettings(settings: SystemSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      this.settings = settings;
      this.notifyListeners();
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  }

  // 获取所有设置
  getSettings(): SystemSettings {
    return { ...this.settings };
  }

  // 更新设置
  updateSettings(newSettings: Partial<SystemSettings>): void {
    this.saveSettings({
      ...this.settings,
      ...newSettings,
    });
  }

  // 更新主题设置
  updateTheme(theme: Partial<ThemeSettings>): void {
    this.saveSettings({
      ...this.settings,
      theme: {
        ...this.settings.theme,
        ...theme,
      },
    });
  }

  // 更新数据库设置
  updateDatabase(database: Partial<DatabaseSettings>): void {
    this.saveSettings({
      ...this.settings,
      database: {
        ...this.settings.database,
        ...database,
      },
    });
  }

  // 更新导出设置
  updateExport(exportSettings: Partial<ExportSettings>): void {
    this.saveSettings({
      ...this.settings,
      export: {
        ...this.settings.export,
        ...exportSettings,
      },
    });
  }

  // 重置设置
  resetSettings(): void {
    this.saveSettings(defaultSettings);
  }

  // 添加监听器
  addListener(listener: (settings: SystemSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 通知所有监听器
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.settings));
  }

  // 应用主题设置
  applyTheme(): void {
    const { darkMode, primaryColor, compactMode } = this.settings.theme;
    
    // 应用深色模式
    document.documentElement.classList.toggle('dark', darkMode);
    
    // 应用主题色
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    
    // 应用紧凑模式
    document.documentElement.classList.toggle('compact', compactMode);
  }
}

export const settingsManager = new SettingsManager(); 