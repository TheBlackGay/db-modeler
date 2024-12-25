import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const fall = keyframes`
  0% {
    opacity: 1;
    top: -10%;
    transform: translateX(0) rotateZ(0deg);
  }
  25% {
    opacity: 0.8;
    transform: translateX(100px) rotateZ(45deg);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-100px) rotateZ(90deg);
  }
  75% {
    opacity: 0.4;
    transform: translateX(100px) rotateZ(135deg);
  }
  100% {
    opacity: 0;
    top: 110%;
    transform: translateX(-100px) rotateZ(180deg);
  }
`;

const Petal = styled.div<{ $delay: number; $left: number; $size: number }>`
  position: fixed;
  z-index: 999;
  top: -10%;
  left: ${props => props.$left}%;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: #ffd1dc;
  border-radius: 150% 0 150% 0;
  animation: ${fall} 10s linear infinite;
  animation-delay: ${props => props.$delay}s;
  transform-origin: center;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: -14%;
    left: -10%;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    transform: rotate(15deg);
  }
`;

const SakuraEffect: React.FC = () => {
  const petalsRef = useRef<{ delay: number; left: number; size: number }[]>([]);

  useEffect(() => {
    // 创建 20 个樱花瓣
    petalsRef.current = Array.from({ length: 20 }, () => ({
      delay: Math.random() * 10,
      left: Math.random() * 100,
      size: Math.random() * 10 + 10,
    }));
  }, []);

  return (
    <>
      {petalsRef.current.map((petal, index) => (
        <Petal
          key={index}
          $delay={petal.delay}
          $left={petal.left}
          $size={petal.size}
        />
      ))}
    </>
  );
};

export default SakuraEffect; 