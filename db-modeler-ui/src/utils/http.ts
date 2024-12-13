import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import type { ApiResponse } from '@/types/api'

// 创建 axios 实例
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const responseData = response.data

    // 如果响应数据是标准格式
    if (responseData && typeof responseData === 'object') {
      // 如果业务状态码不是 0，说明有错误
      if (responseData.code !== 0) {
        return Promise.reject(new Error(responseData.message || '请求失败'))
      }
    }

    // 返回完整的响应对象
    return response
  },
  (error: AxiosError) => {
    let errorMessage = '请求失败'
    
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          errorMessage = '未授权，请重新登录'
          break
        case 403:
          errorMessage = '权限不足'
          break
        case 404:
          errorMessage = '请求的资源不存在'
          break
        case 500:
          errorMessage = '服务器错误'
          break
      }
    } else if (error.request) {
      errorMessage = '网络错误，请检查您的网络连接'
    } else {
      errorMessage = '请求配置有误'
    }

    console.error('HTTP Error:', errorMessage, error)
    return Promise.reject(new Error(errorMessage))
  }
)

export { http }
