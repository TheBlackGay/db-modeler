import { createSlice } from '@reduxjs/toolkit';
import { 
  apiGenerated,
  codeGenerated,
  featureUsed,
  toolUsed,
  deploymentSucceeded
} from './achievementSlice';

interface GenerationState {
  apiStatus: boolean;
  codeStatus: boolean;
  deploymentStatus: boolean;
}

const initialState: GenerationState = {
  apiStatus: false,
  codeStatus: false,
  deploymentStatus: false,
};

const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    generateApi: (state) => {
      state.apiStatus = true;
      apiGenerated();
      featureUsed('api_generation');
    },
    generateCode: (state) => {
      state.codeStatus = true;
      codeGenerated();
      featureUsed('code_generation');
    },
    deployDatabase: (state) => {
      state.deploymentStatus = true;
      deploymentSucceeded();
      toolUsed('deployment');
    },
    useFeature: (state, action) => {
      featureUsed(action.payload);
    },
    useTool: (state, action) => {
      toolUsed(action.payload);
    }
  }
});

export const {
  generateApi,
  generateCode,
  deployDatabase,
  useFeature,
  useTool
} = generationSlice.actions;

export default generationSlice.reducer; 