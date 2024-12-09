import type { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

interface ApiError {
  error: string
  field?: string
  message: string
  debug_message?: string
  stack_trace?: string
}

export function handleApiError(error: AxiosError<ApiError>) {
  if (error.response) {
    const { data } = error.response
    if (data.field) {
      ElMessage.error(`${data.field}: ${data.message}`)
    } else {
      ElMessage.error(data.message || '操作失败')
    }
    
    // 在开发环境下，打印更详细的错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        debug_message: data.debug_message,
        stack_trace: data.stack_trace
      })
    }
  } else if (error.request) {
    ElMessage.error('网络请求失败，请检查网络连接')
    if (process.env.NODE_ENV === 'development') {
      console.error('Request Error:', error.request)
    }
  } else {
    ElMessage.error('发生未知错误')
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error.message)
    }
  }
}
