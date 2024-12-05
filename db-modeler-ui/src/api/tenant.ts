import { http } from '@/utils/http'

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
  getTenants: getTenants,
  createTenant: createTenant,
  updateTenant: updateTenant,
  deleteTenant: deleteTenant
}

function getTenants() {
  return http.get<Tenant[]>('/api/tenants')
}

function createTenant(data: CreateTenantRequest) {
  return http.post<Tenant>('/api/tenants', data)
}

function updateTenant(id: string, data: Partial<CreateTenantRequest>) {
  return http.put<Tenant>(`/api/tenants/${id}`, data)
}

function deleteTenant(id: string) {
  return http.delete(`/api/tenants/${id}`)
}
