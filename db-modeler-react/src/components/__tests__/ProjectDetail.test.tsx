/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProjectDetail from '../ProjectDetail';
import type { Project } from '../../types/models';
import { renderWithProviders } from '../../test/testUtils';

// 测试数据准备
const mockProject: Project = {
  id: 'project1',
  name: '测试项目',
  description: '这是一个测试项目',
  tables: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('项目详情组件', () => {
  // 测试工具函数
  const renderComponent = (customState = {}) => {
    const defaultState = {
      projects: {
        items: [mockProject],
        currentProject: mockProject,
        loading: false,
        error: null,
      },
    };

    const preloadedState = {
      ...defaultState,
      ...customState,
    };

    return renderWithProviders(
      <MemoryRouter initialEntries={[`/project/${mockProject.id}`]}>
        <Routes>
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>,
      { preloadedState }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染项目详情', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '测试项目' })).toBeInTheDocument();
      expect(screen.getByText('这是一个测试项目')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /创建表/ })).toBeInTheDocument();
      expect(screen.getByRole('searchbox')).toBeInTheDocument();
    });
  });

  it('应该能创建新表', async () => {
    renderComponent();
    
    const createButton = screen.getByRole('button', { name: /创建表/ });
    fireEvent.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: '创建表' })).toBeInTheDocument();
      expect(screen.getByLabelText('表名')).toBeInTheDocument();
      expect(screen.getByLabelText('表注释')).toBeInTheDocument();
    });
  });

  it('应该能搜索表', async () => {
    renderComponent();
    
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: '测试' } });
    
    await waitFor(() => {
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      expect(input.value).toBe('测试');
    });
  });

  it('应该显示空状态提示', async () => {
    renderComponent({
      projects: {
        items: [mockProject],
        currentProject: { ...mockProject, tables: [] },
        loading: false,
        error: null,
      },
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('list')).toBeInTheDocument();
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });
  });

  it('应该能处理加载状态', async () => {
    renderComponent({
      projects: {
        items: [],
        currentProject: null,
        loading: true,
        error: null,
      },
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('应该能处理错误状态', async () => {
    renderComponent({
      projects: {
        items: [],
        currentProject: null,
        loading: false,
        error: '加载失败',
      },
    });
    
    await waitFor(() => {
      expect(screen.getByText('加载失败')).toBeInTheDocument();
    });
  });
}); 