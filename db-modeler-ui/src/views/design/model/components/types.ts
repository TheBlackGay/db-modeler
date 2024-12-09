export interface Tag {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  parentId?: string;
  isSystem?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface PreviewField {
  id: string;
  name: string;
  type: string;
  dataType?: string;
  length?: number;
  defaultValue?: any;
  comment?: string;
  [key: string]: any;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  template: PreviewField;
  category: Category;
  tags?: Tag[];
}

export interface TemplateGroup {
  id: string;
  name: string;
  description?: string;
  templates: string[];
  isCustom: boolean;
  tags?: Tag[];
  category?: Category;
  createdAt?: number;
  updatedAt?: number;
}
