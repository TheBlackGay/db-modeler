import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StandardField } from '../types/models';

interface StandardFieldsState {
  fields: StandardField[];
  loading: boolean;
  error: string | null;
}

const initialState: StandardFieldsState = {
  fields: [],
  loading: false,
  error: null,
};

const standardFieldsSlice = createSlice({
  name: 'standardFields',
  initialState,
  reducers: {
    setFields: (state, action: PayloadAction<StandardField[]>) => {
      state.fields = action.payload;
    },
    addField: (state, action: PayloadAction<StandardField>) => {
      state.fields.push(action.payload);
    },
    updateField: (state, action: PayloadAction<StandardField>) => {
      const index = state.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
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
} = standardFieldsSlice.actions;

export default standardFieldsSlice.reducer; 