import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FieldTemplate, FieldTemplateCategory } from '../types/models';
import { loadFieldTemplates, saveFieldTemplates, loadTemplateCategories } from '../services/storage';

interface TemplatesState {
  items: FieldTemplate[];
  categories: FieldTemplateCategory[];
}

const initialState: TemplatesState = {
  items: loadFieldTemplates(),
  categories: loadTemplateCategories(),
};

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<FieldTemplate>) => {
      state.items.push(action.payload);
      saveFieldTemplates(state.items);
    },
    updateTemplate: (state, action: PayloadAction<FieldTemplate>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveFieldTemplates(state.items);
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      saveFieldTemplates(state.items);
    },
  },
});

export const { addTemplate, updateTemplate, deleteTemplate } = templatesSlice.actions;

export default templatesSlice.reducer; 