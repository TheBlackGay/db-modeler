import type { TableInfo } from '@/views/design/model/types'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface Project {
  id: string
  name: string
  description?: string
  tenantId: string
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  code: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export type { TableInfo } 