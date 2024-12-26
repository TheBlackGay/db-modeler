import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Badge } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const StyledButton = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 8px;

  &:hover {
    transform: translateY(-2px);
  }

  &.has-new {
    animation: ${pulse} 2s ease infinite;
  }

  .anticon {
    font-size: 20px;
    color: ${props => props.theme.colors?.primary || '#ff69b4'};
  }
`;

interface AchievementButtonProps {
  hasNewAchievement?: boolean;
  onClick?: () => void;
}

const AchievementButton: React.FC<AchievementButtonProps> = ({
  hasNewAchievement = false,
  onClick
}) => {
  return (
    <StyledButton 
      className={hasNewAchievement ? 'has-new' : ''} 
      onClick={onClick}
    >
      <Badge 
        count={hasNewAchievement ? '新' : 0} 
        offset={[-5, 5]}
      >
        <TrophyOutlined />
      </Badge>
    </StyledButton>
  );
};

export default AchievementButton; 