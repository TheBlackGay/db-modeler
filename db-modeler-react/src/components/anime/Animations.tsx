import { keyframes } from 'styled-components';

// 樱花飘落动画
export const sakuraFall = keyframes`
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
`;

// 闪烁动画
export const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
`;

// 弹跳动画
export const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// 淡入动画
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 旋转动画
export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// 心跳动画
export const heartbeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`;

// 波浪动画
export const wave = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-5px); }
`;

// 抖动动画
export const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
`;

// 渐变背景动画
export const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 打字机效果
export const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// 光标闪烁
export const blink = keyframes`
  from, to { border-color: transparent; }
  50% { border-color: var(--anime-primary); }
`; 