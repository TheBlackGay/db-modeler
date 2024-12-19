/** @jest-environment jsdom */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import TableDesigner from '../TableDesigner';
import { updateTable } from '../../store/projectsSlice';
import type { Project, Table } from '../../types/models';
import { renderWithProviders } from '../../test/testUtils';

// Mock 外部依赖
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'table1',
  }),
}));

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

// Mock DnD 测试环境
jest.mock('react-dnd', () => ({
  ...jest.requireActual('react-dnd'),
  useDrag: () => [
    { isDragging: false },
    jest.fn(),
    jest.fn(),
  ],
  useDrop: () => [
    { isOver: false, dropClassName: '' },
    jest.fn(),
  ],
}));

// 测试数据准备
const mockTable: Table = {
  id: 'table1',
  name: 'users',
  description: '',
  comment: '',
  fields: [
    {
      id: 'field1',
      name: 'id',
      type: 'INT',
      nullable: false,
      isPrimaryKey: true,
      isAutoIncrement: true,
      comment: '用户ID',
      unique: false,
      index: false,
      unsigned: false,
      zerofill: false,
    },
    {
      id: 'field2',
      name: 'username',
      type: 'VARCHAR',
      length: 50,
      nullable: false,
      unique: true,
      comment: '用户名',
      isPrimaryKey: false,
      isAutoIncrement: false,
      index: false,
      unsigned: false,
      zerofill: false,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockProject: Project = {
  id: 'project1',
  name: 'Test Project',
  description: '',
  tables: [
    mockTable,
    {
      id: 'table2',
      name: 'orders',
      description: '',
      comment: '',
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('表设计器组件', () => {
  const preloadedState = {
    projects: {
      items: [mockProject],
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
      <TableDesigner />,
      { preloadedState }
    );
  };

  it('应该正确渲染表字段', () => {
    renderComponent();
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('username')).toBeInTheDocument();
  });

  it('应该能选择字段', async () => {
    renderComponent();
    const checkbox = screen.getAllByRole('checkbox')[1]; // 第一个是全选框
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });
  });

  it('应该在字段被选中时显示复制字段按钮', async () => {
    renderComponent();
    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(screen.getByText('复制到其他表')).toBeInTheDocument();
    });
  });

  it('应该能复制字段到其他表', async () => {
    const { store } = renderComponent();
    
    // 选择字段
    const checkbox = screen.getAllByRole('checkbox')[1];
    fireEvent.click(checkbox);
    
    // 等待复制按钮出现
    await waitFor(() => {
      expect(screen.getByText('复制到其他表')).toBeInTheDocument();
    });
    
    // 点击复制按钮
    const copyButton = screen.getByText('复制到其他表');
    fireEvent.click(copyButton);
    
    // 等待模态框出现
    await waitFor(() => {
      expect(screen.getByText('复制字段到其他表')).toBeInTheDocument();
    });
    
    // 选择目标表
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'table2' } });
    
    // 等待确认按钮可用
    await waitFor(() => {
      const okButton = screen.getByText('确定');
      expect(okButton).not.toBeDisabled();
    });
    
    // 点击确认按钮
    const okButton = screen.getByText('确定');
    fireEvent.click(okButton);
    
    // 验证 dispatch 和消息提示
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: updateTable.type,
          payload: expect.any(Object),
        })
      );
      expect(message.success).toHaveBeenCalledWith('字段已复制到目标表');
    });
  });

  it('应该能重新排序字段', async () => {
    const { store } = renderComponent();
    
    // 模拟拖拽操作
    const rows = screen.getAllByRole('row');
    const dragRow = rows[1]; // 第一个字段行
    const dropRow = rows[2]; // 第二个字段行
    
    // 触发拖拽事件
    fireEvent.dragStart(dragRow);
    fireEvent.dragOver(dropRow);
    fireEvent.drop(dropRow);
    
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: updateTable.type,
          payload: expect.any(Object),
        })
      );
    });
  });

  it('应该能执行批量操作', async () => {
    const { store } = renderComponent();
    
    // 选择多个字段
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    
    // 等待批量操作按钮出现
    await waitFor(() => {
      expect(screen.getByText('批量编辑')).toBeInTheDocument();
      expect(screen.getByText('批量删除')).toBeInTheDocument();
    });
    
    // 点击批量删除
    fireEvent.click(screen.getByText('批量删除'));
    
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: updateTable.type,
          payload: expect.any(Object),
        })
      );
    });
  });

  it('应该能打开SQL导出对话框', async () => {
    renderComponent();
    
    // 点击导出SQL按钮
    fireEvent.click(screen.getByText('导出SQL'));
    
    // 等待SQL导出模态框出现
    await waitFor(() => {
      expect(screen.getByText('导出SQL')).toBeInTheDocument();
      expect(screen.getByText('数据库类型')).toBeInTheDocument();
      expect(screen.getByText('版本')).toBeInTheDocument();
    });
  });
}); 