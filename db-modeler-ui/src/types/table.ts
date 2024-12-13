export interface Table {
  id: string
  name: string
  displayName: string
  comment: string
  type: TableType
  domain: TableDomain
  dbType: string
  engine: string
  charset: string
  collation: string
  tablespace?: string
  autoIncrement?: number
  rowFormat?: string
  fields: Field[]
  indexes: Index[]
  status: TableStatus
  synced: boolean
}

export interface TableDTO {
  id: string
  code: string
  displayName: string
  comment: string
  type: TableType
  domain: TableDomain
  columns: string | {
    fields: Field[]
    indexes: Index[]
  }
  metadata: string | {
    dbType: string
    engine: string
    charset: string
    collation: string
    tablespace?: string
    autoIncrement?: number
    rowFormat?: string
  }
  status: TableStatus
  synced: boolean
  projectId: string
}

export interface Field {
  id: string
  name: string
  displayName: string
  comment: string
  dataType: string
  length?: number
  precision?: number
  scale?: number
  nullable: boolean
  defaultValue?: string
  primaryKey: boolean
  autoIncrement: boolean
  unsigned: boolean
  zerofill: boolean
  binary: boolean
  charset?: string
  collation?: string
  enumValues?: string[]
  position: number
}

export interface Index {
  id: string
  name: string
  type: IndexType
  method: IndexMethod
  fields: IndexField[]
  comment: string
}

export interface IndexField {
  fieldName: string
  length?: number
  sort: 'ASC' | 'DESC'
}

export enum TableType {
  TABLE = 'TABLE',
  VIEW = 'VIEW',
  MATERIALIZED_VIEW = 'MATERIALIZED_VIEW'
}

export enum TableDomain {
  BUSINESS = 'BUSINESS',
  SYSTEM = 'SYSTEM',
  REFERENCE = 'REFERENCE'
}

export enum TableStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum IndexType {
  PRIMARY = 'PRIMARY',
  UNIQUE = 'UNIQUE',
  NORMAL = 'NORMAL',
  FULLTEXT = 'FULLTEXT',
  SPATIAL = 'SPATIAL'
}

export enum IndexMethod {
  BTREE = 'BTREE',
  HASH = 'HASH',
  RTREE = 'RTREE'
}

export enum DataTypeCategory {
  NUMERIC = 'NUMERIC',
  STRING = 'STRING',
  DATE = 'DATE',
  BINARY = 'BINARY',
  SPATIAL = 'SPATIAL',
  JSON = 'JSON',
  OTHER = 'OTHER'
}

export interface FieldTemplate {
  id: string
  name: string
  category: string
  description: string
  field: Omit<Field, 'id' | 'position'>
}

export interface TableQuery {
  projectId: string
  page?: number
  pageSize?: number
  keyword?: string
  type?: TableType
  domain?: TableDomain
  status?: TableStatus
}
