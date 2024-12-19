/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryForm from '../CategoryForm';
import type { FieldTemplateCategory } from '../../../types/models';

const mockCategory: FieldTemplateCategory = {
  id: 'category1',
  name: '新分类',
  description: '这是一个新分类',
  isBuiltin: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('CategoryForm', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染表单', () => {
    render(<CategoryForm {...defaultProps} />);

    expect(screen.getByLabelText('分类名称')).toBeInTheDocument();
    expect(screen.getByLabelText('描述')).toBeInTheDocument();
  });

  it('应该正确加载初始值', async () => {
    render(<CategoryForm {...defaultProps} initialValues={mockCategory} />);

    await waitFor(() => {
      const nameInput = screen.getByLabelText('分类名称');
      expect(nameInput).toHaveValue('新分类');
    });

    expect(screen.getByLabelText('描述')).toHaveValue('这是一个新分类');
  });

  it('应该能提交表单', async () => {
    render(<CategoryForm {...defaultProps} />);

    const nameInput = screen.getByLabelText('分类名称');
    const descriptionTextarea = screen.getByLabelText('描述');

    fireEvent.change(nameInput, { target: { value: '测试分类' } });
    fireEvent.change(descriptionTextarea, { target: { value: '这是一个测试分类' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '测试分类',
          description: '这是一个测试分类',
        })
      );
    });
  });

  it('应该能取消表单', () => {
    render(<CategoryForm {...defaultProps} />);

    fireEvent.click(screen.getByText('取消'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('应该验证必填字段', async () => {
    render(<CategoryForm {...defaultProps} />);

    const nameInput = screen.getByLabelText('分类名称');
    const descriptionTextarea = screen.getByLabelText('描述');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(descriptionTextarea, { target: { value: '' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(screen.getByText('请输入分类名称')).toBeInTheDocument();
      expect(screen.getByText('请输入描述')).toBeInTheDocument();
    });
  });
}); 