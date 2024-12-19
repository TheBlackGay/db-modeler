/** @jest-environment jsdom */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FieldForm from '../index';
import type { Field } from '../../../types/models';

const mockField: Field = {
  id: 'field1',
  name: 'test_field',
  type: 'VARCHAR',
  length: 255,
  nullable: true,
  defaultValue: '',
  comment: 'Test field',
  isPrimaryKey: false,
  isAutoIncrement: false,
  unique: false,
  index: false,
  unsigned: false,
  zerofill: false,
};

describe('FieldForm Component', () => {
  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该正确渲染表单', () => {
    render(<FieldForm {...defaultProps} />);

    expect(screen.getByLabelText('字段名')).toBeInTheDocument();
    expect(screen.getByLabelText('类型')).toBeInTheDocument();
    expect(screen.getByLabelText('长度')).toBeInTheDocument();
    expect(screen.getByLabelText('注释')).toBeInTheDocument();
  });

  it('应该正确加载初始值', async () => {
    render(<FieldForm {...defaultProps} initialValues={mockField} />);

    await waitFor(() => {
      const nameInput = screen.getByLabelText('字段名');
      expect(nameInput).toHaveValue('test_field');
    });

    expect(screen.getByLabelText('类型')).toHaveValue('VARCHAR');
    expect(screen.getByLabelText('长度')).toHaveValue(255);
    expect(screen.getByLabelText('注释')).toHaveValue('Test field');
  });

  it('应该能提交表单', async () => {
    render(<FieldForm {...defaultProps} />);

    const nameInput = screen.getByLabelText('字段名');
    const typeSelect = screen.getByLabelText('类型');
    const lengthInput = screen.getByLabelText('长度');
    const commentTextarea = screen.getByLabelText('注释');

    fireEvent.change(nameInput, { target: { value: 'new_field' } });
    fireEvent.change(typeSelect, { target: { value: 'INT' } });
    fireEvent.change(lengthInput, { target: { value: '11' } });
    fireEvent.change(commentTextarea, { target: { value: 'New field' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'new_field',
          type: 'INT',
          length: 11,
          comment: 'New field',
        })
      );
    });
  });

  it('应该能取消表单', () => {
    render(<FieldForm {...defaultProps} initialValues={mockField} />);

    fireEvent.click(screen.getByText('取消'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('应该验证必填字段', async () => {
    render(<FieldForm {...defaultProps} />);

    const nameInput = screen.getByLabelText('字段名');
    const typeSelect = screen.getByLabelText('类型');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(typeSelect, { target: { value: '' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(screen.getByText('请输入字段名')).toBeInTheDocument();
      expect(screen.getByText('请选择字段类型')).toBeInTheDocument();
    });
  });

  it('应该正确处理主键和自增选项', async () => {
    render(<FieldForm {...defaultProps} />);

    const primaryKeySwitch = screen.getByLabelText('主键');
    const autoIncrementSwitch = screen.getByLabelText('自增');
    const nameInput = screen.getByLabelText('字段名');
    const typeSelect = screen.getByLabelText('类型');

    fireEvent.click(primaryKeySwitch);
    fireEvent.click(autoIncrementSwitch);

    fireEvent.change(nameInput, { target: { value: 'id' } });
    fireEvent.change(typeSelect, { target: { value: 'INT' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'id',
          type: 'INT',
          isPrimaryKey: true,
          isAutoIncrement: true,
        })
      );
    });
  });

  it('应该正确处理索引和唯一选项', async () => {
    render(<FieldForm {...defaultProps} />);

    const uniqueSwitch = screen.getByLabelText('唯一');
    const indexSwitch = screen.getByLabelText('索引');
    const nameInput = screen.getByLabelText('字段名');
    const typeSelect = screen.getByLabelText('类型');

    fireEvent.click(uniqueSwitch);
    fireEvent.click(indexSwitch);

    fireEvent.change(nameInput, { target: { value: 'username' } });
    fireEvent.change(typeSelect, { target: { value: 'VARCHAR' } });

    fireEvent.click(screen.getByText('确定'));

    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'username',
          type: 'VARCHAR',
          unique: true,
          index: true,
        })
      );
    });
  });
}); 