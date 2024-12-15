import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import React from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

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

// 创建 Form 组件
const FormComponent = ({ children, ...props }: any) => React.createElement('form', props, children);
FormComponent.Item = ({ children, label, name, rules }: any) => {
  const error = rules?.find((rule: any) => rule.required)?.message;
  return React.createElement('div', { 'data-testid': 'form-item', 'aria-label': label },
    children,
    error && React.createElement('div', { className: 'ant-form-item-explain-error' }, error)
  );
};
FormComponent.useForm = () => [
  {
    validateFields: jest.fn(() => Promise.resolve({ name: 'test', comment: 'test' })),
    resetFields: jest.fn(),
    setFieldsValue: jest.fn(),
  },
];

// 创建 Input 组件
const InputComponent = ({ children, ...props }: any) => React.createElement('input', { ...props, 'data-testid': 'input' }, children);
InputComponent.TextArea = ({ children, ...props }: any) => React.createElement('textarea', { ...props, 'data-testid': 'textarea' }, children);
InputComponent.Search = ({ children, placeholder, ...props }: any) => React.createElement('input', { ...props, placeholder, 'data-testid': 'search' }, children);

// 创建 List 组件
const ListComponent = ({ children, dataSource, renderItem, grid, ...props }: any) => {
  const items = dataSource.map((item: any, index: number) => renderItem(item, index));
  return React.createElement('div', { 'data-testid': 'list', ...props }, items);
};
ListComponent.Item = ({ children }: any) => React.createElement('div', { 'data-testid': 'list-item' }, children);

// 创建 Card 组件
const CardComponent = ({ children, title, hoverable, onClick, ...props }: any) => {
  const titleElement = typeof title === 'object' ? title : React.createElement('div', null, title);
  return React.createElement('div', { 'data-testid': 'card', onClick, ...props },
    titleElement,
    children
  );
};

// 创建 Button 组件
const ButtonComponent = ({ children, onClick, icon, type, ...props }: any) => 
  React.createElement('button', { 'data-testid': 'button', onClick, type, ...props }, children);

// 创建 Dropdown 组件
const DropdownComponent = ({ children, menu, trigger, ...props }: any) => {
  const menuItems = menu?.items?.map((item: any) => 
    React.createElement('button', {
      key: item.key,
      onClick: item.onClick,
      'data-testid': `dropdown-${item.key}`,
      'aria-label': item.label,
      'data-table-id': props['data-table-id'],
    }, item.label)
  );

  return React.createElement('div', { 'data-testid': 'dropdown', ...props },
    children,
    React.createElement('div', { 'data-testid': 'dropdown-menu' }, menuItems)
  );
};

// 创建 Modal 组件
const ModalComponent = ({ children, title, open, onOk, onCancel, ...props }: any) => 
  open ? React.createElement('div', { 'data-testid': 'modal', role: 'dialog', 'aria-label': title, ...props },
    React.createElement('div', null, title),
    children,
    React.createElement('div', { className: 'modal-footer' },
      React.createElement('button', { onClick: onCancel, 'data-testid': 'modal-cancel' }, '取 消'),
      React.createElement('button', { onClick: onOk, 'data-testid': 'modal-ok' }, '确 定')
    )
  ) : null;

// 添加 confirm 方法
ModalComponent.confirm = ({ onOk, onCancel }: any) => {
  // 模拟确认对话框的显示
  const container = document.createElement('div');
  container.setAttribute('data-testid', 'modal-confirm');
  document.body.appendChild(container);

  // 创建确认和取消按钮
  const confirmButton = document.createElement('button');
  confirmButton.textContent = '确认';
  confirmButton.setAttribute('data-testid', 'modal-confirm-ok');
  confirmButton.onclick = () => {
    onOk?.();
    container.remove();
  };

  const cancelButton = document.createElement('button');
  cancelButton.textContent = '取消';
  cancelButton.setAttribute('data-testid', 'modal-confirm-cancel');
  cancelButton.onclick = () => {
    onCancel?.();
    container.remove();
  };

  container.appendChild(confirmButton);
  container.appendChild(cancelButton);

  return {
    destroy: () => container.remove(),
  };
};

// 模拟 antd 组件
jest.mock('antd', () => ({
  __esModule: true,
  message,
  Card: CardComponent,
  Button: ButtonComponent,
  List: ListComponent,
  Modal: ModalComponent,
  Form: FormComponent,
  Input: InputComponent,
  Space: ({ children }: any) => React.createElement('div', { 'data-testid': 'space' }, children),
  Dropdown: DropdownComponent,
})); 