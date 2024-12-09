export interface TableField {
  id: string
  name: string
  type: string
  length?: number
  scale?: number
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean
  defaultValue?: string
  comment?: string
}

export interface Table {
  id: string
  code: string
  displayName: string
  comment?: string
  type: 'TABLE' | 'VIEW'
  domain: 'BUSINESS' | 'SYSTEM'
  fields: TableField[]
  createTime: string
  updateTime: string
}

export interface CreateTableRequest {
  code: string
  displayName: string
  comment?: string
  type: 'TABLE' | 'VIEW'
  domain: 'BUSINESS' | 'SYSTEM'
  projectId: string
}

export interface UpdateTableRequest {
  id: string
  code?: string
  displayName?: string
  comment?: string
  type?: 'TABLE' | 'VIEW'
  domain?: 'BUSINESS' | 'SYSTEM'
  fields?: TableField[]
}

export interface TableListItem {
  id: string
  code: string
  displayName: string
  comment?: string
  type: 'TABLE' | 'VIEW'
  domain: 'BUSINESS' | 'SYSTEM'
  fieldCount: number
  updateTime: string
}
