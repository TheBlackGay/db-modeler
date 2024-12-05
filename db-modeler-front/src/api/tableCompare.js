import request from '@/utils/request'

export function compareTableSchemas(sourceId, targetId) {
  return request({
    url: `/table-compare/compare/${sourceId}/${targetId}`,
    method: 'get'
  })
}

export function generateSyncSQL(sourceId, targetId, data) {
  return request({
    url: `/table-compare/sync-sql/${sourceId}/${targetId}`,
    method: 'post',
    data
  })
}
