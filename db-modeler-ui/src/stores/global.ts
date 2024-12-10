import { defineStore } from 'pinia'
import type { Tenant } from '../api/tenant'
import type { Project } from '../api/project'
import { getProjectTables, projectApi } from '../api/project'

interface GlobalState {
  currentTenant: Tenant | null
  currentProject: Project | null
  projects: Project[]
  projectTables: any[]
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    currentTenant: null,
    currentProject: null,
    projects: [],
    projectTables: []
  }),

  actions: {
    async setCurrentTenant(tenant: Tenant | null) {
      console.log('Setting current tenant:', tenant)
      if (!tenant) {
        console.log('Tenant is null, clearing state')
        this.clearState()
        return
      }

      try {
        console.log('Updating current tenant:', tenant)
        this.$patch({
          currentTenant: tenant,
          currentProject: null,
          projects: [],
          projectTables: []
        })
        
        // 加载租户的项目列表
        await this.loadProjectsForTenant(tenant.id)
      } catch (error) {
        console.error('Error setting current tenant:', error)
        this.clearState()
      }
    },

    setCurrentProject(project: Project | null) {
      console.log('Setting current project:', project)
      try {
        this.$patch({
          currentProject: project,
          projectTables: []
        })
        
        if (project?.id) {
          console.log('Loading tables for project:', project.id)
          this.loadProjectTables(project.id)
        }
      } catch (error) {
        console.error('Error setting current project:', error)
        this.clearCurrentProject()
      }
    },

    async loadProjectsForTenant(tenantId: string) {
      console.log('Loading projects for tenant:', tenantId)
      if (!tenantId) {
        console.warn('租户 ID 为空，跳过加载项目')
        return
      }

      try {
        const response = await projectApi.getProjects(tenantId)
        console.log('Projects response:', response)

        if (response.code === 0 && Array.isArray(response.data)) {
          console.log('Setting projects:', response.data)
          this.$patch({ projects: response.data })
        } else {
          console.error('Invalid projects response:', response)
          throw new Error(response.message || '加载项目列表失败')
        }
      } catch (error: any) {
        console.error('Error loading projects:', error)
        this.$patch({ projects: [] })
        throw new Error(error.message || '加载项目列表失败：未知错误')
      }
    },

    async loadProjectTables(projectId: string) {
      console.log('Loading project tables for project:', projectId)
      try {
        const response = await projectApi.getProjectTables(projectId)
        console.log('Received project tables response:', response)
        if (response.code === 0 && Array.isArray(response.data)) {
          this.$patch((state) => {
            state.projectTables = response.data
          })
        } else {
          console.warn('获取表列表返回格式不正确:', response)
          this.$patch((state) => {
            state.projectTables = []
          })
        }
      } catch (error) {
        console.error('Failed to load project tables:', error)
        this.$patch((state) => {
          state.projectTables = []
        })
      }
    },

    clearCurrentProject() {
      this.$patch((state) => {
        state.currentProject = null
        state.projectTables = []
      })
    },

    clearState() {
      this.$patch((state) => {
        state.currentTenant = null
        state.currentProject = null
        state.projects = []
        state.projectTables = []
      })
    },

    // 初始化状态
    async initializeState() {
      if (this.currentTenant) {
        try {
          await this.loadProjectsForTenant(this.currentTenant.id);
          
          // 如果有当前项目，验证它是否在项目列表中
          if (this.currentProject) {
            const projectInList = this.projects.find(p => p.id === this.currentProject?.id);
            if (!projectInList) {
              this.currentProject = null;
            }
          }
        } catch (error) {
          console.error('初始化状态失败:', error);
          this.clearState();
        }
      }
    },

    // 设置项目的数据表列表
    setProjectTables(tables: any) {
      if (!tables) {
        console.warn('setProjectTables: 数据为空')
        this.projectTables = []
        return
      }
      this.projectTables = Array.isArray(tables) ? tables : []
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'global',
        storage: localStorage,
        paths: ['currentTenant', 'currentProject', 'projects', 'projectTables']
      }
    ]
  }
})
