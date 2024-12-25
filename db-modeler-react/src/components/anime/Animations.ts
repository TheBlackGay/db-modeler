import { css, keyframes } from 'styled-components';

export const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

export const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const shakeAnimation = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

export const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const sparkleAnimation = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
`;

export const hoverAnimation = css`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const buttonAnimation = css`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    animation: ${pulseAnimation} 0.3s ease;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const cardAnimation = css`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px) rotate(1deg);
    box-shadow: 0 8px 24px rgba(255, 105, 180, 0.2);
    animation: ${floatAnimation} 3s ease infinite;
  }
`;

export const loadingAnimation = css`
  animation: ${bounceAnimation} 1s ease infinite;
`;

export const sparkleEffect = css`
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 105, 180, 0.6);
    animation: ${sparkleAnimation} 1.5s ease infinite;
  }
  
  &::before {
    top: -5px;
    left: -5px;
  }
  
  &::after {
    bottom: -5px;
    right: -5px;
    animation-delay: 0.75s;
  }
`; 