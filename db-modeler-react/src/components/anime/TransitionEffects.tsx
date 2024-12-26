import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const popIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const FadeInContainer = styled.div<{ delay?: number }>`
  animation: ${fadeIn} 0.5s ease-out ${props => props.delay || 0}s both;
`;

const SlideInContainer = styled.div<{ delay?: number }>`
  animation: ${slideIn} 0.5s ease-out ${props => props.delay || 0}s both;
`;

const PopInContainer = styled.div<{ delay?: number }>`
  animation: ${popIn} 0.5s ease-out ${props => props.delay || 0}s both;
`;

interface TransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'pop';
  delay?: number;
}

export const Transition: React.FC<TransitionProps> = ({ 
  children, 
  type = 'fade',
  delay = 0 
}) => {
  const Container = {
    fade: FadeInContainer,
    slide: SlideInContainer,
    pop: PopInContainer
  }[type];

  return <Container delay={delay}>{children}</Container>;
};

// 创建一个动画包装器，可以给任何组件添加动画效果
export const withTransition = (
  WrappedComponent: React.ComponentType<any>,
  type: 'fade' | 'slide' | 'pop' = 'fade',
  delay: number = 0
) => {
  return (props: any) => (
    <Transition type={type} delay={delay}>
      <WrappedComponent {...props} />
    </Transition>
  );
};

export default Transition; 