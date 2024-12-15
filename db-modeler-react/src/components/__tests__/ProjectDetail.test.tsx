/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProjectDetail from '../ProjectDetail';
import projectsReducer, { setCurrentProject, initializeState, importProject } from '../../store/projectsSlice';
import type { Project } from '../../types/models';
import { message } from 'antd';

// 模拟项目数据
const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'Test Description',
  tables: [
    {
      id: '1',
      name: 'users',
      comment: '用户表',
      fields: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'orders',
      comment: '订单表',
      fields: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// 模拟导航函数
const mockNavigate = jest.fn();

// 模拟路由参数
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: '1',
  }),
  useNavigate: () => mockNavigate,
}));

describe('ProjectDetail Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        projects: projectsReducer,
      },
      preloadedState: {
        projects: {
          items: [],
          currentProject: null,
          loading: false,
          error: null,
        },
      },
    });

    // 初始化状态
    store.dispatch(initializeState());
    store.dispatch(importProject(mockProject));
    store.dispatch(setCurrentProject(mockProject.id));

    // 清除所有模拟函数的调用记录
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ProjectDetail />
        </BrowserRouter>
      </Provider>
    );
  };

  describe('基本渲染', () => {
    it('应该正确渲染项目详情', () => {
      renderComponent();
      
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('用户表')).toBeInTheDocument();
      expect(screen.getByText('订单表')).toBeInTheDocument();
    });

    it('当项目不存在时应该显示错误信息', () => {
      store.dispatch(setCurrentProject('non-existent-id'));
      renderComponent();
      
      expect(screen.getByText('项目不存在')).toBeInTheDocument();
    });

    it('应该显示创建表按钮', () => {
      renderComponent();
      
      const createButton = screen.getByText('创建表');
      expect(createButton).toBeInTheDocument();
      expect(createButton.closest('button')).toHaveAttribute('type', 'primary');
    });
  });

  describe('表操作', () => {
    describe('创建表', () => {
      it('应该能够创建新表', async () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('创建表'));
        
        const nameInput = screen.getByPlaceholderText('例如：users');
        const commentInput = screen.getByPlaceholderText('请输入表的描述信息');
        
        fireEvent.change(nameInput, { target: { value: 'products' } });
        fireEvent.change(commentInput, { target: { value: '产品表' } });
        
        fireEvent.click(screen.getByTestId('modal-ok'));
        
        await waitFor(() => {
          expect(message.success).toHaveBeenCalledWith('表创建成功');
        });
      });

      it('不应该允许创建重复名称的表', async () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('创建表'));
        
        const nameInput = screen.getByPlaceholderText('例如：users');
        fireEvent.change(nameInput, { target: { value: 'users' } });
        
        fireEvent.click(screen.getByTestId('modal-ok'));
        
        await waitFor(() => {
          expect(message.error).toHaveBeenCalledWith('表名已存在，请使用其他名称');
        });
      });

      it('应该验证表名格式', async () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('创建表'));
        
        const nameInput = screen.getByPlaceholderText('例如：users');
        fireEvent.change(nameInput, { target: { value: '1invalid' } });
        
        fireEvent.click(screen.getByTestId('modal-ok'));
        
        await waitFor(() => {
          expect(screen.getByText('表名只能包含字母、数字和下划线，且不能以数字开头')).toBeInTheDocument();
        });
      });
    });

    describe('编辑表', () => {
      it('应该能够编辑表信息', async () => {
        renderComponent();
        
        const editButton = screen.getByTestId('dropdown-edit');
        fireEvent.click(editButton);
        
        const nameInput = screen.getByPlaceholderText('例如：users');
        const commentInput = screen.getByPlaceholderText('请输入表的描述信息');
        
        fireEvent.change(nameInput, { target: { value: 'users_new' } });
        fireEvent.change(commentInput, { target: { value: '新用户表' } });
        
        fireEvent.click(screen.getByTestId('modal-ok'));
        
        await waitFor(() => {
          expect(message.success).toHaveBeenCalledWith('表更新成功');
        });
      });

      it('编辑时不应允许使用已存在的表名', async () => {
        renderComponent();
        
        const editButton = screen.getByTestId('dropdown-edit');
        fireEvent.click(editButton);
        
        const nameInput = screen.getByPlaceholderText('例如：users');
        fireEvent.change(nameInput, { target: { value: 'orders' } });
        
        fireEvent.click(screen.getByTestId('modal-ok'));
        
        await waitFor(() => {
          expect(message.error).toHaveBeenCalledWith('表名已存在，请使用其他名称');
        });
      });
    });

    describe('删除表', () => {
      it('应该能够删除表', async () => {
        renderComponent();
        
        const deleteButton = screen.getByTestId('dropdown-delete');
        fireEvent.click(deleteButton);
        
        // 确认删除
        fireEvent.click(screen.getByTestId('modal-confirm-ok'));
        
        await waitFor(() => {
          expect(message.success).toHaveBeenCalledWith('表删除成功');
        });
      });

      it('取消删除时不应该删除表', async () => {
        renderComponent();
        
        const deleteButton = screen.getByTestId('dropdown-delete');
        fireEvent.click(deleteButton);
        
        // 取消删除
        fireEvent.click(screen.getByTestId('modal-confirm-cancel'));
        
        await waitFor(() => {
          expect(screen.getByText('用户表')).toBeInTheDocument();
        });
      });
    });

    describe('搜索和导航', () => {
      it('应该能够按表名搜索', () => {
        renderComponent();
        
        const searchInput = screen.getByPlaceholderText('搜索表名或注释');
        fireEvent.change(searchInput, { target: { value: 'user' } });
        
        expect(screen.getByText('用户表')).toBeInTheDocument();
        expect(screen.queryByText('订单表')).not.toBeInTheDocument();
      });

      it('应该能够按注释搜索', () => {
        renderComponent();
        
        const searchInput = screen.getByPlaceholderText('搜索表名或注释');
        fireEvent.change(searchInput, { target: { value: '订单' } });
        
        expect(screen.queryByText('用户表')).not.toBeInTheDocument();
        expect(screen.getByText('订单表')).toBeInTheDocument();
      });

      it('点击表卡片时应该导航到表设计页面', () => {
        renderComponent();
        
        const userTable = screen.getByText('用户表').closest('[data-testid="card"]');
        fireEvent.click(userTable!);
        
        expect(mockNavigate).toHaveBeenCalledWith('/table/1');
      });
    });

    describe('表单操作', () => {
      it('取消创建表时应该清空表单', () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('创建表'));
        
        const nameInput = screen.getByPlaceholderText('例如：users');
        fireEvent.change(nameInput, { target: { value: 'test' } });
        
        // 点击取消
        fireEvent.click(screen.getByTestId('modal-cancel'));
        
        // 再次打开表单
        fireEvent.click(screen.getByText('创建表'));
        
        expect(screen.getByPlaceholderText('例如：users')).toHaveValue('');
      });

      it('表单验证应该正确工作', async () => {
        renderComponent();
        
        fireEvent.click(screen.getByText('创建表'));
        
        // 不填写任何内容直接提交
        fireEvent.click(screen.getByTestId('modal-ok'));
        
        await waitFor(() => {
          expect(screen.getByText('请输入表名')).toBeInTheDocument();
        });
      });
    });
  });
}); 