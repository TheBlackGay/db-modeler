import { http } from '@/utils/http';
import type { ApiResponse } from '@/types/api';

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
  category?: string;
  tags?: string[];
  createTime?: string;
}

// 获取字段模板列表
export const getTemplates = () => {
  return http.get<ApiResponse<FieldTemplate[]>>('/api/field-templates');
};

// 获取字段模板详情
export const getTemplateById = (id: string) => {
  return http.get<ApiResponse<FieldTemplate>>(`/api/field-templates/${id}`);
};

// 创建字段模板
export const createTemplate = (template: FieldTemplate) => {
  return http.post<ApiResponse<FieldTemplate>>('/api/field-templates', template);
};

// 更新字段模板
export const updateTemplate = (id: string, template: FieldTemplate) => {
  return http.put<ApiResponse<FieldTemplate>>(`/api/field-templates/${id}`, template);
};

// 删除字段模板
export const deleteTemplate = (id: string) => {
  return http.delete<ApiResponse<void>>(`/api/field-templates/${id}`);
};

export const getTemplatesByCategory = (categoryId: string) => {
  return request({
    url: `/api/field-templates/category/${categoryId}`,
    method: 'get'
  });
};

export const getTemplatesByTag = (tagId: string) => {
  return request({
    url: `/api/field-templates/tag/${tagId}`,
    method: 'get'
  });
};
