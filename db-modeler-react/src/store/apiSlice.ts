import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Api } from '../types/models';

const API_STORAGE_KEY = 'db_modeler_apis';

interface ApiState {
  items: Api[];
}

const loadApisFromStorage = (): Api[] => {
  try {
    const storedApis = localStorage.getItem(API_STORAGE_KEY);
    return storedApis ? JSON.parse(storedApis) : [];
  } catch (error) {
    console.error('加载 API 失败:', error);
    return [];
  }
};

const saveApisToStorage = (apis: Api[]) => {
  try {
    localStorage.setItem(API_STORAGE_KEY, JSON.stringify(apis));
  } catch (error) {
    console.error('保存 API 失败:', error);
  }
};

const initialState: ApiState = {
  items: loadApisFromStorage(),
};

export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    addApi: (state, action: PayloadAction<Api>) => {
      state.items.push(action.payload);
      saveApisToStorage(state.items);
    },
    updateApi: (state, action: PayloadAction<Api>) => {
      const index = state.items.findIndex(api => api.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveApisToStorage(state.items);
      }
    },
    deleteApi: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(api => api.id !== action.payload);
      saveApisToStorage(state.items);
    },
  },
});

export const { addApi, updateApi, deleteApi } = apiSlice.actions;

export default apiSlice.reducer; 