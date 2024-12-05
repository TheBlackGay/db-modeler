import request from '@/utils/request'

const BASE_URL = '/api/mapping-configs'

export default {
  /**
   * 创建数据映射配置
   * @param {Object} data 映射配置数据
   * @returns {Promise} 创建结果
   */
  createMappingConfig(data) {
    return request.post(BASE_URL, data)
  },

  /**
   * 更新数据映射配置
   * @param {string} id 配置ID
   * @param {Object} data 更新数据
   * @returns {Promise} 更新结果
   */
  updateMappingConfig(id, data) {
    return request.put(`${BASE_URL}/${id}`, data)
  },

  /**
   * 获取数据映射配置详情
   * @param {string} id 配置ID
   * @returns {Promise} 配置详情
   */
  getMappingConfigById(id) {
    return request.get(`${BASE_URL}/${id}`)
  },

  /**
   * 查询数据映射配置列表
   * @param {Object} params 查询参数
   * @returns {Promise} 配置列表
   */
  listMappingConfigs(params) {
    return request.get(BASE_URL, { params })
  },

  /**
   * 删除数据映射配置
   * @param {string} id 配置ID
   * @returns {Promise} 删除结果
   */
  deleteMappingConfig(id) {
    return request.delete(`${BASE_URL}/${id}`)
  },

  /**
   * 预览数据类型映射
   * @param {Object} mappingConfig 映射配置
   * @returns {Promise} 映射预览结果
   */
  previewDataTypeMapping(mappingConfig) {
    return request.post(`${BASE_URL}/preview`, mappingConfig)
  },

  /**
   * 获取支持的数据库类型列表
   * @returns {Promise} 数据库类型列表
   */
  getSupportedDatabases() {
    return request.get(`${BASE_URL}/databases`)
  },

  /**
   * 获取数据库类型映射建议
   * @param {string} sourceType 源类型
   * @param {string} sourceDatabase 源数据库
   * @param {string} targetDatabase 目标数据库
   * @returns {Promise} 类型映射建议
   */
  getTypeMappingSuggestions(sourceType, sourceDatabase, targetDatabase) {
    return request.get(`${BASE_URL}/type-suggestions`, {
      params: { 
        sourceType, 
        sourceDatabase, 
        targetDatabase 
      }
    })
  }
}
