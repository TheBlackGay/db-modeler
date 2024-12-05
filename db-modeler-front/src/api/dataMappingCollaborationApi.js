import request from '@/utils/request'

const BASE_URL = '/api/mapping-collaborations'

export default {
  /**
   * 邀请协作者
   * @param {string} mappingConfigId 映射配置ID
   * @param {Object} data 邀请信息
   * @returns {Promise} 邀请结果
   */
  inviteCollaborator(mappingConfigId, data) {
    return request.post(`${BASE_URL}/${mappingConfigId}/invite`, data)
  },

  /**
   * 接受协作邀请
   * @param {string} collaborationId 协作记录ID
   * @returns {Promise} 接受结果
   */
  acceptInvitation(collaborationId) {
    return request.post(`${BASE_URL}/invitation/${collaborationId}/accept`)
  },

  /**
   * 获取协作成员列表
   * @param {string} mappingConfigId 映射配置ID
   * @param {Object} params 查询参数
   * @returns {Promise} 协作成员列表
   */
  getCollaborators(mappingConfigId, params = {}) {
    return request.get(`${BASE_URL}/${mappingConfigId}/collaborators`, { params })
  },

  /**
   * 更新协作成员权限
   * @param {string} collaborationId 协作记录ID
   * @param {Object} permissions 权限配置
   * @returns {Promise} 更新结果
   */
  updateCollaboratorPermissions(collaborationId, permissions) {
    return request.patch(`${BASE_URL}/collaborator/${collaborationId}/permissions`, { permissions })
  },

  /**
   * 移除协作成员
   * @param {string} collaborationId 协作记录ID
   * @returns {Promise} 移除结果
   */
  removeCollaborator(collaborationId) {
    return request.delete(`${BASE_URL}/collaborator/${collaborationId}`)
  },

  /**
   * 检查访问权限
   * @param {string} mappingConfigId 映射配置ID
   * @param {string} action 操作类型
   * @returns {Promise} 权限检查结果
   */
  checkAccess(mappingConfigId, action) {
    return request.get(`${BASE_URL}/${mappingConfigId}/access`, { 
      params: { action } 
    })
  }
}
