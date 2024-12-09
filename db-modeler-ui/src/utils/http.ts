import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在这里可以添加认证信息等
    return config
  },
  (error: AxiosError) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const responseData = response.data

    // 调试日志
    console.log('Response interceptor:', {
      status: response.status,
      data: responseData,
      headers: response.headers
    })

    // 检查响应格式
    if (responseData && typeof responseData === 'object') {
      // 检查是否符合 ApiResponse 格式
      if ('code' in responseData && 'data' in responseData) {
        return responseData as ApiResponse<any>
      }
      // 如果不是标准格式，包装成标准格式
      return {
        code: 0,
        message: 'success',
        data: responseData
      } as ApiResponse<any>
    }

    // 处理非对象响应
    return {
      code: 0,
      message: 'success',
      data: responseData
    } as ApiResponse<any>
  },
  (error: AxiosError) => {
    console.error('HTTP Error:', error)
    
    if (error.response) {
      console.error('Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      })

      const responseData = error.response.data as any
      const errorResponse: ApiResponse = {
        code: error.response.status,
        message: responseData?.message || `服务器错误 (${error.response.status}): ${error.response.statusText}`,
        data: null
      }
      message.error(errorResponse.message)
      return Promise.reject(errorResponse)
    }

    if (error.request) {
      console.error('No response received:', error.request)
      return Promise.reject({
        code: -1,
        message: '网络错误，请检查网络连接',
        data: null
      } as ApiResponse)
    }

    return Promise.reject({
      code: -1,
      message: error.message || '请求失败',
      data: null
    } as ApiResponse)
  }
)

export { http }
export default http
