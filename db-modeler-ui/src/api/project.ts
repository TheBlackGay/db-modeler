import { http } from '@/utils/http'

export interface Project {
  id: string
  name: string
  description?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  tenantId: string
}

export const projectApi = {
  getProjects(tenantId: string) {
    return http.get<Project[]>('/api/projects', {
      params: { tenantId }
    })
  },

  getProjectsByTenantId(tenantId: string) {
    return http.get<Project[]>('/api/projects', {
      params: { tenantId }
    });
  },

  getProjectById(id: string) {
    return http.get<Project>(`/api/projects/${id}`)
  },

  createProject(data: CreateProjectRequest) {
    return http.post<Project>('/api/projects', data)
  },

  updateProject(id: string, data: Partial<CreateProjectRequest>) {
    return http.put<Project>(`/api/projects/${id}`, data)
  },

  deleteProject(id: string) {
    return http.delete(`/api/projects/${id}`)
  }
}
