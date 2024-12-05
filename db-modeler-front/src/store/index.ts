import { atom } from 'recoil';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export const userState = atom<UserState>({
  key: 'userState',
  default: {
    isAuthenticated: false,
    user: null,
    token: null
  }
});

export interface DatabaseState {
  items: Array<{
    id: string;
    name: string;
    type: string;
    description?: string;
    host: string;
    port: number;
    status: string;
    lastSync?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
  loading: boolean;
  error: string | null;
  selectedDatabase: {
    id: string;
    name: string;
    type: string;
    description?: string;
    host: string;
    port: number;
    status: string;
    lastSync?: string;
  } | null;
}

export const databaseState = atom<DatabaseState>({
  key: 'databaseState',
  default: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    selectedDatabase: null
  }
});

export interface TableSchemaState {
  id: string;
  name: string;
  databaseId: string;
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    primaryKey: boolean;
    unique: boolean;
  }>;
}

export const tableSchemaState = atom<TableSchemaState[]>({
  key: 'tableSchemaState',
  default: []
});
