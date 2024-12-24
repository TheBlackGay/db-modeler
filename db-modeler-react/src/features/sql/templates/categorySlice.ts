import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SQLTemplateCategory } from './types';

const CATEGORIES_STORAGE_KEY = 'sql_template_categories';

// 内置分类
const builtinCategories: SQLTemplateCategory[] = [
  {
    id: 'general',
    name: '通用模板',
    description: '通用的SQL模板',
    order: 0,
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'data-migration',
    name: '数据迁移',
    description: '数据迁移相关的模板',
    order: 1,
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'schema-sync',
    name: '架构同步',
    description: '数据库架构同步相关的模板',
    order: 2,
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface CategoriesState {
  items: SQLTemplateCategory[];
}

const loadCategoriesFromStorage = (): SQLTemplateCategory[] => {
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const customCategories = storedCategories ? JSON.parse(storedCategories) : [];
    return [...builtinCategories, ...customCategories];
  } catch (error) {
    console.error('加载分类失败:', error);
    return [...builtinCategories];
  }
};

const saveCategoriesToStorage = (categories: SQLTemplateCategory[]) => {
  try {
    const customCategories = categories.filter(c => !c.isBuiltin);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(customCategories));
  } catch (error) {
    console.error('保存分类失败:', error);
  }
};

const initialState: CategoriesState = {
  items: loadCategoriesFromStorage(),
};

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<SQLTemplateCategory>) => {
      state.items.push(action.payload);
      saveCategoriesToStorage(state.items);
    },
    updateCategory: (state, action: PayloadAction<SQLTemplateCategory>) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1 && !state.items[index].isBuiltin) {
        state.items[index] = action.payload;
        saveCategoriesToStorage(state.items);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      const category = state.items.find(c => c.id === action.payload);
      if (category && !category.isBuiltin) {
        // 检查是否有子分类
        const hasChildren = state.items.some(c => c.parentId === action.payload);
        if (!hasChildren) {
          state.items = state.items.filter(c => c.id !== action.payload);
          saveCategoriesToStorage(state.items);
        }
      }
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } = categorySlice.actions;

export default categorySlice.reducer; 