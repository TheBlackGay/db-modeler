import React, { useEffect, useState } from 'react';
import Live2DConfig from './Live2DConfig';

interface Live2DProps {
  position?: 'right' | 'left';
}

interface Live2DSettings {
  position: 'right' | 'left';
  size: number;
  model: string;
}

const MODEL_PATHS: Record<string, { path: string; textures: string[] }> = {
  shizuku: {
    path: 'shizuku',
    textures: ['default-costume'],
  },
  miku: {
    path: 'miku',
    textures: ['default-costume'],
  },
  epsilon: {
    path: 'epsilon',
    textures: ['default-costume'],
  },
  haru: {
    path: 'haru',
    textures: ['default-costume'],
  },
  chitose: {
    path: 'chitose',
    textures: ['default-costume'],
  },
  rem: {
    path: 'rem',
    textures: ['default-costume'],
  },
  asuna: {
    path: 'asuna',
    textures: ['default-costume'],
  },
};

const Live2D: React.FC<Live2DProps> = ({
  position: initialPosition = 'right'
}) => {
  const [settings, setSettings] = useState<Live2DSettings>({
    position: initialPosition,
    size: 280,
    model: 'shizuku'
  });

  useEffect(() => {
    // 清理旧的实例
    const cleanup = () => {
      const live2d = document.getElementById('waifu');
      if (live2d) {
        live2d.remove();
      }
      const oldScript = document.getElementById('live2d-widget');
      if (oldScript) {
        oldScript.remove();
      }
      // 清理所有相关的全局变量
      delete (window as any).live2d_settings;
      delete (window as any).live2d_path;
      delete (window as any).loadWidget;
    };

    cleanup();

    // 配置live2d-widget
    (window as any).live2d_settings = {
      modelId: MODEL_PATHS[settings.model]?.path || 'shizuku',
      modelTexturesId: 0,
      modelStorage: false,
      canCloseLive2d: true,
      canTurnToHomePage: true,
      canTurnToAboutPage: true,
      waifuSize: settings.size,
      waifuTipsSize: 250,
      waifuFontSize: 12,
      waifuToolFont: 14,
      waifuToolLine: 20,
      waifuToolTop: 0,
      waifuMinWidth: 768,
      waifuEdgeSide: settings.position,
      waifuDraggable: 'unlimited',
      waifuDraggableRevert: true,
      homePageUrl: '/',
      aboutPageUrl: 'https://github.com/stevenjoezhang/live2d-widget',
      screenshotCaptureName: 'live2d.png',
    };

    // 加载autoload.js
    const script = document.createElement('script');
    script.id = 'live2d-widget';
    script.src = 'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js';
    document.body.appendChild(script);

    return cleanup;
  }, [settings]);

  const handleSettingsChange = (newSettings: Partial<Live2DSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <Live2DConfig 
      settings={settings}
      onSettingsChange={handleSettingsChange}
    />
  );
};

export default Live2D; 