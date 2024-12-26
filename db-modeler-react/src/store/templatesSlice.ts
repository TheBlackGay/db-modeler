import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldTemplate } from '../types/models';

interface TemplatesState {
  items: FieldTemplate[];
  loading: boolean;
  error: string | null;
}

const initialState: TemplatesState = {
  items: [],
  loading: false,
  error: null,
};

const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    setTemplates: (state, action: PayloadAction<FieldTemplate[]>) => {
      state.items = action.payload;
    },
    addTemplate: (state, action: PayloadAction<FieldTemplate>) => {
      state.items.push(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<FieldTemplate>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setLoading,
  setError,
} = templatesSlice.actions;

export default templatesSlice.reducer; 