import React from 'react';
import { Modal, Tabs, Progress, Tooltip } from 'antd';
import styled, { keyframes } from 'styled-components';
import { Achievement } from './AchievementSystem';

const shine = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const BadgeCard = styled.div<{ $unlocked: boolean }>`
  position: relative;
  background: ${props => props.$unlocked ? 'linear-gradient(45deg, #FFB6C1, #FF69B4)' : '#f0f0f0'};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  
  ${props => props.$unlocked && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: ${shine} 2s infinite;
    }
  `}

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
    animation: ${float} 2s ease infinite;
  }

  .icon {
    font-size: 32px;
    margin-bottom: 10px;
    color: ${props => props.$unlocked ? 'white' : '#999'};
  }

  .title {
    font-size: 14px;
    font-weight: bold;
    color: ${props => props.$unlocked ? 'white' : '#666'};
    margin-bottom: 5px;
  }

  .description {
    font-size: 12px;
    color: ${props => props.$unlocked ? 'rgba(255, 255, 255, 0.8)' : '#999'};
  }

  ${props => !props.$unlocked && `
    filter: grayscale(1);
    opacity: 0.7;
  `}
`;

const StatsContainer = styled.div`
  padding: 20px;

  .stat-row {
    margin-bottom: 20px;
  }

  .stat-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: #666;
  }
`;

interface AchievementModalProps {
  visible: boolean;
  onClose: () => void;
  achievements: Achievement[];
  unlockedAchievements: string[];
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  visible,
  onClose,
  achievements,
  unlockedAchievements
}) => {
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const completionRate = (unlockedCount / totalAchievements) * 100;

  const items = [
    {
      key: 'badges',
      label: '成就徽章',
      children: (
        <BadgeGrid>
          {achievements.map(achievement => (
            <Tooltip
              key={achievement.id}
              title={achievement.description}
              placement="top"
            >
              <BadgeCard $unlocked={unlockedAchievements.includes(achievement.id)}>
                <div className="icon">{achievement.icon}</div>
                <div className="title">{achievement.title}</div>
                <div className="description">{achievement.description}</div>
              </BadgeCard>
            </Tooltip>
          ))}
        </BadgeGrid>
      ),
    },
    {
      key: 'stats',
      label: '统计数据',
      children: (
        <StatsContainer>
          <div className="stat-row">
            <div className="stat-title">
              <span>总体完成度</span>
              <span>{unlockedCount}/{totalAchievements}</span>
            </div>
            <Progress 
              percent={completionRate} 
              strokeColor="#ff69b4"
              size="small"
            />
          </div>
          {/* 可以添加更多统计数据 */}
        </StatsContainer>
      ),
    },
  ];

  return (
    <Modal
      title="成就系统"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Tabs items={items} />
    </Modal>
  );
};

export default AchievementModal; 