import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import React from 'react';

// Mock localStorage
const localStorageMock = {
  store: {} as Record<string, string>,
  getItem: jest.fn((key: string) => localStorageMock.store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    localStorageMock.store[key] = value;
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
  removeItem: jest.fn((key: string) => {
    delete localStorageMock.store[key];
  }),
  key: jest.fn((index: number) => Object.keys(localStorageMock.store)[index] || null),
  length: 0,
};

Object.defineProperty(localStorageMock, 'length', {
  get: () => Object.keys(localStorageMock.store).length,
});

global.localStorage = localStorageMock as any;

// 在每个测试前重置 localStorage
beforeEach(() => {
  localStorageMock.clear();
});

// 设置时间相关的测试环境
beforeEach(() => {
  // 使用固定的时间作为基准
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-15T00:00:00.000Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模拟 ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 模拟 message API
const message = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
};

// 在每个测试前重置 message mock
beforeEach(() => {
  message.success.mockClear();
  message.error.mockClear();
  message.warning.mockClear();
});

// 创建 Input 组件
const InputComponent = ({ value, onChange, name, allowClear, placeholder, ...props }: any) => {
  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (name) {
      formState.values[name] = newValue;
    }
    if (onChange) {
      onChange(e);
    }
  };

  return React.createElement('input', { 
    ...props, 
    'data-testid': 'input',
    className: 'ant-input',
    value: name ? (formState.values[name] ?? '') : (value ?? ''),
    name,
    placeholder,
    onChange: handleChange,
    type: 'text',
    role: 'textbox'
  });
};

InputComponent.Search = ({ value, onChange, placeholder, allowClear, ...props }: any) => 
  React.createElement('input', { 
    ...props, 
    'data-testid': 'search',
    className: 'ant-input-search',
    placeholder,
    value: value ?? '',
    onChange,
    type: 'search',
    role: 'searchbox'
  });

InputComponent.TextArea = ({ value, onChange, name, rows, placeholder, ...props }: any) => {
  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (name) {
      formState.values[name] = newValue;
    }
    if (onChange) {
      onChange(e);
    }
  };

  return React.createElement('textarea', { 
    ...props, 
    'data-testid': 'textarea',
    className: 'ant-input',
    value: name ? (formState.values[name] ?? '') : (value ?? ''),
    name,
    rows,
    placeholder,
    onChange: handleChange,
    role: 'textbox'
  });
};

// 创建 Button 组件
const ButtonComponent = ({ children, onClick, icon, type, ...props }: any) => {
  const button = React.createElement('button', { 
    'data-testid': 'button', 
    onClick, 
    type: type || 'button',
    className: `ant-btn ${type ? `ant-btn-${type}` : ''}`,
    role: 'button',
    'aria-label': typeof children === 'string' ? children : undefined,
    ...props,
  }, [
    icon && React.cloneElement(icon, { key: 'icon' }),
    typeof children === 'function' ? children() : children,
  ].filter(Boolean));

  return button;
};

// 创建一个更健壮的表单状态管理
const formState = {
  values: {} as Record<string, any>,
  errors: {} as Record<string, string[]>,
  touched: {} as Record<string, boolean>,
};

// 在每个测试前重置表单状态
beforeEach(() => {
  formState.values = {};
  formState.errors = {};
  formState.touched = {};
});

