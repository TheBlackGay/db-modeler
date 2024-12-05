import request from '@/utils/request'

export function listTables(databaseId) {
  return request({
    url: `/table-manage/${databaseId}/tables`,
    method: 'get'
  })
}

export function getTableStructure(databaseId, tableName) {
  return request({
    url: `/table-manage/${databaseId}/tables/${tableName}/structure`,
    method: 'get'
  })
}

export function getTableDataPreview(databaseId, tableName, params = {}) {
  return request({
    url: `/table-manage/${databaseId}/tables/${tableName}/data`,
    method: 'get',
    params
  })
}
