import { http } from '@/utils/http';
import type { ListResponse } from '@/types/api';

export enum TemplateCategory {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
  SYSTEM = 'SYSTEM'
}

export interface FieldTemplate {
  id?: string;
  name: string;
  fieldName: string;
  dataType: string;
  length?: number;
  precision?: number;
  nullable: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  defaultValue?: string;
  comment?: string;
  category?: TemplateCategory;
  tags?: string[];
  createTime?: string;
}

// 获取字段模板列表
export const getTemplates = () => {
  return http.get<ListResponse<FieldTemplate>>('/api/field-templates');
};

// 获取字段模板详情
export const getTemplateById = (id: string) => {
  return http.get<FieldTemplate>(`/api/field-templates/${id}`);
};

// 创建字段模板
export const createTemplate = (template: FieldTemplate) => {
  if (template.category) {
    template.category = template.category.toUpperCase() as TemplateCategory;
  }
  return http.post<FieldTemplate>('/api/field-templates', template);
};

// 更新字段模板
export const updateTemplate = (id: string, template: FieldTemplate) => {
  if (template.category) {
    template.category = template.category.toUpperCase() as TemplateCategory;
  }
  return http.put<FieldTemplate>(`/api/field-templates/${id}`, template);
};

// 删除字段模板
export const deleteTemplate = (id: string) => {
  return http.delete<void>(`/api/field-templates/${id}`);
};

// 根据分类获取模板
export const getTemplatesByCategory = (categoryId: string) => {
  return http.get<ListResponse<FieldTemplate>>(`/api/field-templates/category/${categoryId}`);
};

// 根据标签获取模板
export const getTemplatesByTag = (tagId: string) => {
  return http.get<ListResponse<FieldTemplate>>(`/api/field-templates/tag/${tagId}`);
};
