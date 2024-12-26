import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AchievementState {
  unlockedAchievements: string[];
  stats: {
    projectsCreated: number;
    tablesCreated: number;
    tablesInCurrentProject: number;
    relationsCreated: number;
    documentsCompleted: number;
    apiGenerated: boolean;
    codeGenerated: boolean;
    projectsShared: number;
    lastLoginDate: string | null;
    loginStreak: number;
    todayChanges: number;
    weeklyProjects: number;
    weeklyTables: number;
    monthlyCompletions: number;
    usedFeatures: string[];
    usedTools: string[];
    deploymentSuccess: boolean;
    discoveredHidden: boolean;
    currentProjectId: string | null;
  };
}

const initialState: AchievementState = {
  unlockedAchievements: [],
  stats: {
    projectsCreated: 0,
    tablesCreated: 0,
    tablesInCurrentProject: 0,
    relationsCreated: 0,
    documentsCompleted: 0,
    apiGenerated: false,
    codeGenerated: false,
    projectsShared: 0,
    lastLoginDate: null,
    loginStreak: 0,
    todayChanges: 0,
    weeklyProjects: 0,
    weeklyTables: 0,
    monthlyCompletions: 0,
    usedFeatures: [],
    usedTools: [],
    deploymentSuccess: false,
    discoveredHidden: false,
    currentProjectId: null,
  }
};

const achievementSlice = createSlice({
  name: 'achievement',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      console.log('切换项目:', {
        oldProjectId: state.stats.currentProjectId,
        newProjectId: action.payload,
        oldTableCount: state.stats.tablesInCurrentProject
      });
      
      if (state.stats.currentProjectId !== action.payload) {
        state.stats.tablesInCurrentProject = 0;
        state.stats.currentProjectId = action.payload;
        
        console.log('项目切换后状态:', {
          currentProjectId: state.stats.currentProjectId,
          tablesInCurrentProject: state.stats.tablesInCurrentProject
        });
      }
    },
    projectCreated: (state) => {
      state.stats.projectsCreated += 1;
      state.stats.weeklyProjects += 1;
    },
    tableCreated: (state) => {
      state.stats.tablesCreated += 1;
      
      if (state.stats.currentProjectId) {
        state.stats.tablesInCurrentProject += 1;
        console.log('当前项目表格计数更新:', {
          currentProjectId: state.stats.currentProjectId,
          tablesInCurrentProject: state.stats.tablesInCurrentProject,
          unlockedAchievements: state.unlockedAchievements
        });

        // 检查是否达到5个表
        if (state.stats.tablesInCurrentProject >= 5 && 
            !state.unlockedAchievements.includes('five_tables')) {
          console.log('触发五表成就条件:', {
            currentProjectId: state.stats.currentProjectId,
            tablesInCurrentProject: state.stats.tablesInCurrentProject,
            hasAchievement: state.unlockedAchievements.includes('five_tables')
          });
          
          state.unlockedAchievements.push('five_tables');
          console.log('成就已解锁:', {
            achievementId: 'five_tables',
            unlockedAchievements: state.unlockedAchievements,
            currentProjectId: state.stats.currentProjectId
          });
        }
      }
      
      state.stats.weeklyTables += 1;
      state.stats.todayChanges += 1;

      console.log('创建表格后状态:', {
        totalTables: state.stats.tablesCreated,
        tablesInCurrentProject: state.stats.tablesInCurrentProject,
        weeklyTables: state.stats.weeklyTables,
        todayChanges: state.stats.todayChanges,
        currentProjectId: state.stats.currentProjectId,
        unlockedAchievements: state.unlockedAchievements
      });
    },
    relationCreated: (state) => {
      state.stats.relationsCreated += 1;
      state.stats.todayChanges += 1;

      if (state.stats.relationsCreated >= 2 && 
          !state.unlockedAchievements.includes('complex_relation')) {
        state.unlockedAchievements.push('complex_relation');
      }
    },
    documentCompleted: (state) => {
      state.stats.documentsCompleted += 1;
    },
    apiGenerated: (state) => {
      state.stats.apiGenerated = true;
    },
    codeGenerated: (state) => {
      state.stats.codeGenerated = true;
    },
    projectShared: (state) => {
      state.stats.projectsShared += 1;
    },
    userLoggedIn: (state) => {
      const today = new Date().toISOString().split('T')[0];
      if (state.stats.lastLoginDate !== today) {
        if (state.stats.lastLoginDate) {
          const lastDate = new Date(state.stats.lastLoginDate);
          const currentDate = new Date(today);
          const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            state.stats.loginStreak += 1;
          } else if (diffDays > 1) {
            state.stats.loginStreak = 1;
          }
        } else {
          state.stats.loginStreak = 1;
        }
        state.stats.lastLoginDate = today;
      }
    },
    featureUsed: (state, action: PayloadAction<string>) => {
      if (!state.stats.usedFeatures.includes(action.payload)) {
        state.stats.usedFeatures.push(action.payload);
      }
    },
    toolUsed: (state, action: PayloadAction<string>) => {
      if (!state.stats.usedTools.includes(action.payload)) {
        state.stats.usedTools.push(action.payload);
      }
    },
    deploymentSucceeded: (state) => {
      state.stats.deploymentSuccess = true;
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      if (!state.unlockedAchievements.includes(action.payload)) {
        state.unlockedAchievements.push(action.payload);
      }
    },
    resetDailyStats: (state) => {
      state.stats.todayChanges = 0;
    },
    resetWeeklyStats: (state) => {
      state.stats.weeklyProjects = 0;
      state.stats.weeklyTables = 0;
    },
    resetMonthlyStats: (state) => {
      state.stats.monthlyCompletions = 0;
    }
  }
});

export const {
  setCurrentProject,
  projectCreated,
  tableCreated,
  relationCreated,
  documentCompleted,
  apiGenerated,
  codeGenerated,
  projectShared,
  userLoggedIn,
  featureUsed,
  toolUsed,
  deploymentSucceeded,
  unlockAchievement,
  resetDailyStats,
  resetWeeklyStats,
  resetMonthlyStats
} = achievementSlice.actions;

export default achievementSlice.reducer; 