import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EnvVariable {
  key: string;
  value: string;
  description?: string;
}

export interface Environment {
  id: string;
  name: string;
  variables: EnvVariable[];
}

interface EnvState {
  environments: Environment[];
  currentEnvId: string | null;
}

const initialState: EnvState = {
  environments: [],
  currentEnvId: null,
};

const envSlice = createSlice({
  name: 'env',
  initialState,
  reducers: {
    addEnvironment: (state, action: PayloadAction<Environment>) => {
      state.environments.push(action.payload);
    },
    updateEnvironment: (state, action: PayloadAction<Environment>) => {
      const index = state.environments.findIndex(env => env.id === action.payload.id);
      if (index !== -1) {
        state.environments[index] = action.payload;
      }
    },
    deleteEnvironment: (state, action: PayloadAction<string>) => {
      state.environments = state.environments.filter(env => env.id !== action.payload);
      if (state.currentEnvId === action.payload) {
        state.currentEnvId = null;
      }
    },
    setCurrentEnvironment: (state, action: PayloadAction<string | null>) => {
      state.currentEnvId = action.payload;
    },
  },
});

export const { addEnvironment, updateEnvironment, deleteEnvironment, setCurrentEnvironment } = envSlice.actions;
export default envSlice.reducer; 