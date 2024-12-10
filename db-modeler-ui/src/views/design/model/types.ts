export interface TableInfo {
  id?: string
  code: string
  displayName: string
  comment: string
  type: 'TABLE' | 'VIEW'
  domain: 'BUSINESS' | 'SYSTEM'
  columns: string
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  metadata: string
  createdBy?: string
  synced: boolean
  projectId: string
  createdAt?: string
  updatedAt?: string
}

export interface TableMetadata {
  dbType: string
  engine: string
  charset: string
  collate: string
  tablespace: string
  rowFormat: string
  autoIncrement?: number
  partitionConfig?: any
}

export interface TableColumns {
  fields: Field[]
  indexes: Index[]
}

export interface Field {
  id?: string
  name: string
  displayName: string
  dataType: string
  length: number
  precision: number
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean
  defaultValue: string
  comment: string
}

export interface Index {
  id?: string
  name: string
  type: 'PRIMARY' | 'UNIQUE' | 'INDEX' | 'FULLTEXT'
  columns: string[]
  comment?: string
} 