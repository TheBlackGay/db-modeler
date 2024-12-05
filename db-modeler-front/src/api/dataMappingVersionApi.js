import request from '@/utils/request'

const BASE_URL = '/api/mapping-versions'

export default {
  /**
   * 创建新版本
   * @param {Object} data 版本数据
   * @returns {Promise} 创建结果
   */
  createVersion(data) {
    return request.post(`${BASE_URL}/create`, data)
  },

  /**
   * 获取版本历史
   * @param {string} mappingConfigId 映射配置ID
   * @param {Object} params 查询参数
   * @returns {Promise} 版本历史列表
   */
  getVersionHistory(mappingConfigId, params = {}) {
    return request.get(`${BASE_URL}/${mappingConfigId}/history`, { params })
  },

  /**
   * 获取版本详情
   * @param {string} versionId 版本ID
   * @returns {Promise} 版本详情
   */
  getVersionDetails(versionId) {
    return request.get(`${BASE_URL}/${versionId}/details`)
  },

  /**
   * 比较两个版本
   * @param {string} versionId1 第一个版本ID
   * @param {string} versionId2 第二个版本ID
   * @returns {Promise} 版本差异
   */
  compareVersions(versionId1, versionId2) {
    return request.get(`${BASE_URL}/compare/${versionId1}/${versionId2}`)
  },

  /**
   * 恢复到指定版本
   * @param {string} versionId 版本ID
   * @returns {Promise} 恢复结果
   */
  restoreVersion(versionId) {
    return request.post(`${BASE_URL}/${versionId}/restore`)
  },

  /**
   * 发布版本
   * @param {string} versionId 版本ID
   * @returns {Promise} 发布结果
   */
  publishVersion(versionId) {
    return request.post(`${BASE_URL}/${versionId}/publish`)
  }
}
