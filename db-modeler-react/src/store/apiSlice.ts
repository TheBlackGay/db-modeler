import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ApiParameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface Api {
  id: string;
  name: string;
  path: string;
  method: string;
  description?: string;
  requestParameters: ApiParameter[];
  responseParameters: ApiParameter[];
  createdAt: string;
  updatedAt: string;
}

interface ApiState {
  apis: Api[];
  currentApi: Api | null;
  loading: boolean;
}

const initialState: ApiState = {
  apis: [],
  currentApi: null,
  loading: false,
};

const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setApis: (state, action: PayloadAction<Api[]>) => {
      state.apis = action.payload;
    },
    addApi: (state, action: PayloadAction<Api>) => {
      state.apis.push(action.payload);
    },
    updateApi: (state, action: PayloadAction<Api>) => {
      const index = state.apis.findIndex(api => api.id === action.payload.id);
      if (index !== -1) {
        state.apis[index] = action.payload;
        if (state.currentApi?.id === action.payload.id) {
          state.currentApi = action.payload;
        }
      }
    },
    deleteApi: (state, action: PayloadAction<string>) => {
      state.apis = state.apis.filter(api => api.id !== action.payload);
      if (state.currentApi?.id === action.payload) {
        state.currentApi = null;
      }
    },
    setCurrentApi: (state, action: PayloadAction<string>) => {
      const api = state.apis.find(api => api.id === action.payload);
      state.currentApi = api || null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setApis, addApi, updateApi, deleteApi, setCurrentApi, setLoading } = apiSlice.actions;
export default apiSlice.reducer; 