import { http } from '../utils/http'
import type { Table, Field, Diagram, CreateTableRequest, UpdateTableRequest, TableListItem } from '@/types/table'

export interface CreateTableRequest {
  name: string
  comment?: string
  projectId: string
  fields?: Field[]
}

export interface UpdateTableRequest {
  id: string
  name: string
  comment?: string
  projectId: string
  fields?: Field[]
  x?: number
  y?: number
}

export interface CreateDiagramRequest {
  name: string
  projectId: string
}

export interface UpdateDiagramRequest {
  id: string
  name: string
  projectId: string
  tables: Table[]
}

// 表格相关接口
export const getTableList = (projectId: string) => {
  return http.get<TableListItem[]>(`/api/table-designs?projectId=${projectId}`)
}

export const getTableDetail = (projectId: string, tableId: string) => {
  return http.get<Table>(`/api/table-designs/${tableId}`)
}

export const createTable = (data: CreateTableRequest) => {
  return http.post<Table>('/api/table-designs', data)
}

export const updateTable = (data: UpdateTableRequest) => {
  return http.put<Table>(`/api/table-designs/${data.id}`, data)
}

export const deleteTable = (projectId: string, tableId: string) => {
  return http.delete(`/api/table-designs/${tableId}`)
}

// 关系图相关接口
export const getDiagrams = (projectId: string) => {
  return http.get<Diagram[]>(`/api/projects/${projectId}/diagrams`)
}

export const getDiagram = (diagramId: string) => {
  return http.get<Diagram>(`/api/diagrams/${diagramId}`)
}

export const createDiagram = (data: CreateDiagramRequest) => {
  return http.post<Diagram>(`/api/projects/${data.projectId}/diagrams`, data)
}

export const updateDiagram = (data: UpdateDiagramRequest) => {
  return http.put<Diagram>(`/api/diagrams/${data.id}`, data)
}

export const deleteDiagram = (diagramId: string) => {
  return http.delete(`/api/diagrams/${diagramId}`)
}
