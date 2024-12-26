import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  userLoggedIn,
  unlockAchievement,
  resetDailyStats,
  resetWeeklyStats,
  resetMonthlyStats
} from '../../store/features/achievementSlice';
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
  const [hasNewAchievement, setHasNewAchievement] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 使用Redux状态
  const { stats, unlockedAchievements } = useSelector((state: RootState) => state.achievement);
  const dispatch = useDispatch();

  // 初始化成就系统
  useEffect(() => {
    dispatch(userLoggedIn());
  }, [dispatch]);

  // 检查成就
  useEffect(() => {
    const checkAchievements = () => {
      console.log('开始检查成就:', {
        currentStats: stats,
        unlockedAchievements,
        currentProjectId: stats.currentProjectId
      });

      achievements.forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id)) {
          let shouldUnlock = false;
          
          // 检查各种成就条件
          switch (achievement.id) {
            case 'first_project':
              shouldUnlock = stats.projectsCreated > 0;
              console.log('检查首个项目成就:', {
                projectsCreated: stats.projectsCreated,
                shouldUnlock
              });
              break;
            case 'five_tables':
              // 只有在有当前项目时才检查
              if (stats.currentProjectId) {
                shouldUnlock = stats.tablesInCurrentProject >= 5;
                console.log('检查五表成就:', {
                  achievementId: achievement.id,
                  currentProjectId: stats.currentProjectId,
                  tablesInCurrentProject: stats.tablesInCurrentProject,
                  totalTables: stats.tablesCreated,
                  shouldUnlock
                });
              }
              break;
            case 'complex_relation':
              // 检查当前项目的复杂关系
              if (stats.currentProjectId) {
                shouldUnlock = stats.relationsCreated >= 2;
                console.log('检查复杂关系成就:', {
                  currentProjectId: stats.currentProjectId,
                  relationsCreated: stats.relationsCreated,
                  shouldUnlock
                });
              }
              break;
            case 'master':
              shouldUnlock = stats.documentsCompleted > 0;
              break;
            case 'speed':
              shouldUnlock = stats.projectsCreated > 0; // 这个在 projectsSlice 中单独处理
              break;
            case 'documentation':
              shouldUnlock = stats.documentsCompleted > 0;
              break;
            case 'api_design':
              shouldUnlock = stats.apiGenerated;
              break;
            case 'code_generation':
              shouldUnlock = stats.codeGenerated;
              break;
            case 'team_player':
              shouldUnlock = stats.projectsShared > 0;
              break;
            case 'daily_login':
              shouldUnlock = stats.lastLoginDate === new Date().toISOString().split('T')[0];
              break;
            case 'daily_create':
              shouldUnlock = stats.todayChanges > 0;
              break;
            case 'daily_perfect':
              shouldUnlock = stats.lastLoginDate === new Date().toISOString().split('T')[0] && 
                            stats.todayChanges > 0;
              break;
            case 'weekly_project':
              shouldUnlock = stats.weeklyProjects >= 3;
              break;
            case 'weekly_tables':
              shouldUnlock = stats.weeklyTables >= 20;
              break;
            case 'monthly_master':
              shouldUnlock = stats.monthlyCompletions >= 10;
              break;
            case 'innovation':
              const requiredFeatures = ['indexes', 'constraints', 'triggers', 'procedures'];
              shouldUnlock = requiredFeatures.every(feature => 
                stats.usedFeatures.includes(feature)
              );
              break;
            case 'cloud_master':
              shouldUnlock = stats.deploymentSuccess;
              break;
            case 'tool_expert':
              const requiredTools = ['import', 'export', 'validate', 'optimize'];
              shouldUnlock = requiredTools.every(tool => 
                stats.usedTools.includes(tool)
              );
              break;
            case 'hidden_gift':
              shouldUnlock = stats.discoveredHidden;
              break;
            case 'happy_modeler':
              shouldUnlock = stats.loginStreak >= 30;
              break;
            case 'perfect':
              const otherAchievements = achievements.filter(a => a.id !== 'perfect');
              shouldUnlock = otherAchievements.every(a => 
                unlockedAchievements.includes(a.id)
              );
              break;
          }

          if (shouldUnlock) {
            console.log('准备解锁成就:', {
              achievementId: achievement.id,
              achievement: achievement,
              currentStats: stats,
              currentProjectId: stats.currentProjectId
            });

            dispatch(unlockAchievement(achievement.id));
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

            console.log('成就解锁完成:', {
              achievementId: achievement.id,
              newUnlockedAchievements: [...unlockedAchievements, achievement.id],
              currentProjectId: stats.currentProjectId
            });
          }
        }
      });
    };

    // 每5秒检查一次成就
    console.log('设置成就检查定时器');
    const interval = setInterval(checkAchievements, 5000);
    
    // 立即执行一次检查
    checkAchievements();

    return () => {
      console.log('清理成就检查定时器');
      clearInterval(interval);
    };
  }, [dispatch, onAchievement, stats, unlockedAchievements]);

  // 每天0点重置每日统计
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeToReset = tomorrow.getTime() - now.getTime();

    const resetTimer = setTimeout(() => {
      dispatch(resetDailyStats());
    }, timeToReset);

    return () => clearTimeout(resetTimer);
  }, [dispatch]);

  // 每周一0点重置每周统计
  useEffect(() => {
    const now = new Date();
    const daysUntilMonday = (8 - now.getDay()) % 7;
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    const timeToReset = nextMonday.getTime() - now.getTime();

    const resetTimer = setTimeout(() => {
      dispatch(resetWeeklyStats());
    }, timeToReset);

    return () => clearTimeout(resetTimer);
  }, [dispatch]);

  // 每月1号0点重置每月统计
  useEffect(() => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const timeToReset = nextMonth.getTime() - now.getTime();

    const resetTimer = setTimeout(() => {
      dispatch(resetMonthlyStats());
    }, timeToReset);

    return () => clearTimeout(resetTimer);
  }, [dispatch]);

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