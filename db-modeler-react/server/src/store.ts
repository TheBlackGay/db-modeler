import { configureStore } from '@reduxjs/toolkit';
import { eolinkerReducer } from './store/eolinkerSlice';
import type { RootState } from './types/store';

export function createStore() {
  return configureStore<RootState>({
    reducer: {
      eolinker: eolinkerReducer,
    },
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch']; 