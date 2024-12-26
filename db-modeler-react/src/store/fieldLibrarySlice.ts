import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Field } from '../types/models';

interface FieldLibraryState {
  items: Field[];
  loading: boolean;
  error: string | null;
}

const initialState: FieldLibraryState = {
  items: [],
  loading: false,
  error: null,
};

const fieldLibrarySlice = createSlice({
  name: 'fieldLibrary',
  initialState,
  reducers: {
    setFields: (state, action: PayloadAction<Field[]>) => {
      state.items = action.payload;
    },
    addField: (state, action: PayloadAction<Field>) => {
      state.items.push(action.payload);
    },
    updateField: (state, action: PayloadAction<Field>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
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
  setFields,
  addField,
  updateField,
  deleteField,
  setLoading,
  setError,
} = fieldLibrarySlice.actions;

export default fieldLibrarySlice.reducer; 