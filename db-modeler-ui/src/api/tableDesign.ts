import { http } from '@/utils/http'
import type { CreateTableRequest, UpdateTableRequest, Table, TableListItem } from '@/types/table'

// 获取表设计列表
export const getTableDesigns = () => {
  return http.get<TableListItem[]>('/api/table-designs')
}

// 获取单个表设计
export const getTableDesign = (id: string) => {
  return http.get<Table>(`/api/table-designs/${id}`)
}

// 创建表设计
export const createTableDesign = (data: CreateTableRequest) => {
  return http.post<Table>('/api/table-designs', data)
}

// 更新表设计
export const updateTableDesign = (id: string, data: UpdateTableRequest) => {
  return http.put<Table>(`/api/table-designs/${id}`, data)
}

// 删除表设计
export const deleteTableDesign = (id: string) => {
  return http.delete(`/api/table-designs/${id}`)
}

// 同步单个表到数据库
export const syncTableToDatabase = (id: string) => {
  return http.post<Table>(`/api/table-designs/${id}/sync`)
}

// 同步所有表到数据库
export const syncAllTablesToDatabase = () => {
  return http.post<Table[]>('/api/table-designs/sync-all')
}

// 预览单个表的DDL
export const previewTableDDL = (id: string) => {
  return http.get<{ ddl: string }>(`/api/table-designs/${id}/preview-ddl`)
}

// 预览所有未同步表的DDL
export const previewAllTablesDDL = () => {
  return http.get<Array<{ tableName: string; ddl: string }>>('/api/table-designs/preview-all-ddl')
}
