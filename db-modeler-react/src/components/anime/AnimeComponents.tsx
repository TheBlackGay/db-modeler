import React from 'react';
import styled, { keyframes } from 'styled-components';

// 可爱的按钮组件
export const KawaiiButton = styled.button`
  background: var(--anime-primary);
  color: white;
  border: none;
  border-radius: var(--anime-border-radius);
  padding: 8px 16px;
  cursor: pointer;
  transition: var(--anime-transition);
  font-family: var(--anime-font-family);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    &::after {
      content: "✨";
      position: absolute;
      right: 10px;
      animation: sparkle 1s infinite;
    }
  }
`;

// 可爱的输入框
export const KawaiiInput = styled.input`
  border: 2px solid var(--anime-secondary);
  border-radius: var(--anime-border-radius);
  padding: 8px 12px;
  transition: var(--anime-transition);
  font-family: var(--anime-font-family);

  &:focus {
    border-color: var(--anime-primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }
`;

// 可爱的卡片组件
export const KawaiiCard = styled.div`
  background: white;
  border-radius: var(--anime-border-radius);
  padding: 16px;
  box-shadow: var(--anime-box-shadow);
  transition: var(--anime-transition);

  &:hover {
    transform: translateY(-4px);
  }
`;

// 加载动画组件
const loadingAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const KawaiiLoading: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <span role="img" aria-label="loading" style={{
      display: 'inline-block',
      animation: `${loadingAnimation} 1s infinite linear`,
      fontSize: '24px'
    }}>
      🌸
    </span>
  </div>
);

// 提示框组件
export const KawaiiTooltip = styled.div`
  position: relative;
  display: inline-block;

  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    background: var(--anime-primary);
    color: white;
    border-radius: var(--anime-border-radius);
    font-size: 14px;
    white-space: nowrap;
  }
`;

// 可爱的标签组件
export const KawaiiTag = styled.span`
  background: var(--anime-secondary);
  color: var(--anime-text);
  padding: 4px 8px;
  border-radius: var(--anime-border-radius);
  font-size: 12px;
  margin: 0 4px;
`;

// 可爱的导航菜单
export const KawaiiNav = styled.nav`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 12px;
  border-bottom: 1px solid var(--anime-secondary);
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 可爱的头像组件
export const KawaiiAvatar = styled.div<{ src: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  border: 2px solid var(--anime-primary);
  transition: var(--anime-transition);

  &:hover {
    transform: scale(1.1);
  }
`;

// 可爱的进度条
export const KawaiiProgress = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: var(--anime-secondary);
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: var(--anime-primary);
    transition: width 0.3s ease;
  }
`;

// 可爱的消息提示
export const KawaiiMessage = styled.div<{ type?: 'success' | 'error' | 'info' }>`
  padding: 12px;
  border-radius: var(--anime-border-radius);
  margin: 8px 0;
  position: relative;
  padding-left: 36px;

  &::before {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
  }

  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: #E8F5E9;
          color: #2E7D32;
          &::before { content: '✨'; }
        `;
      case 'error':
        return `
          background: #FFEBEE;
          color: #C62828;
          &::before { content: '💢'; }
        `;
      default:
        return `
          background: #E3F2FD;
          color: #1565C0;
          &::before { content: '💭'; }
        `;
    }
  }}
`; 