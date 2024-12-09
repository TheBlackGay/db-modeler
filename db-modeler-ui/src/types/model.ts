export interface DataModel {
  id: string
  name: string
  dbType: string
  version: string
  description?: string
  createTime: string
  updateTime: string
  tables: ModelTable[]
}

export interface ModelTable {
  id: string
  name: string
  comment?: string
  engine?: string
  charset?: string
  fields: number
  createTime: string
  updateTime: string
}

export interface CreateModelRequest {
  name: string
  dbType: string
  version: string
  description?: string
  projectId: string
}

export interface UpdateModelRequest {
  id: string
  name?: string
  dbType?: string
  version?: string
  description?: string
}

export interface ModelListItem {
  id: string
  name: string
  dbType: string
  version: string
  tableCount: number
  updateTime: string
}
