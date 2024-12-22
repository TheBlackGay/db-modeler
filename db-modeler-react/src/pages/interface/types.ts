/**
 * 接口状态枚举
 */
export enum InterfaceStatus {
  ONLINE = 'ONLINE',    // 已上线
  OFFLINE = 'OFFLINE',  // 已下线
  TESTING = 'TESTING',  // 测试中
  DRAFT = 'DRAFT'       // 草稿
}

/**
 * 接口请求方法枚举
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

/**
 * 接口参数类型枚举
 */
export enum ParamType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY'
}

/**
 * 接口参数位置枚举
 */
export enum ParamPosition {
  QUERY = 'QUERY',         // URL查询参数
  BODY = 'BODY',          // 请求体
  HEADER = 'HEADER',      // 请求头
  PATH = 'PATH'           // 路径参数
}

/**
 * 接口参数定义
 */
export interface ParamInfo {
  id: string;
  name: string;
  type: ParamType;
  required: boolean;
  description: string;
  position?: ParamPosition;
}

/**
 * 接口响应定义
 */
export interface InterfaceResponse {
  id: string;
  name: string;
  type: ParamType;
  description?: string;
  example?: string;
}

/**
 * 接口基本信息
 */
export interface InterfaceInfo {
  id: string;
  name: string;
  path: string;
  method: HttpMethod;
  status: InterfaceStatus;
  description?: string;
  creator: string;
  createTime: string;
  updateTime: string;
  requestParams: ParamInfo[];
  responseParams: ParamInfo[];
}

/**
 * 接口调用统计信息
 */
export interface InterfaceStats {
  totalCalls: number;
  successCalls: number;
  failureCalls: number;
  avgResponseTime: number;
  lastDayStats: {
    time: string;
    calls: number;
    successRate: number;
    avgResponseTime: number;
  }[];
}

/**
 * 接口调用日志
 */
export interface InterfaceLog {
  id: string;
  interfaceId: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE';
  requestData: string;
  responseData: string;
  responseTime: number;
  errorMessage?: string;
} 