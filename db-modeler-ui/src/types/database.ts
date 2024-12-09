export interface DatabaseConfig {
  id?: string
  projectId: string
  name: string
  description?: string
  type: 'MYSQL' | 'POSTGRESQL'
  host: string
  port: number
  databaseName: string
  username: string
  password: string
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  createdAt?: string
  updatedAt?: string
}

export interface DatabaseConfigForm extends Omit<DatabaseConfig, 'id' | 'status' | 'createdAt' | 'updatedAt'> {
  id?: string
}

export interface DatabaseConfigListItem extends Pick<DatabaseConfig, 'id' | 'name' | 'type' | 'host' | 'databaseName' | 'status'> {
  projectId: string
}

export interface DatabaseConnectionTest {
  projectId: string
  type: string
  host: string
  port: string
  database: string
  username: string
  password: string
}
