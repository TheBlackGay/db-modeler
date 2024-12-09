import request from '@/utils/request';
import type { FieldTemplate } from '@/views/design/model/components/types';

export const getTemplates = () => {
  return request({
    url: '/api/field-templates',
    method: 'get'
  });
};

export const getTemplate = (id: string) => {
  return request({
    url: `/api/field-templates/${id}`,
    method: 'get'
  });
};

export const createTemplate = (template: Partial<FieldTemplate>) => {
  return request({
    url: '/api/field-templates',
    method: 'post',
    data: template
  });
};

export const updateTemplate = (id: string, template: Partial<FieldTemplate>) => {
  return request({
    url: `/api/field-templates/${id}`,
    method: 'put',
    data: template
  });
};

export const deleteTemplate = (id: string) => {
  return request({
    url: `/api/field-templates/${id}`,
    method: 'delete'
  });
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
