import http from '@/utils/http'
import type { DatabaseConfig } from '@/types/database'

export function getDatabaseConfigs(projectId: string) {
  return http.get<DatabaseConfig[]>(`/api/projects/${projectId}/database-configs`)
}

export function getDatabaseConfig(projectId: string, configId: string) {
  return http.get<DatabaseConfig>(`/api/projects/${projectId}/database-configs/${configId}`)
}

export function createDatabaseConfig(projectId: string, data: DatabaseConfig) {
  return http.post<DatabaseConfig>(`/api/projects/${projectId}/database-configs`, data)
}

export function updateDatabaseConfig(projectId: string, configId: string, data: DatabaseConfig) {
  return http.put<DatabaseConfig>(`/api/projects/${projectId}/database-configs/${configId}`, data)
}

export function deleteDatabaseConfig(projectId: string, configId: string) {
  return http.delete(`/api/projects/${projectId}/database-configs/${configId}`)
}

export function testDatabaseConnection(projectId: string, data: DatabaseConfig) {
  return http.post<boolean>(`/api/projects/${projectId}/database-configs/test-connection`, data)
}
