import { http } from '@/utils/http';
import type { ApiResponse } from '@/types/api';
import type { FieldTemplate } from '@/types/table';

export interface CreateFieldTemplateRequest {
  name: string;
  category: string;
  description?: string;
  field: {
    name: string;
    displayName: string;
    comment: string;
    dataType: string;
    length?: number;
    precision?: number;
    scale?: number;
    nullable: boolean;
    defaultValue?: string;
    primaryKey: boolean;
    autoIncrement: boolean;
    unsigned: boolean;
    zerofill: boolean;
    binary: boolean;
    charset?: string;
    collation?: string;
    enumValues?: string[];
  };
}

export const templateApi = {
  // 获取所有字段模板
  getFieldTemplates() {
    return http.get<ApiResponse<FieldTemplate[]>>('/api/field-templates');
  },

  // 获取字段模板详情
  getFieldTemplateById(id: string) {
    return http.get<ApiResponse<FieldTemplate>>(`/api/field-templates/${id}`);
  },

  // 创建字段模板
  createFieldTemplate(data: CreateFieldTemplateRequest) {
    return http.post<ApiResponse<FieldTemplate>>('/api/field-templates', data);
  },

  // 更新字段模板
  updateFieldTemplate(id: string, data: Partial<CreateFieldTemplateRequest>) {
    return http.put<ApiResponse<FieldTemplate>>(`/api/field-templates/${id}`, data);
  },

  // 删除字段模板
  deleteFieldTemplate(id: string) {
    return http.delete<ApiResponse<void>>(`/api/field-templates/${id}`);
  },

  // 按分类获取字段模板
  getFieldTemplatesByCategory(categoryId: string) {
    return http.get<ApiResponse<FieldTemplate[]>>(`/api/field-templates/category/${categoryId}`);
  },

  // 按标签获取字段模板
  getFieldTemplatesByTag(tagId: string) {
    return http.get<ApiResponse<FieldTemplate[]>>(`/api/field-templates/tag/${tagId}`);
  }
};

export const {
  getFieldTemplates,
  getFieldTemplateById,
  createFieldTemplate,
  updateFieldTemplate,
  deleteFieldTemplate,
  getFieldTemplatesByCategory,
  getFieldTemplatesByTag
} = templateApi;
