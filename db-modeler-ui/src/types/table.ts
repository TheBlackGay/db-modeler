export interface Field {
  id: string
  name: string
  type: string
  length?: number
  isPrimary: boolean
  isNull?: boolean
  defaultValue?: string
  comment?: string
}

export interface Table {
  id: string
  name: string
  comment?: string
  projectId: string
  x?: number
  y?: number
  fields: Field[]
  createdAt?: string
  updatedAt?: string
}

export interface Diagram {
  id: string
  name: string
  projectId: string
  tables: Table[]
  createdAt?: string
  updatedAt?: string
}

export interface TablePosition {
  id: string
  x: number
  y: number
}
