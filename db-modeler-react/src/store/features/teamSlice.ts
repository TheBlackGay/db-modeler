import { createSlice } from '@reduxjs/toolkit';
import { projectShared } from './achievementSlice';

interface TeamState {
  sharedProjects: string[];
}

const initialState: TeamState = {
  sharedProjects: [],
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    shareProject: (state, action) => {
      if (!state.sharedProjects.includes(action.payload)) {
        state.sharedProjects.push(action.payload);
        projectShared();
      }
    },
  }
});

export const { shareProject } = teamSlice.actions;

export default teamSlice.reducer; 