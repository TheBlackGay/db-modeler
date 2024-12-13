import { http } from '@/utils/http'
import type { ApiResponse } from '@/types/api'

export interface Tenant {
  id: string
  name: string
  code: string
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  code: string
}

export interface UpdateTenantRequest {
  id: string
  name?: string
  code?: string
}

export const tenantApi = {
  getTenants() {
    return http.get<ApiResponse<Tenant[]>>('/api/tenants')
  },

  getTenantById(id: string) {
    return http.get<ApiResponse<Tenant>>(`/api/tenants/${id}`)
  },

  createTenant(data: CreateTenantRequest) {
    return http.post<ApiResponse<Tenant>>('/api/tenants', data)
  },

  updateTenant(id: string, data: Partial<CreateTenantRequest>) {
    return http.put<ApiResponse<Tenant>>(`/api/tenants/${id}`, data)
  },

  deleteTenant(id: string) {
    return http.delete<ApiResponse<void>>(`/api/tenants/${id}`)
  }
}

export const {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant
} = tenantApi
