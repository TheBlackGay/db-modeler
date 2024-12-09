import { http } from '@/utils/http'
import type { DataItem } from '@/types/model'

export interface TableDesignResponse {
  id: string
  name: string
  fields: Array&lt;{
    id: string
    name: string
    type: string
    length: number
    nullable: boolean
    defaultValue: string
    comment: string
  }&gt;
}

const BASE_URL = '/api/table-designs'

export const tableDesignApi = {
  /**
   * 获取表设计列表
   */
  getList(): Promise&lt;DataItem[]&gt; {
    return http.get(BASE_URL)
  },

  /**
   * 获取表设计详情
   * @param id - 表设计ID (UUID格式)
   */
  getDetail(id: string): Promise&lt;TableDesignResponse&gt; {
    // 确保ID是完整的UUID格式
    const fullUUID = id.length === 8 
      ? `${id}-0000-0000-0000-000000000000`
      : id
    return http.get(`${BASE_URL}/${fullUUID}`)
  },

  /**
   * 创建表设计
   */
  create(data: Partial&lt;TableDesignResponse&gt;): Promise&lt;TableDesignResponse&gt; {
    return http.post(BASE_URL, data)
  },

  /**
   * 更新表设计
   */
  update(id: string, data: Partial&lt;TableDesignResponse&gt;): Promise&lt;TableDesignResponse&gt; {
    const fullUUID = id.length === 8 
      ? `${id}-0000-0000-0000-000000000000`
      : id
    return http.put(`${BASE_URL}/${fullUUID}`, data)
  },

  /**
   * 删除表设计
   */
  delete(id: string): Promise&lt;void&gt; {
    const fullUUID = id.length === 8 
      ? `${id}-0000-0000-0000-000000000000`
      : id
    return http.delete(`${BASE_URL}/${fullUUID}`)
  }
}
