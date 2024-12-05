import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8010/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    console.log('Request:', config)
    return config
  },
  error => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    console.log('Response:', response)
    return response
  },
  error => {
    console.error('Response Error:', error.response || error)
    return Promise.reject(error)
  }
)

export interface Project {
  id: string // UUID
  name: string
  description: string
  tenantId: string // UUID
  createdAt: string
  updatedAt: string
}

export const projectApi = {
  async getProjects(tenantId: string) { // 修改为 string 类型
    try {
      console.log('Fetching projects for tenant:', tenantId)
      const response = await api.get<Project[]>('/projects', { 
        params: { tenantId }
      })
      console.log('Projects response:', response)
      return response
    } catch (error) {
      console.error('Get Projects Error:', error)
      throw error
    }
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    return api.post<Project>('/projects', project)
  },

  async updateProject(id: string, project: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) {
    return api.put<Project>(`/projects/${id}`, project)
  },

  async deleteProject(id: string) {
    return api.delete(`/projects/${id}`)
  }
}
