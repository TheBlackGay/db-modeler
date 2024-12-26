import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { message } from 'antd';
import { 
  TrophyOutlined, 
  StarOutlined, 
  HeartOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  BookOutlined,
  TableOutlined,
  ApiOutlined,
  CodeOutlined,
  TeamOutlined,
  CalendarOutlined,
  FireOutlined,
  RocketOutlined,
  ExperimentOutlined,
  SafetyCertificateOutlined,
  BulbOutlined,
  CloudOutlined,
  ToolOutlined,
  GiftOutlined,
  SmileOutlined
} from '@ant-design/icons';
import AchievementButton from './AchievementButton';
import AchievementModal from './AchievementModal';

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  10% {
    transform: translateX(0);
    opacity: 1;
  }
  90% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: linear-gradient(45deg, #FFB6C1, #FF69B4);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: ${slideIn} 4s ease-in-out forwards;

  .icon {
    font-size: 24px;
  }
`;

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: () => boolean;
  category: string;
  points: number;
  type: 'normal' | 'daily' | 'weekly' | 'monthly' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: 'first_project',
    title: '初次启程',
    description: '创建你的第一个项目',
    icon: <StarOutlined />,
    condition: () => true,
    category: '入门',
    points: 10,
    type: 'normal',
    rarity: 'common'
  },
  {
    id: 'five_tables',
    title: '数据大师',
    description: '在一个项目中创建5个表',
    icon: <TableOutlined />,
    condition: () => false,
    category: '建模',
    points: 20,
    type: 'normal',
    rarity: 'common'
  },
  {
    id: 'complex_relation',
    title: '关系专家',
    description: '创建一个复杂的表关系',
    icon: <HeartOutlined />,
    condition: () => false,
    category: '建模',
    points: 30,
    type: 'normal',
    rarity: 'rare'
  },
  {
    id: 'master',
    title: '建模大师',
    description: '完成一个完整的数据库设计',
    icon: <CrownOutlined />,
    condition: () => false,
    category: '建模',
    points: 50,
    type: 'normal',
    rarity: 'epic'
  },
  {
    id: 'speed',
    title: '疾速建模者',
    description: '10分钟内完成一个模型',
    icon: <ThunderboltOutlined />,
    condition: () => false,
    category: '速度',
    points: 30,
    type: 'normal',
    rarity: 'common'
  },
  {
    id: 'documentation',
    title: '完美文档',
    description: '为所有表添加完整的注释',
    icon: <BookOutlined />,
    condition: () => false,
    category: '文档',
    points: 20,
    type: 'normal',
    rarity: 'common'
  },
  {
    id: 'api_design',
    title: 'API达人',
    description: '生成完整的API文档',
    icon: <ApiOutlined />,
    condition: () => false,
    category: 'API',
    points: 25,
    type: 'normal',
    rarity: 'rare'
  },
  {
    id: 'code_generation',
    title: '代码生成器',
    description: '使用代码生成功能',
    icon: <CodeOutlined />,
    condition: () => false,
    category: '代码',
    points: 15,
    type: 'normal',
    rarity: 'common'
  },
  {
    id: 'team_player',
    title: '团队玩家',
    description: '分享一个项目给其他用户',
    icon: <TeamOutlined />,
    condition: () => false,
    category: '团队',
    points: 20,
    type: 'normal',
    rarity: 'common'
  },
  {
    id: 'perfect',
    title: '完美主义者',
    description: '获得所有其他成就',
    icon: <TrophyOutlined />,
    condition: () => false,
    category: '特殊',
    points: 100,
    type: 'special',
    rarity: 'legendary'
  },
  {
    id: 'daily_login',
    title: '每日签到',
    description: '每日登录系统',
    icon: <CalendarOutlined />,
    condition: () => false,
    category: '日常',
    points: 5,
    type: 'daily',
    rarity: 'common'
  },
  {
    id: 'daily_create',
    title: '日常创造',
    description: '每日创建或修改一个表',
    icon: <FireOutlined />,
    condition: () => false,
    category: '日常',
    points: 10,
    type: 'daily',
    rarity: 'common'
  },
  {
    id: 'daily_perfect',
    title: '完美的一天',
    description: '一天内完成所有每日任务',
    icon: <CrownOutlined />,
    condition: () => false,
    category: '日常',
    points: 30,
    type: 'daily',
    rarity: 'rare'
  },
  {
    id: 'weekly_project',
    title: '周计划达人',
    description: '一周内创建3个项目',
    icon: <RocketOutlined />,
    condition: () => false,
    category: '周常',
    points: 50,
    type: 'weekly',
    rarity: 'rare'
  },
  {
    id: 'weekly_tables',
    title: '高产开发者',
    description: '一周内创建20个表',
    icon: <ExperimentOutlined />,
    condition: () => false,
    category: '周常',
    points: 100,
    type: 'weekly',
    rarity: 'epic'
  },
  {
    id: 'monthly_master',
    title: '月度建模大师',
    description: '一个月内完成10个完整的数据库设计',
    icon: <SafetyCertificateOutlined />,
    condition: () => false,
    category: '月常',
    points: 200,
    type: 'monthly',
    rarity: 'legendary'
  },
  {
    id: 'innovation',
    title: '创新先锋',
    description: '使用所有高级建模功能',
    icon: <BulbOutlined />,
    condition: () => false,
    category: '特殊',
    points: 50,
    type: 'special',
    rarity: 'epic'
  },
  {
    id: 'cloud_master',
    title: '云端专家',
    description: '成功导出并部署数据库',
    icon: <CloudOutlined />,
    condition: () => false,
    category: '特殊',
    points: 100,
    type: 'special',
    rarity: 'epic'
  },
  {
    id: 'tool_expert',
    title: '工具达人',
    description: '使用所有辅助工具',
    icon: <ToolOutlined />,
    condition: () => false,
    category: '特殊',
    points: 30,
    type: 'special',
    rarity: 'rare'
  },
  {
    id: 'hidden_gift',
    title: '惊喜发现',
    description: '发现一个隐藏功能',
    icon: <GiftOutlined />,
    condition: () => false,
    category: '隐藏',
    points: 50,
    type: 'special',
    rarity: 'legendary'
  },
  {
    id: 'happy_modeler',
    title: '快乐建模者',
    description: '连续使用系统30天',
    icon: <SmileOutlined />,
    condition: () => false,
    category: '隐藏',
    points: 100,
    type: 'special',
    rarity: 'legendary'
  }
];

interface AchievementSystemProps {
  onAchievement?: (achievement: Achievement) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ onAchievement }) => {
  const [notification, setNotification] = useState<Achievement | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [hasNewAchievement, setHasNewAchievement] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // 检查成就
    const checkAchievements = () => {
      achievements.forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id) && achievement.condition()) {
          setUnlockedAchievements(prev => [...prev, achievement.id]);
          setNotification(achievement);
          setHasNewAchievement(true);
          onAchievement?.(achievement);
          
          // 播放可爱的音效
          const audio = new Audio('/achievement.mp3');
          audio.play().catch(() => {});

          // 显示成就通知
          message.success({
            content: (
              <div>
                🎉 解锁成就：{achievement.title}
                <div style={{ fontSize: '12px' }}>
                  {achievement.description} (+{achievement.points}点)
                </div>
              </div>
            ),
            icon: achievement.icon,
            duration: 3,
          });
        }
      });
    };

    const interval = setInterval(checkAchievements, 5000);
    return () => clearInterval(interval);
  }, [unlockedAchievements, onAchievement]);

  const handleModalOpen = () => {
    setIsModalVisible(true);
    setHasNewAchievement(false);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <AchievementButton 
        hasNewAchievement={hasNewAchievement}
        onClick={handleModalOpen}
      />
      
      <AchievementModal
        visible={isModalVisible}
        onClose={handleModalClose}
        achievements={achievements}
        unlockedAchievements={unlockedAchievements}
      />

      {notification && (
        <NotificationContainer onAnimationEnd={() => setNotification(null)}>
          <span className="icon">{notification.icon}</span>
          <div>
            <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
            <div style={{ fontSize: '0.9em' }}>
              {notification.description} (+{notification.points}点)
            </div>
          </div>
        </NotificationContainer>
      )}
    </>
  );
};

export default AchievementSystem; 