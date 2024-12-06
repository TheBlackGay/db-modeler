import { defineStore } from 'pinia'
import type { Tenant, Project } from '../api/tenant'
import { projectApi as projectApiInstance } from '../api/project' // assume projectApi is defined in this file

interface GlobalState {
  currentTenant: Tenant | null
  currentProject: Project | null
  projects: Project[]
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    currentTenant: null,
    currentProject: null,
    projects: []
  }),
  
  actions: {
    async setCurrentTenant(tenant: Tenant | null) {
      if (this.currentTenant?.id !== tenant?.id && tenant) { // 只有在租户更改时才调用
        this.currentTenant = tenant;
        await this.loadProjectsForTenant(tenant.id); // 调用 loadProjects 方法
      } else if (!tenant) {
        this.currentTenant = null;
        this.currentProject = null;
      }
    },
    setCurrentProject(project: Project | null) {
      this.currentProject = project;
    },
    async loadProjectsForTenant(tenantId: string) {
      console.log(`开始加载租户 ID: ${tenantId}`);
      try {
        console.log('调用项目 API 获取项目列表...');
        const response = await projectApiInstance.getProjectsByTenantId(tenantId);
        console.log('项目 API 响应状态:', response.status);
        console.log('返回的项目数据:', response.data);
        this.projects = response.data;
        console.log('解析项目数据完成，共计项目数:', this.projects.length);
        if (this.projects.length > 0) {
          console.log('设置当前项目为第一个项目...');
          this.currentProject = this.projects[0];
        } else {
          console.log('没有可用的项目，设置当前项目为 null...');
          this.currentProject = null;
        }
      } catch (error) {
        console.error('加载项目失败:', error);
        console.log('设置当前项目为 null...');
        this.currentProject = null;
      }
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'global-store',
        storage: localStorage
      }
    ]
  }
})