const formInstance = {
  validateFields: jest.fn(async () => {
    const values = { ...formState.values };
    const errors: Array<{ name: string[]; errors: string[] }> = [];
    
    // 验证表名
    if (!values.name?.trim()) {
      errors.push({ name: ['name'], errors: ['请输入表名'] });
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(values.name)) {
      errors.push({ 
        name: ['name'], 
        errors: ['表名只能包含字母、数字和下划线，且不能以数字开头'] 
      });
    } else {
      // 获取现有表名列表
      const existingTables = document.querySelectorAll('[data-testid="list-item"] span');
      const tableNames = Array.from(existingTables).map(span => span.textContent?.trim());
      const isEdit = document.querySelector('[aria-label="编辑表"]');
      const currentTableName = isEdit ? values.name : null;

      if (tableNames.includes(values.name) && values.name !== currentTableName) {
        errors.push({ 
          name: ['name'], 
          errors: ['表名已存在，请使用其他名称'] 
        });
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validation Failed');
      (error as any).errorFields = errors;
      const firstError = errors[0].errors[0];
      message.error(firstError);
      throw error;
    }

    message.success(document.querySelector('[aria-label="编辑表"]') ? '表更新成功' : '表创建成功');
    return values;
  }),

  resetFields: jest.fn(() => {
    formState.values = {};
    formState.errors = {};
    formState.touched = {};
  }),

  setFieldsValue: jest.fn((values: Record<string, any>) => {
    Object.assign(formState.values, values);
  }),

  getFieldsValue: jest.fn(() => ({ ...formState.values })),
  
  getFieldValue: jest.fn((field: string) => formState.values[field]),
  
  setFields: jest.fn((fields: Array<{ name: string; value: any; errors?: string[] }>) => {
    fields.forEach((field) => {
      formState.values[field.name] = field.value;
      if (field.errors) {
        formState.errors[field.name] = field.errors;
      }
      formState.touched[field.name] = true;
    });
  }),
};

// 创建 Form 组件
const FormComponent = ({ children, form, initialValues, preserve, ...props }: any) => {
  React.useEffect(() => {
    if (initialValues) {
      formState.values = { ...initialValues };
      if (form) {
        form.setFieldsValue(initialValues);
      }
    }
    return () => {
      form?.resetFields();
    };
  }, [initialValues, form]);

  return React.createElement('form', {
    ...props,
    'data-testid': 'form',
    className: 'ant-form',
    ref: (node: any) => {
      if (node) {
        Object.defineProperty(node, 'form', {
          configurable: true,
          get: () => form,
          set: () => {},
        });
      }
    },
    onSubmit: (e: any) => {
      e.preventDefault();
      if (props.onSubmit) {
        props.onSubmit(e);
      }
    },
  }, children);
};

FormComponent.Item = ({ children, label, rules: _rules, name, validateStatus, help, ...props }: any) => {
  const handleChange = (e: any) => {
    const newValue = e.target.value;
    if (name) {
      formState.values[name] = newValue;
      formState.touched[name] = true;
    }
    if (children.props.onChange) {
      children.props.onChange(e);
    }
  };

  const itemProps = {
    'data-testid': 'form-item', 
    'aria-label': label,
    'data-field-name': name,
    className: `ant-form-item ${validateStatus ? `ant-form-item-${validateStatus}` : ''}`,
    ...props
  };

  return React.createElement('div', itemProps, [
    label && React.createElement('label', { 
      key: 'label',
      className: 'ant-form-item-label',
      htmlFor: name
    }, label),
    React.createElement('div', { 
      key: 'control',
      className: 'ant-form-item-control'
    }, [
      React.cloneElement(children, {
        key: 'input',
        id: name,
        name,
        value: name ? (formState.values[name] ?? '') : (children.props.value ?? ''),
        onChange: handleChange,
        'aria-invalid': formState.errors[name]?.length > 0,
        'aria-describedby': help ? `${name}-help` : undefined
      }),
      help && React.createElement('div', { 
        key: 'help',
        id: `${name}-help`,
        className: 'ant-form-item-explain',
        'data-testid': 'form-item-help',
        role: 'alert'
      }, help)
    ])
  ]);
};

FormComponent.useForm = () => {
  return [formInstance];
};

// 创建 List 组件
const ListComponent = ({ dataSource, renderItem, ...props }: any) => {
  return React.createElement('div', { 
    'data-testid': 'list',
    className: 'ant-list',
    ...props 
  }, dataSource?.map((item: any, index: number) => 
    React.createElement('div', {
      key: index,
      'data-testid': 'list-item',
      className: 'ant-list-item'
    }, renderItem(item))
  ));
};

const ListItem = ({ children, ...props }: any) => 
  React.createElement('div', { 
    'data-testid': 'list-item',
    className: 'ant-list-item',
    ...props 
  }, children);

const ListItemMeta = ({ title, description, ...props }: any) => 
  React.createElement('div', { 
    'data-testid': 'list-item-meta',
    className: 'ant-list-item-meta',
    ...props 
  }, [
    React.createElement('div', { 
      key: 'title',
      className: 'ant-list-item-meta-title' 
    }, title),
    description && React.createElement('div', { 
      key: 'description',
      className: 'ant-list-item-meta-description' 
    }, description)
  ]);

ListComponent.Item = ListItem;
ListItem.Meta = ListItemMeta;

// 创建 Tag 组件
const TagComponent = ({ children, color, ...props }: any) => 
  React.createElement('span', { 
    'data-testid': 'tag',
    className: `ant-tag ant-tag-${color}`,
    ...props 
  }, children);

// 导出所有 mock 组件
const antd = {
  Input: InputComponent,
  Button: ButtonComponent,
  Form: FormComponent,
  List: ListComponent,
  Tag: TagComponent,
  message,
};

// 导出 Form 实例
export { formInstance };

// 导出所有 mock 组件
export default antd; 