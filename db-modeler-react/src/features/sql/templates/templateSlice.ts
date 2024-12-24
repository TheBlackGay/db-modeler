import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SQLTemplate } from './types';
import { builtinTemplates } from './index';

const TEMPLATES_STORAGE_KEY = 'sql_templates';

interface TemplatesState {
  items: SQLTemplate[];
}

const loadTemplatesFromStorage = (): SQLTemplate[] => {
  try {
    const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    const customTemplates = storedTemplates ? JSON.parse(storedTemplates) : [];
    return [...builtinTemplates, ...customTemplates];
  } catch (error) {
    console.error('加载模板失败:', error);
    return [...builtinTemplates];
  }
};

const saveTemplatesToStorage = (templates: SQLTemplate[]) => {
  try {
    const customTemplates = templates.filter(t => !t.isBuiltin);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(customTemplates));
  } catch (error) {
    console.error('保存模板失败:', error);
  }
};

const initialState: TemplatesState = {
  items: loadTemplatesFromStorage(),
};

export const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<SQLTemplate>) => {
      state.items.push(action.payload);
      saveTemplatesToStorage(state.items);
    },
    updateTemplate: (state, action: PayloadAction<SQLTemplate>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveTemplatesToStorage(state.items);
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      const template = state.items.find(t => t.id === action.payload);
      if (template && !template.isBuiltin) {
        state.items = state.items.filter(t => t.id !== action.payload);
        saveTemplatesToStorage(state.items);
      }
    },
    importTemplates: (state, action: PayloadAction<SQLTemplate[]>) => {
      const customTemplates = action.payload.map(t => ({
        ...t,
        isBuiltin: false,
        createdAt: t.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      state.items = [...builtinTemplates, ...customTemplates];
      saveTemplatesToStorage(state.items);
    },
  },
});

export const { addTemplate, updateTemplate, deleteTemplate, importTemplates } = templateSlice.actions;

export default templateSlice.reducer; 