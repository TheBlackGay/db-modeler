/** @jest-environment jsdom */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import TemplateManager from '../index';
import type { FieldTemplate, FieldTemplateCategory } from '../../../types/models';
import { renderWithProviders } from '../../../test/testUtils';

// Mock 外部依赖
jest.mock('../../../services/storage', () => ({
  loadFieldTemplates: jest.fn(() => mockTemplates),
  loadTemplateCategories: jest.fn(() => mockCategories),
  addFieldTemplate: jest.fn(),
  updateFieldTemplate: jest.fn(),
  deleteFieldTemplate: jest.fn(),
  addTemplateCategory: jest.fn(),
  updateTemplateCategory: jest.fn(),
  deleteTemplateCategory: jest.fn(),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// 测试数据准备
const mockTemplates: FieldTemplate[] = [
  {
    id: 'template1',
    name: 'ID字段',
    type: 'INT',
    description: '主键ID字段',
    category: 'basic',
    length: 11,
    nullable: false,
    defaultValue: '',
    comment: '主键',
    isPrimaryKey: true,
    isAutoIncrement: true,
    unique: true,
    index: false,
    unsigned: true,
    zerofill: false,
    isBuiltin: true,
  },
];

const mockCategories: FieldTemplateCategory[] = [
  {
    id: 'basic',
    name: '基础字段',
    description: '基础字段类型',
    isBuiltin: true,
  },
];

describe('模板管理器组件', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染模板列表', () => {
    renderWithProviders(<TemplateManager {...defaultProps} />);

    expect(screen.getByText('ID字段')).toBeInTheDocument();
    expect(screen.getByText('主键ID字段')).toBeInTheDocument();
  });

  it('应该能切换到分类管理标签页', async () => {
    renderWithProviders(<TemplateManager {...defaultProps} />);

    fireEvent.click(screen.getByRole('tab', { name: '模板分类' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '基础字段' })).toBeInTheDocument();
      expect(screen.getByText('基础字段类型')).toBeInTheDocument();
    });
  });

  it('应该禁用内置模板的删除按钮', () => {
    renderWithProviders(<TemplateManager {...defaultProps} />);

    const deleteButtons = screen.getAllByLabelText('delete');
    const deleteButton = deleteButtons[0].closest('button');
    expect(deleteButton).toBeDisabled();
  });

  it('应该禁用内置分类的编辑和删除按钮', async () => {
    renderWithProviders(<TemplateManager {...defaultProps} />);

    fireEvent.click(screen.getByRole('tab', { name: '模板分类' }));

    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(editButtons[0]).toBeDisabled();
      expect(deleteButtons[0]).toBeDisabled();
    });
  });
}); 