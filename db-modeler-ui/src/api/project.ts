import { http } from '@/utils/http'
import type { ListResponse, DetailResponse, PageResponse } from '@/types/api'

export interface Project {
  id: string
  name: string
  description?: string
  tenantId: string
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  createdAt: string
  updatedAt: string
}

export interface Table {
  id: string
  code: string
  displayName: string
  comment?: string
  type: 'TABLE'
  domain: string
  columns: any[] | null
  status: string
  metadata: any | null
  createdBy: string | null
  synced: boolean
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface TableField {
  id: string
  name: string
  type: string
  length?: number
  nullable: boolean
  defaultValue?: string
  comment?: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  tenantId: string
}

export const projectApi = {
  getProjects(tenantId: string) {
    return http.get<ListResponse<Project>>('/api/projects', {
      params: { tenantId }
    })
  },

  getProjectsPage(tenantId: string, current: number, pageSize: number) {
    return http.get<PageResponse<Project>>('/api/projects/page', {
      params: { tenantId, current, pageSize }
    })
  },

  getProjectById(id: string) {
    return http.get<DetailResponse<Project>>(`/api/projects/${id}`)
  },

  createProject(data: CreateProjectRequest) {
    return http.post<DetailResponse<Project>>('/api/projects', data)
  },

  updateProject(id: string, data: Partial<CreateProjectRequest>) {
    return http.put<DetailResponse<Project>>(`/api/projects/${id}`, data)
  },

  deleteProject(id: string) {
    return http.delete<DetailResponse<void>>(`/api/projects/${id}`)
  },

  // 获取项目的数据表列表
  getProjectTables(projectId: string) {
    return http.get<ListResponse<Table>>(`/api/table-designs`, {
      params: { projectId }
    })
  },

  // 获取数据表详情
  getTableById(projectId: string, tableId: string) {
    return http.get<DetailResponse<Table>>(`/api/projects/${projectId}/tables/${tableId}`)
  },

  // 获取表设计详情
  getTableDesignById(id: string) {
    return http.get<DetailResponse<Table>>(`/api/table-designs/detail/${id}`)
  },

  // 保存表设计
  saveTableDesign(data: Table) {
    if (data.id) {
      return http.put<DetailResponse<Table>>(`/api/table-designs/${data.id}`, data)
    } else {
      return http.post<DetailResponse<Table>>('/api/table-designs', data)
    }
  }
}

export const {
  getProjects,
  getProjectsPage,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectTables,
  getTableById,
  getTableDesignById,
  saveTableDesign
} = projectApi
