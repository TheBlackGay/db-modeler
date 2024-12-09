// 基础响应接口
export interface BaseResponse {
  code: number
  message: string
}

// 列表响应
export interface ListResponse<T> extends BaseResponse {
  data: T[]
}

// 详情响应
export interface DetailResponse<T> extends BaseResponse {
  data: T
}

// 分页数据结构
export interface PageInfo {
  current: number      // 当前页码
  pageSize: number     // 每页条数
  total: number        // 总记录数
  totalPages: number   // 总页数
}

// 分页响应
export interface PageResponse<T> extends BaseResponse {
  data: {
    records: T[]       // 当前页数据
    pageInfo: PageInfo // 分页信息
  }
}

// API 响应工具类
export class ApiResponseUtil {
  // 判断响应是否成功
  static isSuccess(response: BaseResponse): boolean {
    return response.code === 0
  }

  // 获取列表数据
  static getListData<T>(response: ListResponse<T>): T[] {
    return this.isSuccess(response) ? response.data : []
  }

  // 获取详情数据
  static getDetailData<T>(response: DetailResponse<T>): T | null {
    return this.isSuccess(response) ? response.data : null
  }

  // 获取分页数据
  static getPageData<T>(response: PageResponse<T>): {
    records: T[]
    pageInfo: PageInfo
  } | null {
    return this.isSuccess(response) ? response.data : null
  }

  // 获取错误信息
  static getErrorMsg(response: BaseResponse): string {
    return response.message || '未知错误'
  }
}
