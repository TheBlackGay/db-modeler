import React, { useState } from 'react';
import { Modal, Tabs, Progress, Tooltip, Select, Badge, Space, Tag } from 'antd';
import styled, { keyframes, css } from 'styled-components';
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const BadgeCard = styled.div<{ $unlocked: boolean; $rarity: string }>`
  position: relative;
  background: ${props => {
    if (!props.$unlocked) return '#f0f0f0';
    switch (props.$rarity) {
      case 'legendary':
        return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'epic':
        return 'linear-gradient(45deg, #9400D3, #4B0082)';
      case 'rare':
        return 'linear-gradient(45deg, #1E90FF, #00BFFF)';
      default:
        return 'linear-gradient(45deg, #FFB6C1, #FF69B4)';
    }
  }};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  
  ${props => props.$unlocked && css`
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
    margin-bottom: 8px;
  }

  .points {
    font-size: 12px;
    color: ${props => props.$unlocked ? 'white' : '#666'};
    font-weight: bold;
  }

  ${props => !props.$unlocked && css`
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

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 20px;
  }

  .stat-card {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    text-align: center;
  }
`;

const FilterContainer = styled.div`
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 16px;
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
  const [filter, setFilter] = useState({
    type: 'all',
    rarity: 'all',
    category: 'all'
  });

  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const completionRate = (unlockedCount / totalAchievements) * 100;
  const totalPoints = achievements.reduce((sum, achievement) => 
    unlockedAchievements.includes(achievement.id) ? sum + achievement.points : sum, 0
  );

  const filteredAchievements = achievements.filter(achievement => {
    if (filter.type !== 'all' && achievement.type !== filter.type) return false;
    if (filter.rarity !== 'all' && achievement.rarity !== filter.rarity) return false;
    if (filter.category !== 'all' && achievement.category !== filter.category) return false;
    return true;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#9400D3';
      case 'rare': return '#1E90FF';
      default: return '#FF69B4';
    }
  };

  const items = [
    {
      key: 'badges',
      label: '成就徽章',
      children: (
        <>
          <FilterContainer>
            <Space>
              <span>类型:</span>
              <Select
                value={filter.type}
                onChange={value => setFilter(prev => ({ ...prev, type: value }))}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="normal">普通成就</Select.Option>
                <Select.Option value="daily">每日成就</Select.Option>
                <Select.Option value="weekly">每周成就</Select.Option>
                <Select.Option value="monthly">每月成就</Select.Option>
                <Select.Option value="special">特殊成就</Select.Option>
              </Select>
              <span>稀有度:</span>
              <Select
                value={filter.rarity}
                onChange={value => setFilter(prev => ({ ...prev, rarity: value }))}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="common">普通</Select.Option>
                <Select.Option value="rare">稀有</Select.Option>
                <Select.Option value="epic">史诗</Select.Option>
                <Select.Option value="legendary">传说</Select.Option>
              </Select>
              <span>分类:</span>
              <Select
                value={filter.category}
                onChange={value => setFilter(prev => ({ ...prev, category: value }))}
                style={{ width: 120 }}
              >
                <Select.Option value="all">全部</Select.Option>
                {Array.from(new Set(achievements.map(a => a.category))).map(category => (
                  <Select.Option key={category} value={category}>{category}</Select.Option>
                ))}
              </Select>
            </Space>
          </FilterContainer>
          <BadgeGrid>
            {filteredAchievements.map(achievement => (
              <Tooltip
                key={achievement.id}
                title={
                  <div>
                    <div>{achievement.description}</div>
                    <div style={{ marginTop: 8 }}>
                      <Tag color={getRarityColor(achievement.rarity)}>
                        {achievement.rarity.toUpperCase()}
                      </Tag>
                      <Tag color="#87d068">+{achievement.points} 点</Tag>
                    </div>
                  </div>
                }
                placement="top"
              >
                <BadgeCard 
                  $unlocked={unlockedAchievements.includes(achievement.id)}
                  $rarity={achievement.rarity}
                >
                  <div className="icon">{achievement.icon}</div>
                  <div className="title">{achievement.title}</div>
                  <div className="description">{achievement.description}</div>
                  <div className="points">+{achievement.points} 点</div>
                </BadgeCard>
              </Tooltip>
            ))}
          </BadgeGrid>
        </>
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
          <div className="stat-cards">
            <div className="stat-card">
              <h3>总积分</h3>
              <div style={{ fontSize: '24px', color: '#ff69b4' }}>{totalPoints}</div>
            </div>
            <div className="stat-card">
              <h3>已解锁成就</h3>
              <div style={{ fontSize: '24px', color: '#ff69b4' }}>{unlockedCount}</div>
            </div>
            <div className="stat-card">
              <h3>完成度</h3>
              <div style={{ fontSize: '24px', color: '#ff69b4' }}>{completionRate.toFixed(1)}%</div>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h3>成就分布</h3>
            {['legendary', 'epic', 'rare', 'common'].map(rarity => {
              const count = achievements.filter(a => a.rarity === rarity).length;
              const unlocked = achievements.filter(a => 
                a.rarity === rarity && unlockedAchievements.includes(a.id)
              ).length;
              return (
                <div key={rarity} style={{ marginBottom: '10px' }}>
                  <div className="stat-title">
                    <Badge color={getRarityColor(rarity)} text={rarity.toUpperCase()} />
                    <span>{unlocked}/{count}</span>
                  </div>
                  <Progress 
                    percent={(unlocked/count) * 100} 
                    strokeColor={getRarityColor(rarity)}
                    size="small"
                  />
                </div>
              );
            })}
          </div>
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
      width={1000}
    >
      <Tabs items={items} />
    </Modal>
  );
};

export default AchievementModal; 