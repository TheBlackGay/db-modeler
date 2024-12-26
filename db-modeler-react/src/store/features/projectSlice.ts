import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  projectCreated,
  tableCreated,
  relationCreated,
  documentCompleted,
  projectCompleted
} from './achievementSlice';

// ... 其他导入和类型定义 ...

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    createProject: (state, action) => {
      // 原有的项目创建逻辑
      state.list.push(action.payload);
      state.current = action.payload;
    },
    addTable: (state, action) => {
      // 原有的添加表逻辑
      if (state.current) {
        state.current.tables.push(action.payload);
      }
    },
    addRelation: (state, action) => {
      // 原有的添加关系逻辑
      if (state.current) {
        // ... 关系添加逻辑
      }
    },
    // ... 其他 reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        // 原有的异步创建项目逻辑
        state.list.push(action.payload);
        state.current = action.payload;
        // 触发成就统计
        projectCreated();
      })
      .addCase(addTable.fulfilled, (state, action) => {
        // 原有的异步添加表逻辑
        if (state.current) {
          state.current.tables.push(action.payload);
          // 触发成就统计
          tableCreated();
        }
      })
      .addCase(addRelation.fulfilled, (state, action) => {
        // 原有的异步添加关系逻辑
        if (state.current) {
          // ... 关系添加逻辑
          // 触发成就统计
          relationCreated();
        }
      })
      .addCase(completeDocumentation.fulfilled, (state, action) => {
        // 原有的完成文档逻辑
        // 触发成就统计
        documentCompleted();
      })
      .addCase(completeProject.fulfilled, (state, action) => {
        // 原有的完成项目逻辑
        // 触发成就统计
        projectCompleted();
      });
  }
});

export default projectSlice.reducer; 