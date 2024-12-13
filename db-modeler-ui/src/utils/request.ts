import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const userStore = useUserStore()
    const token = userStore.token
    
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    
    // 如果是下载文件，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }
    
    // 处理业务状态码
    if (res.code !== 0) {
      message.error(res.message || '请求失败')
      
      // 处理特定错误码
      if (res.code === 401) {
        // Token 过期或无效
        const userStore = useUserStore()
        userStore.logout()
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    console.error('Response error:', error)
    
    // 处理网络错误
    if (!error.response) {
      message.error('网络错误，请检查网络连接')
      return Promise.reject(new Error('网络错误'))
    }
    
    // 处理 HTTP 状态码
    const status = error.response.status
    switch (status) {
      case 400:
        message.error('请求参数错误')
        break
      case 401:
        message.error('未授权，请重新登录')
        const userStore = useUserStore()
        userStore.logout()
        break
      case 403:
        message.error('拒绝访问')
        break
      case 404:
        message.error('请求的资源不存在')
        break
      case 500:
        message.error('服务器错误')
        break
      default:
        message.error(`请求失败: ${status}`)
    }
    
    return Promise.reject(error)
  }
)

// 导出请求方法
export default service
