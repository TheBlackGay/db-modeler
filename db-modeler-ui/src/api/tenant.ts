import { http } from '@/utils/http'
import type { ListResponse, DetailResponse } from '@/types/api'

export interface Tenant {
  id: string
  name: string
  code: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  code: string
  description?: string
}

export const tenantApi = {
  // 获取所有租户
  getTenants() {
    return http.get<ListResponse<Tenant>>('/api/tenants')
  },

  // 获取租户详情
  getTenantById(id: string) {
    return http.get<DetailResponse<Tenant>>(`/api/tenants/${id}`)
  },

  // 创建租户
  createTenant(data: CreateTenantRequest) {
    return http.post<DetailResponse<Tenant>>('/api/tenants', data)
  },

  // 更新租户
  updateTenant(id: string, data: Partial<CreateTenantRequest>) {
    return http.put<DetailResponse<Tenant>>(`/api/tenants/${id}`, data)
  },

  // 删除租户
  deleteTenant(id: string) {
    return http.delete<DetailResponse<void>>(`/api/tenants/${id}`)
  }
}

export const {
  getTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant
} = tenantApi
