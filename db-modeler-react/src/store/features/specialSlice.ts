import { createSlice } from '@reduxjs/toolkit';
import { featureUsed } from './achievementSlice';

interface SpecialState {
  discoveredFeatures: string[];
  easterEggs: string[];
}

const initialState: SpecialState = {
  discoveredFeatures: [],
  easterEggs: [],
};

const specialSlice = createSlice({
  name: 'special',
  initialState,
  reducers: {
    discoverFeature: (state, action) => {
      const feature = action.payload;
      if (!state.discoveredFeatures.includes(feature)) {
        state.discoveredFeatures.push(feature);
        featureUsed('hidden_feature_discovered');
      }
    },
    findEasterEgg: (state, action) => {
      const easterEgg = action.payload;
      if (!state.easterEggs.includes(easterEgg)) {
        state.easterEggs.push(easterEgg);
        featureUsed('easter_egg_found');
      }
    },
    // 特殊的键盘组合
    activateKonamiCode: (state) => {
      featureUsed('konami_code');
    },
    // 特殊的鼠标手势
    activateGesture: (state) => {
      featureUsed('special_gesture');
    },
    // 在特定时间使用特定功能
    activateTimeFeature: (state) => {
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 5) {
        featureUsed('night_owl');
      }
    },
    // 连续操作触发
    activateCombo: (state) => {
      featureUsed('combo_master');
    }
  }
});

export const {
  discoverFeature,
  findEasterEgg,
  activateKonamiCode,
  activateGesture,
  activateTimeFeature,
  activateCombo
} = specialSlice.actions;

export default specialSlice.reducer; 