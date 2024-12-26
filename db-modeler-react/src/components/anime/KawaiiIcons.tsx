import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  HeartOutlined, 
  StarOutlined,
  SmileOutlined,
  CrownOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  BulbOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const IconWrapper = styled.span<{ animation?: 'bounce' | 'rotate' | 'pulse' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${props => props.theme.colors?.primary || '#ff69b4'};
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.animation === 'bounce' && `
    animation: ${bounce} 1s ease infinite;
  `}

  ${props => props.animation === 'rotate' && `
    animation: ${rotate} 2s linear infinite;
  `}

  ${props => props.animation === 'pulse' && `
    animation: ${pulse} 1s ease infinite;
  `}

  &:hover {
    transform: scale(1.2);
  }
`;

interface KawaiiIconProps {
  type: string;
  animation?: 'bounce' | 'rotate' | 'pulse';
  onClick?: () => void;
}

const iconMap = {
  heart: HeartOutlined,
  star: StarOutlined,
  smile: SmileOutlined,
  crown: CrownOutlined,
  gift: GiftOutlined,
  thunder: ThunderboltOutlined,
  rocket: RocketOutlined,
  bulb: BulbOutlined,
  fire: FireOutlined,
  trophy: TrophyOutlined,
};

export const KawaiiIcon: React.FC<KawaiiIconProps> = ({ 
  type, 
  animation,
  onClick 
}) => {
  const IconComponent = iconMap[type as keyof typeof iconMap];
  if (!IconComponent) return null;

  return (
    <IconWrapper animation={animation} onClick={onClick}>
      <IconComponent />
    </IconWrapper>
  );
};

// 预设组合
export const HeartIcon = (props: Omit<KawaiiIconProps, 'type'>) => (
  <KawaiiIcon type="heart" {...props} />
);

export const StarIcon = (props: Omit<KawaiiIconProps, 'type'>) => (
  <KawaiiIcon type="star" {...props} />
);

export const SmileIcon = (props: Omit<KawaiiIconProps, 'type'>) => (
  <KawaiiIcon type="smile" {...props} />
);

export const CrownIcon = (props: Omit<KawaiiIconProps, 'type'>) => (
  <KawaiiIcon type="crown" {...props} />
);

export const GiftIcon = (props: Omit<KawaiiIconProps, 'type'>) => (
  <KawaiiIcon type="gift" {...props} />
);

// 图标组
export const IconGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  
  ${IconWrapper} {
    &:hover {
      transform: scale(1.1) rotate(10deg);
    }
  }
`;

export default KawaiiIcon; 