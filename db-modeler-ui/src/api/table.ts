import { http } from '@/utils/http'
import type { ApiResponse, PageResult, ListResponse, DetailResponse, PageResponse } from '@/types/api'
import type { Table, TableDTO, TableQuery } from '@/types/table'

export const tableApi = {
  // 获取表列表
  getTableList(projectId: string) {
    return http.get<ListResponse<Table>>(`/api/projects/${projectId}/tables`)
  },

  // 创建表
  createTable(projectId: string, data: Partial<Table>) {
    return http.post<DetailResponse<Table>>(`/api/projects/${projectId}/tables`, data)
  },

  // 更新表
  updateTable(projectId: string, tableId: string, data: Partial<Table>) {
    return http.put<DetailResponse<Table>>(`/api/projects/${projectId}/tables/${tableId}`, data)
  },

  // 删除表
  deleteTable(projectId: string, tableId: string) {
    return http.delete<ApiResponse<void>>(`/api/projects/${projectId}/tables/${tableId}`)
  },

  // 获取表设计列表
  getTableDesigns(query: TableQuery) {
    return http.get<ListResponse<TableDTO>>('/api/table-designs', {
      params: query
    })
  },

  // 获取表设计分页列表
  getTableDesignsPage(query: TableQuery) {
    return http.get<PageResponse<TableDTO>>('/api/table-designs/page', {
      params: query
    })
  },

  // 获取表设计详情
  getTableDesignById(id: string) {
    if (!id) {
      throw new Error('表ID不能为空')
    }
    return http.get<DetailResponse<TableDTO>>(`/api/table-designs/${id}/detail`)
  },

  // 创建表设计
  createTableDesign(data: Partial<TableDTO>) {
    return http.post<DetailResponse<TableDTO>>('/api/table-designs', data)
  },

  // 更新表设计
  updateTableDesign(id: string, data: Partial<TableDTO>) {
    if (!id) {
      throw new Error('表ID不能为空')
    }
    return http.put<DetailResponse<TableDTO>>(`/api/table-designs/${id}`, data)
  },

  // 删除表设计
  deleteTableDesign(id: string) {
    return http.delete<ApiResponse<void>>(`/api/table-designs/${id}`)
  },

  // 同步表设计到数据库
  syncTableDesign(id: string) {
    if (!id) {
      throw new Error('表ID不能为空')
    }
    return http.post<ApiResponse<void>>(`/api/table-designs/${id}/sync`)
  },

  // 预览表DDL
  previewTableDDL(id: string) {
    if (!id) {
      throw new Error('表ID不能为空')
    }
    return http.get<DetailResponse<{
      ddl: string
      type: string
      tableName: string
      status: string
    }>>(`/api/table-designs/${id}/preview-ddl`)
  },

  // 导入表设计
  importTableDesign(projectId: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectId', projectId)
    return http.post<DetailResponse<TableDTO>>('/api/table-designs/import', formData)
  },

  // 批量导出表DDL
  exportTableDDL(tableIds: string[]) {
    return http.post('/api/table-designs/export', { tableIds }, { responseType: 'blob' })
  },

  // 验证表名
  validateTableName(projectId: string, name: string) {
    return http.post<DetailResponse<{
      valid: boolean
      message: string
    }>>('/api/table-designs/validate', { projectId, name })
  },

  // 复制表设计
  copyTableDesign(id: string, newName: string) {
    if (!id) {
      throw new Error('表ID不能为空')
    }
    return http.post<DetailResponse<TableDTO>>(`/api/table-designs/${id}/copy`, { newName })
  },

  // 同步所有表到数据库
  syncAllTableDesigns() {
    return http.post<ListResponse<TableDTO>>('/api/table-designs/sync-all')
  },

  // 预览所有表DDL
  previewAllTableDDL() {
    return http.get<ListResponse<{
      ddl: string
      type: string
      tableName: string
      status: string
    }>>('/api/table-designs/preview-all-ddl')
  }
}

export const {
  getTableList,
  createTable,
  updateTable,
  deleteTable,
  getTableDesigns,
  getTableDesignsPage,
  getTableDesignById,
  createTableDesign,
  updateTableDesign,
  deleteTableDesign,
  syncTableDesign,
  previewTableDDL,
  importTableDesign,
  exportTableDDL,
  validateTableName,
  copyTableDesign,
  syncAllTableDesigns,
  previewAllTableDDL
} = tableApi
