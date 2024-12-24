import type { Table } from '../../../types/models';

export interface Template {
  id: string;
  name: string;
  content: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SQLTemplateVariable {
  name: string;
  description: string;
  defaultValue?: string;
  type: 'string' | 'number' | 'boolean' | 'date';
}

export interface SQLTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  dialect: string;
  variables: SQLTemplateVariable[];
  categoryId?: string;
  tags?: string[];
  isBuiltin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SQLTemplateCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  order: number;
  isBuiltin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SQLTemplatePreview {
  template: SQLTemplate;
  table: Table;
  variables: Record<string, string>;
  sql: string;
} 