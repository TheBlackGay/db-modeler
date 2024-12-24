import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HistoryItem {
  id: string;
  name: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  requestTime: string;
  requestHeaders?: Record<string, string>;
  requestBody?: any;
  responseHeaders?: Record<string, string>;
  responseBody?: any;
}

interface HistoryState {
  items: HistoryItem[];
}

const HISTORY_STORAGE_KEY = 'db_modeler_debug_history';

const loadHistoryFromStorage = (): HistoryItem[] => {
  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error('加载调试历史失败:', error);
    return [];
  }
};

const saveHistoryToStorage = (history: HistoryItem[]) => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('保存调试历史失败:', error);
  }
};

const initialState: HistoryState = {
  items: loadHistoryFromStorage(),
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      state.items.unshift(action.payload);
      saveHistoryToStorage(state.items);
    },
    clearHistory: (state) => {
      state.items = [];
      saveHistoryToStorage(state.items);
    },
    deleteHistoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveHistoryToStorage(state.items);
    },
  },
});

export const { addHistoryItem, clearHistory, deleteHistoryItem } = historySlice.actions;

export default historySlice.reducer; 