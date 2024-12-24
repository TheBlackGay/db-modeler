import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const MascotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  cursor: pointer;
  animation: ${float} 3s ease-in-out infinite;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const SpeechBubble = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 10px;
  max-width: 200px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    right: 20px;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: white transparent;
  }
`;

const messages = [
  "欢迎来到数据库建模工具！需要帮助吗？",
  "点击左侧菜单可以创建新项目哦！",
  "拖拽表格之间的连线可以创建关系～",
  "有什么问题都可以问我呢！",
  "记得保存你的更改哦！",
  "需要帮助的时候随时叫我！",
];

const expressions = ['(｡◕‿◕｡)', '(◕‿◕✿)', '(｡♥‿♥｡)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '(◠‿◠✿)', '(≧◡≦)'];

export const Mascot: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [expression, setExpression] = useState(expressions[0]);

  useEffect(() => {
    // 随机显示消息
    const interval = setInterval(() => {
      if (!isMessageVisible && Math.random() > 0.7) {
        showRandomMessage();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isMessageVisible]);

  const showRandomMessage = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
    setMessage(randomMessage);
    setExpression(randomExpression);
    setIsMessageVisible(true);
    setTimeout(() => setIsMessageVisible(false), 4000);
  };

  const handleClick = () => {
    showRandomMessage();
  };

  return (
    <MascotContainer onClick={handleClick}>
      <SpeechBubble className={isMessageVisible ? 'visible' : ''}>
        {message}
      </SpeechBubble>
      <div style={{ fontSize: '48px', textAlign: 'center' }}>
        {expression}
      </div>
    </MascotContainer>
  );
};

export default Mascot; 