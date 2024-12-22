import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EolinkerState } from '../features/eolinker/types/store.types';
import type { Api, ApiGroup, MockConfig, MockRule } from '../features/eolinker/types/api.types';

const initialState: EolinkerState = {
  apis: [],
  apiGroups: [],
  currentApi: null,
  currentGroup: null,
  mockConfigs: [],
  mockRules: [],
  currentMockConfig: null,
  currentMockRule: null,
};

export const eolinkerSlice = createSlice({
  name: 'eolinker',
  initialState,
  reducers: {
    setApis: (state, action: PayloadAction<Api[]>) => {
      state.apis = action.payload;
    },
    setApiGroups: (state, action: PayloadAction<ApiGroup[]>) => {
      state.apiGroups = action.payload;
    },
    setCurrentApi: (state, action: PayloadAction<Api | null>) => {
      state.currentApi = action.payload;
    },
    setCurrentGroup: (state, action: PayloadAction<ApiGroup | null>) => {
      state.currentGroup = action.payload;
    },
    addMockConfig: (state, action: PayloadAction<MockConfig>) => {
      state.mockConfigs.push(action.payload);
    },
    updateMockConfig: (state, action: PayloadAction<MockConfig>) => {
      const index = state.mockConfigs.findIndex(config => config.id === action.payload.id);
      if (index !== -1) {
        state.mockConfigs[index] = action.payload;
      }
    },
    deleteMockConfig: (state, action: PayloadAction<string>) => {
      state.mockConfigs = state.mockConfigs.filter(config => config.id !== action.payload);
    },
    toggleMockConfig: (state, action: PayloadAction<{ id: string; enabled: boolean }>) => {
      const config = state.mockConfigs.find(config => config.id === action.payload.id);
      if (config) {
        config.enabled = action.payload.enabled;
      }
    },
    setCurrentMockConfig: (state, action: PayloadAction<MockConfig | null>) => {
      state.currentMockConfig = action.payload;
    },
    addMockRule: (state, action: PayloadAction<MockRule>) => {
      state.mockRules.push(action.payload);
    },
    updateMockRule: (state, action: PayloadAction<MockRule>) => {
      const index = state.mockRules.findIndex(rule => rule.id === action.payload.id);
      if (index !== -1) {
        state.mockRules[index] = action.payload;
      }
    },
    deleteMockRule: (state, action: PayloadAction<string>) => {
      state.mockRules = state.mockRules.filter(rule => rule.id !== action.payload);
    },
    reorderMockRules: (state, action: PayloadAction<string[]>) => {
      const newRules = action.payload.map(id => 
        state.mockRules.find(rule => rule.id === id)
      ).filter((rule): rule is MockRule => rule !== undefined);
      state.mockRules = newRules;
    },
    setCurrentMockRule: (state, action: PayloadAction<MockRule | null>) => {
      state.currentMockRule = action.payload;
    },
  },
});

export const {
  setApis,
  setApiGroups,
  setCurrentApi,
  setCurrentGroup,
  addMockConfig,
  updateMockConfig,
  deleteMockConfig,
  toggleMockConfig,
  setCurrentMockConfig,
  addMockRule,
  updateMockRule,
  deleteMockRule,
  reorderMockRules,
  setCurrentMockRule,
} = eolinkerSlice.actions;

export const eolinkerReducer = eolinkerSlice.reducer; 