/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import ProjectImportExport from '../ProjectImportExport';
import { importProject } from '../../store/projectsSlice';
import type { Project } from '../../types/models';
import { renderWithProviders } from '../../test/testUtils';

// Mock 外部依赖
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 测试数据准备
const mockProject: Project = {
  id: 'test-project',
  name: '测试项目',
  description: '这是一个测试项目',
  tables: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('项目导入导出组件', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    currentProject: mockProject,
  };

  const preloadedState = {
    projects: {
      items: [],
      currentProject: mockProject,
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return renderWithProviders(
      <ProjectImportExport {...defaultProps} />,
      { preloadedState }
    );
  };

  it('应该能导入有效的项目文件', async () => {
    const { store } = renderComponent();

    const file = new File(
      [
        JSON.stringify({
          version: '1.0',
          project: mockProject,
        }),
      ],
      'test-project.json',
      { type: 'application/json' }
    );

    const uploadButton = screen.getByRole('button', { name: /选择项目文件/ });
    fireEvent.click(uploadButton);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: importProject.type,
          payload: expect.any(Object),
        })
      );
      expect(message.success).toHaveBeenCalledWith('项目导入成功');
    });
  });

  it('应该处理无效的项目文件', async () => {
    renderComponent();

    const file = new File(
      [JSON.stringify({ invalid: 'data' })],
      'invalid-project.json',
      { type: 'application/json' }
    );

    const uploadButton = screen.getByRole('button', { name: /选择项目文件/ });
    fireEvent.click(uploadButton);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        expect.stringContaining('导入失败')
      );
    });
  });

  it('应该能导出当前项目', async () => {
    const createObjectURL = jest.fn();
    const revokeObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;

    renderComponent();

    fireEvent.click(screen.getByText('导出当前项目'));

    await waitFor(() => {
      expect(createObjectURL).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith('项目导出成功');
    });
  });
}); 