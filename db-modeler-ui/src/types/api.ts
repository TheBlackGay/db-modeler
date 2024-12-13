// 统一API响应接口
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 分页信息
export interface PageInfo {
  current: number      // 当前页码
  pageSize: number     // 每页条数
  total: number        // 总记录数
  totalPages: number   // 总页数
}

// 分页结果
export interface PageResult<T> {
  records: T[]         // 数据列表
  pageInfo: PageInfo   // 分页信息
}

// 列表响应
export type ListResponse<T> = ApiResponse<T[]>

// 详情响应
export type DetailResponse<T> = ApiResponse<T>

// 分页响应
export type PageResponse<T> = ApiResponse<PageResult<T>>

// API 响应工具类
export class ApiResponseUtil {
  // 判断响应是否成功
  static isSuccess(response: ApiResponse<any>): boolean {
    return response && response.code === 0
  }

  // 获取响应数据
  static getData<T>(response: { data: ApiResponse<T> }): T | null {
    return this.isSuccess(response.data) ? response.data.data : null
  }

  // 获取列表数据
  static getListData<T>(response: { data: ListResponse<T> }): T[] {
    return this.isSuccess(response.data) && Array.isArray(response.data.data) ? response.data.data : []
  }

  // 获取分页数据
  static getPageData<T>(response: { data: PageResponse<T> }): PageResult<T> | null {
    return this.isSuccess(response.data) ? response.data.data : null
  }

  // 获取错误信息
  static getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === 'string') {
      return error
    }
    if (error?.data?.message) {
      return error.data.message
    }
    return '未知错误'
  }

  // 创建成功响应
  static success<T>(data: T, message = 'success'): ApiResponse<T> {
    return {
      code: 0,
      message,
      data
    }
  }

  // 创建错误响应
  static error<T>(message: string, code = -1, data?: T): ApiResponse<T> {
    return {
      code,
      message,
      data: data as T
    }
  }
}
