import { defineStore } from 'pinia';
import type { Template, TemplateGroup } from '@/views/design/model/components/types';
import { 
  getTemplates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getTemplatesByCategory,
  getTemplatesByTag
} from '@/api/template';

export const useTemplateStore = defineStore('template', {
  state: () => ({
    templates: [] as Template[],
    groups: [] as TemplateGroup[],
    recentTemplates: [] as string[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    getTemplateById: (state) => (id: string) => 
      state.templates.find(t => t.id === id),

    getGroupById: (state) => (id: string) =>
      state.groups.find(g => g.id === id),

    findTemplateIdByField: (state) => (field: any) =>
      state.templates.find(t => t.template.id === field.id)?.id,
  },

  actions: {
    // 模板相关
    async loadTemplates() {
      try {
        this.loading = true;
        const response = await getTemplates();
        this.templates = response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTemplate(template: Template) {
      try {
        this.loading = true;
        const response = await createTemplate(template);
        this.templates.push(response.data);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTemplate(template: Template) {
      try {
        this.loading = true;
        const response = await updateTemplate(template.id, template);
        const index = this.templates.findIndex(t => t.id === template.id);
        if (index > -1) {
          this.templates[index] = response.data;
        }
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTemplate(id: string) {
      try {
        this.loading = true;
        await deleteTemplate(id);
        this.templates = this.templates.filter(t => t.id !== id);
        this.removeFromRecent(id);
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadTemplatesByCategory(categoryId: string) {
      try {
        this.loading = true;
        const response = await getTemplatesByCategory(categoryId);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loadTemplatesByTag(tagId: string) {
      try {
        this.loading = true;
        const response = await getTemplatesByTag(tagId);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 最近使用相关
    updateRecentTemplates(templateIds: string[]) {
      this.recentTemplates = [...new Set([...templateIds, ...this.recentTemplates])].slice(0, 10);
    },

    removeFromRecent(templateId: string) {
      this.recentTemplates = this.recentTemplates.filter(id => id !== templateId);
    },

    clearRecentTemplates() {
      this.recentTemplates = [];
    },
  },
});
