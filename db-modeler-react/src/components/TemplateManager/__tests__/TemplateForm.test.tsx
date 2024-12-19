/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TemplateForm from '../TemplateForm';
import type { FieldTemplate, FieldTemplateCategory } from '../../../types/models';

const mockCategories: FieldTemplateCategory[] = [
  {
    id: 'category1',
    name: '基础类型',
    description: '基础数据类型',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'category2',
    name: '高级类型',
    description: '高级数据类型',
    isBuiltin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockTemplate: FieldTemplate = {
  id: 'template1',
  name: '测试模板',
  description: '这是一个测试模板',
  category: 'category1',
  type: 'VARCHAR',
  length: 255,
  nullable: true,
  defaultValue: '',
  comment: '',
  isPrimaryKey: false,
  isAutoIncrement: false,
  unique: false,
  index: false,
  unsigned: false,
  zerofill: false,
  isBuiltin: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TemplateForm', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
    categories: mockCategories,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染表单', () => {
    render(<TemplateForm {...defaultProps} />);

    expect(screen.getByLabelText('模板名称')).toBeInTheDocument();
    expect(screen.getByLabelText('描述')).toBeInTheDocument();
    expect(screen.getByLabelText('分类')).toBeInTheDocument();
    expect(screen.getByLabelText('字段类型')).toBeInTheDocument();
  });

  it('应该正确加载初始值', async () => {
    render(<TemplateForm {...defaultProps} initialValues={mockTemplate} />);

    await waitFor(() => {
      expect(screen.getByLabelText('模板名称')).toHaveValue('测试模板');
      expect(screen.getByLabelText('描述')).toHaveValue('这是一个测试模板');
      expect(screen.getByLabelText('分类')).toHaveValue('category1');
      expect(screen.getByLabelText('字段类型')).toHaveValue('VARCHAR');
      expect(screen.getByLabelText('长度')).toHaveValue(255);
    });
  });

  it('应该能提交表单', async () => {
    render(<TemplateForm {...defaultProps} />);

    const nameInput = screen.getByLabelText('模板名称');
    const descriptionTextarea = screen.getByLabelText('描述');
    const categorySelect = screen.getByLabelText('分类');
    const typeSelect = screen.getByLabelText('字段类型');
    const lengthInput = screen.getByLabelText('长度');

    fireEvent.change(nameInput, { target: { value: '新模板' } });
    fireEvent.change(descriptionTextarea, { target: { value: '这是一个新模板' } });
    fireEvent.change(categorySelect, { target: { value: 'category1' } });
    fireEvent.change(typeSelect, { target: { value: 'INT' } });
    fireEvent.change(lengthInput, { target: { value: '11' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: '新模板',
        description: '这是一个新模板',
        category: 'category1',
        type: 'INT',
        length: 11,
        nullable: true,
        defaultValue: '',
        comment: '',
        isPrimaryKey: false,
        isAutoIncrement: false,
        unique: false,
        index: false,
        unsigned: false,
        zerofill: false,
        isBuiltin: false,
      });
    });
  });

  it('应该能取消表单', () => {
    render(<TemplateForm {...defaultProps} />);

    fireEvent.click(screen.getByText('取消'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('应该验证必填字段', async () => {
    render(<TemplateForm {...defaultProps} />);

    const nameInput = screen.getByLabelText('模板名称');
    const descriptionTextarea = screen.getByLabelText('描述');
    const categorySelect = screen.getByLabelText('分类');
    const typeSelect = screen.getByLabelText('字段类型');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(descriptionTextarea, { target: { value: '' } });
    fireEvent.change(categorySelect, { target: { value: '' } });
    fireEvent.change(typeSelect, { target: { value: '' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(screen.getByText('请输入模板名称')).toBeInTheDocument();
      expect(screen.getByText('请输入描述')).toBeInTheDocument();
      expect(screen.getByText('请选择分类')).toBeInTheDocument();
      expect(screen.getByText('请选择字段类型')).toBeInTheDocument();
    });
  });
}); 