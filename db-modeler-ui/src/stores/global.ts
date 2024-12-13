import { defineStore } from 'pinia'
import type { Tenant } from '../api/tenant'
import type { Project, Table } from '../api/project'
import { projectApi } from '../api/project'
import type { ApiResponse } from '@/types/api'
import { ApiResponseUtil } from '@/types/api'

interface GlobalState {
  currentTenant: Tenant | null
  currentProject: Project | null
  projects: Project[]
  projectTables: Table[]
}

interface GlobalActions {
  setCurrentTenant(tenant: Tenant | null): Promise<void>
  setCurrentProject(project: Project | null): void
  loadProjectsForTenant(tenantId: string): Promise<void>
  loadProjectTables(projectId: string): Promise<void>
  clearCurrentProject(): void
  clearState(): void
  initializeState(): Promise<void>
  setProjectTables(tables: Table[]): void
}

export const useGlobalStore = defineStore<'global', GlobalState, {}, GlobalActions>('global', {
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
        throw new Error(ApiResponseUtil.getErrorMessage(error))
      }
    },

    async setCurrentProject(project: Project | null) {
      console.log('Setting current project:', project)
      if (!project) {
        console.log('Project is null, clearing project state')
        this.clearCurrentProject()
        return
      }

      try {
        this.$patch({
          currentProject: project,
          projectTables: []
        })
        
        // 加载项目的表列表
        await this.loadProjectTables(project.id)
      } catch (error) {
        console.error('Error setting current project:', error)
        this.clearCurrentProject()
        throw new Error(ApiResponseUtil.getErrorMessage(error))
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

        const projects = ApiResponseUtil.getListData(response)
        if (projects) {
          console.log('Setting projects:', projects)
          this.$patch({ projects })
        } else {
          console.error('Invalid projects response:', response)
          this.$patch({ projects: [] })
          throw new Error('加载项目列表失败：返回数据格式错误')
        }
      } catch (error) {
        console.error('Error loading projects:', error)
        this.$patch({ projects: [] })
        throw new Error(ApiResponseUtil.getErrorMessage(error))
      }
    },

    async loadProjectTables(projectId: string) {
      console.log('Loading project tables for project:', projectId)
      if (!projectId) {
        console.warn('项目 ID 为空，跳过加载表')
        return
      }

      try {
        const { data: response } = await projectApi.getProjectTables(projectId)
        console.log('Received project tables response:', response)
        
        if (response && response.code === 0 && response.data) {
          this.$patch((state) => {
            state.projectTables = response.data
          })
        } else {
          console.warn('获取表列表返回格式不正确:', response)
          this.$patch((state) => {
            state.projectTables = []
          })
          throw new Error(response?.message || '获取表列表失败：返回数据格式错误')
        }
      } catch (error) {
        console.error('Failed to load project tables:', error)
        this.$patch((state) => {
          state.projectTables = []
        })
        throw new Error(ApiResponseUtil.getErrorMessage(error))
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
      console.log('Initializing global state')
      try {
        if (this.currentTenant) {
          console.log('Found current tenant, loading projects')
          await this.loadProjectsForTenant(this.currentTenant.id)
          
          // 如果有当前项目，验证它是否在项目列表中
          if (this.currentProject) {
            console.log('Validating current project')
            const projectInList = this.projects.find(p => p.id === this.currentProject?.id)
            if (!projectInList) {
              console.log('Current project not found in list, clearing project state')
              this.clearCurrentProject()
            } else {
              console.log('Loading tables for current project')
              await this.loadProjectTables(this.currentProject.id)
            }
          }
        } else {
          console.log('No current tenant found, clearing state')
          this.clearState()
        }
      } catch (error: any) {
        console.error('Failed to initialize state:', error)
        this.clearState()
        throw new Error(error.message || '初始化状态失败')
      }
    },

    // 设置项目的数据表列表
    setProjectTables(tables: Table[]) {
      if (!tables) {
        console.warn('setProjectTables: 数据为空')
        this.projectTables = []
        return
      }
      this.projectTables = Array.isArray(tables) ? tables : []
    }
  },

  persist: {
    storage: localStorage
  }
})
