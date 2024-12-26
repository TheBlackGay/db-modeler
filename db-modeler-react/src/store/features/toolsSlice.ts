import { createSlice } from '@reduxjs/toolkit';
import { toolUsed } from './achievementSlice';

interface ToolsState {
  usedTools: {
    import: boolean;
    export: boolean;
    validate: boolean;
    optimize: boolean;
    analyze: boolean;
    format: boolean;
    search: boolean;
    filter: boolean;
  };
}

const initialState: ToolsState = {
  usedTools: {
    import: false,
    export: false,
    validate: false,
    optimize: false,
    analyze: false,
    format: false,
    search: false,
    filter: false,
  },
};

const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    useImportTool: (state) => {
      state.usedTools.import = true;
      toolUsed('import');
    },
    useExportTool: (state) => {
      state.usedTools.export = true;
      toolUsed('export');
    },
    useValidateTool: (state) => {
      state.usedTools.validate = true;
      toolUsed('validate');
    },
    useOptimizeTool: (state) => {
      state.usedTools.optimize = true;
      toolUsed('optimize');
    },
    useAnalyzeTool: (state) => {
      state.usedTools.analyze = true;
      toolUsed('analyze');
    },
    useFormatTool: (state) => {
      state.usedTools.format = true;
      toolUsed('format');
    },
    useSearchTool: (state) => {
      state.usedTools.search = true;
      toolUsed('search');
    },
    useFilterTool: (state) => {
      state.usedTools.filter = true;
      toolUsed('filter');
    },
    // 检查是否使用了所有工具
    checkAllToolsUsed: (state) => {
      const allToolsUsed = Object.values(state.usedTools).every(used => used);
      if (allToolsUsed) {
        toolUsed('all_tools_master');
      }
    }
  }
});

export const {
  useImportTool,
  useExportTool,
  useValidateTool,
  useOptimizeTool,
  useAnalyzeTool,
  useFormatTool,
  useSearchTool,
  useFilterTool,
  checkAllToolsUsed
} = toolsSlice.actions;

export default toolsSlice.reducer; 