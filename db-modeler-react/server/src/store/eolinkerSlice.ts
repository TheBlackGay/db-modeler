import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EolinkerState } from '../types/store';
import type { ApiGroup, Api, ApiParam, ApiResponse, MockConfig, MockRule } from '../types/api.types';

const initialState: EolinkerState = {
  groups: [],
  apis: [],
  params: [],
  responses: [],
  mockConfigs: [],
  mockRules: [],
  currentGroup: null,
  currentApi: null,
  currentParam: null,
  currentResponse: null,
  currentMockConfig: null,
  currentMockRule: null,
};

const eolinkerSlice = createSlice({
  name: 'eolinker',
  initialState,
  reducers: {
    // Group actions
    addGroup(state, action: PayloadAction<ApiGroup>) {
      state.groups.push(action.payload);
    },
    updateGroup(state, action: PayloadAction<ApiGroup>) {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    deleteGroup(state, action: PayloadAction<string>) {
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
    setCurrentGroup(state, action: PayloadAction<ApiGroup | null>) {
      state.currentGroup = action.payload;
    },

    // API actions
    addApi(state, action: PayloadAction<Api>) {
      state.apis.push(action.payload);
    },
    updateApi(state, action: PayloadAction<Api>) {
      const index = state.apis.findIndex(api => api.id === action.payload.id);
      if (index !== -1) {
        state.apis[index] = action.payload;
      }
    },
    deleteApi(state, action: PayloadAction<string>) {
      state.apis = state.apis.filter(api => api.id !== action.payload);
    },
    setCurrentApi(state, action: PayloadAction<Api | null>) {
      state.currentApi = action.payload;
    },

    // Parameter actions
    addParam(state, action: PayloadAction<ApiParam>) {
      state.params.push(action.payload);
    },
    updateParam(state, action: PayloadAction<ApiParam>) {
      const index = state.params.findIndex(param => param.id === action.payload.id);
      if (index !== -1) {
        state.params[index] = action.payload;
      }
    },
    deleteParam(state, action: PayloadAction<string>) {
      state.params = state.params.filter(param => param.id !== action.payload);
    },
    setCurrentParam(state, action: PayloadAction<ApiParam | null>) {
      state.currentParam = action.payload;
    },

    // Response actions
    addResponse(state, action: PayloadAction<ApiResponse>) {
      state.responses.push(action.payload);
    },
    updateResponse(state, action: PayloadAction<ApiResponse>) {
      const index = state.responses.findIndex(response => response.id === action.payload.id);
      if (index !== -1) {
        state.responses[index] = action.payload;
      }
    },
    deleteResponse(state, action: PayloadAction<string>) {
      state.responses = state.responses.filter(response => response.id !== action.payload);
    },
    setCurrentResponse(state, action: PayloadAction<ApiResponse | null>) {
      state.currentResponse = action.payload;
    },

    // Mock config actions
    addMockConfig(state, action: PayloadAction<MockConfig>) {
      state.mockConfigs.push(action.payload);
    },
    updateMockConfig(state, action: PayloadAction<MockConfig>) {
      const index = state.mockConfigs.findIndex(config => config.id === action.payload.id);
      if (index !== -1) {
        state.mockConfigs[index] = action.payload;
      }
    },
    deleteMockConfig(state, action: PayloadAction<string>) {
      state.mockConfigs = state.mockConfigs.filter(config => config.id !== action.payload);
    },
    setCurrentMockConfig(state, action: PayloadAction<MockConfig | null>) {
      state.currentMockConfig = action.payload;
    },

    // Mock rule actions
    addMockRule(state, action: PayloadAction<MockRule>) {
      state.mockRules.push(action.payload);
    },
    updateMockRule(state, action: PayloadAction<MockRule>) {
      const index = state.mockRules.findIndex(rule => rule.id === action.payload.id);
      if (index !== -1) {
        state.mockRules[index] = action.payload;
      }
    },
    deleteMockRule(state, action: PayloadAction<string>) {
      state.mockRules = state.mockRules.filter(rule => rule.id !== action.payload);
    },
    setCurrentMockRule(state, action: PayloadAction<MockRule | null>) {
      state.currentMockRule = action.payload;
    },
  },
});

export const {
  addGroup,
  updateGroup,
  deleteGroup,
  setCurrentGroup,
  addApi,
  updateApi,
  deleteApi,
  setCurrentApi,
  addParam,
  updateParam,
  deleteParam,
  setCurrentParam,
  addResponse,
  updateResponse,
  deleteResponse,
  setCurrentResponse,
  addMockConfig,
  updateMockConfig,
  deleteMockConfig,
  setCurrentMockConfig,
  addMockRule,
  updateMockRule,
  deleteMockRule,
  setCurrentMockRule,
} = eolinkerSlice.actions;

export const eolinkerReducer = eolinkerSlice.reducer; 