/** @jest-environment jsdom */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FieldLibrary from '../FieldLibrary';
import { loadFieldLibrary, removeFieldFromLibrary } from '../../services/storage';
import type { Field } from '../../types/models';

// Mock storage service
jest.mock('../../services/storage', () => ({
  loadFieldLibrary: jest.fn(),
  removeFieldFromLibrary: jest.fn(),
}));

const mockFields: Field[] = [
  {
    id: 'field1',
    name: 'id',
    type: 'INT',
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
  },
  {
    id: 'field2',
    name: 'name',
    type: 'VARCHAR',
    length: 255,
    nullable: true,
    defaultValue: '',
    comment: '用户名',
    isPrimaryKey: false,
    isAutoIncrement: false,
    unique: false,
    index: true,
    unsigned: false,
    zerofill: false,
  },
];

describe('FieldLibrary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadFieldLibrary as jest.Mock).mockReturnValue(mockFields);
  });

  const defaultProps = {
    visible: true,
    onCancel: jest.fn(),
    onSelect: jest.fn(),
  };

  it('应该正确渲染字段库组件', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '字段库' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('搜索字段名称、类型或注释')).toBeInTheDocument();
  });

  it('应该能够搜索字段', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜索字段名称、类型或注释');
    fireEvent.change(searchInput, { target: { value: 'id' } });
    
    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.queryByText('name')).not.toBeInTheDocument();
  });

  it('应该能够删除字段', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    const deleteButton = screen.getAllByRole('button', { name: /删除/ })[0];
    fireEvent.click(deleteButton);
    
    expect(removeFieldFromLibrary).toHaveBeenCalledWith('field1');
  });

  it('应该能够选择字段', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    const useButton = screen.getAllByRole('button', { name: '使用此字段' })[0];
    fireEvent.click(useButton);
    
    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockFields[0]);
  });

  it('当 visible 为 false 时不应该渲染组件', () => {
    render(<FieldLibrary {...defaultProps} visible={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('应该能够通过类型搜索字段', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜索字段名称、类型或注释');
    fireEvent.change(searchInput, { target: { value: 'VARCHAR' } });
    
    expect(screen.queryByText('id')).not.toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
  });

  it('应该能够通过注释搜索字段', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('搜索字段名称、类型或注释');
    fireEvent.change(searchInput, { target: { value: '用户名' } });
    
    expect(screen.queryByText('id')).not.toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
  });

  it('应该正确显示字段的属性标签', () => {
    render(<FieldLibrary {...defaultProps} />);
    
    // 检查第一个字段的属性标签
    const tags = screen.getAllByTestId('tag');
    const tagTexts = tags.map(tag => tag.textContent);
    
    expect(tagTexts).toContain('主键');
    expect(tagTexts).toContain('自增');
    expect(tagTexts).toContain('唯一');
    expect(tagTexts).toContain('非空');
    expect(tagTexts).toContain('无符号');
    expect(tagTexts).toContain('可空');
    expect(tagTexts).toContain('索引');
  });
}); 