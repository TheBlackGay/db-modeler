import axios from 'axios';
import { getToken, setToken, removeToken } from '@/utils/auth';

const API_BASE_URL = 'http://localhost:5001';
const API_V1_URL = `${API_BASE_URL}/api/v1`;

// 创建两个 axios 实例：一个用于认证，一个用于 API 请求
const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const apiClient = axios.create({
  baseURL: API_V1_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API 客户端请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// API 客户端响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.error('Response error:', error);
    
    if (error.response?.status === 401) {
      removeToken();
      return Promise.reject(error);
    }
    
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        return apiClient(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

// 认证客户端响应拦截器
authClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Auth error:', error);
    if (error.response && error.response.status === 401) {
      // 清除令牌并重定向到登录页面
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证服务
export const authService = {
  async login(username: string, password: string) {
    try {
      const response = await authClient.post('/api/v1/auth/login', { username, password });
      if (response.token) {
        setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData: { username: string; email: string; password: string }) {
    return authClient.post('/api/v1/auth/register', userData);
  },

  async sendPasswordResetCode(email: string) {
    return authClient.post('/api/v1/auth/reset-code', { email });
  },

  async resetPassword(resetData: { email: string; verificationCode: string; newPassword: string }) {
    return authClient.post('/api/v1/auth/reset-password', resetData);
  },

  async profile() {
    try {
      const token = getToken();
      console.log('Current token:', token);
      const response = await apiClient.get('/auth/profile');
      return response;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  },

  async updateProfile(data: FormData) {
    return apiClient.put('/auth/profile', data);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return apiClient.put('/auth/change-password', data);
  }
};

// 数据库服务
export const databaseService = {
  // 获取数据库列表
  listDatabases(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    type?: string;
  }): Promise<{
    total: number;
    page: number;
    pageSize: number;
    data: any[];
  }> {
    return apiClient.get('/database', { params }).then(response => {
      if (!response) {
        throw new Error('获取数据库列表失败');
      }
      return {
        total: response.total || 0,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        data: response.databases || []
      };
    });
  },

  // 创建新数据库
  createDatabase(data: any): Promise<any> {
    return apiClient.post('/database', data);
  },

  // 更新数据库
  updateDatabase(id: string, data: any): Promise<any> {
    return apiClient.put(`/database/${id}`, data);
  },

  // 删除数据库
  deleteDatabase(id: string): Promise<void> {
    return apiClient.delete(`/database/${id}`);
  },

  // 测试数据库连接
  testConnection(data: any): Promise<{ success: boolean; message: string }> {
    return apiClient.post('/database/test', data);
  }
};

// 表结构服务
export const tableSchemaService = {
  list: (databaseId: string) => apiClient.get(`/databases/${databaseId}/table-schemas`),
  get: (id: string) => apiClient.get(`/table-schemas/${id}`),
  create: (data: any) => apiClient.post('/table-schemas', data),
  update: (id: string, data: any) => apiClient.put(`/table-schemas/${id}`, data),
  delete: (id: string) => apiClient.delete(`/table-schemas/${id}`),
  generateSQL: (tableSchemaId: string) => apiClient.get(`/table-schemas/${tableSchemaId}/generate-sql`)
};

// 管理员服务
export const adminService = {
  getStatistics: () => apiClient.get('/statistics'),
  
  listUsers: () => apiClient.get('/users'),
  
  createUser: (data: {
    username: string;
    email: string;
    role: string;
    password: string;
  }) => apiClient.post('/users', data),
  
  updateUser: (id: string, data: {
    username?: string;
    email?: string;
    role?: string;
  }) => apiClient.put(`/users/${id}`, data),
  
  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),
  
  listDatabases: () => apiClient.get('/databases'),
  
  listTableSchemas: () => apiClient.get('/table-schemas'),

  // 审计日志服务
  getAuditLogs: (params: {
    page?: number;
    pageSize?: number;
    startDate?: string | null;
    endDate?: string | null;
    actionType?: string | null;
    entityType?: string | null;
  }) => apiClient.get('/audit-logs', { params })
};

export default apiClient;
