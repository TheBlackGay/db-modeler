import request from '@/utils/request'

export function fetchDatabases(params) {
  return request({
    url: '/databases',
    method: 'get',
    params
  })
}

export function createDatabase(data) {
  return request({
    url: '/databases',
    method: 'post',
    data
  })
}

export function updateDatabase(id, data) {
  return request({
    url: `/databases/${id}`,
    method: 'put',
    data
  })
}

export function deleteDatabase(id) {
  return request({
    url: `/databases/${id}`,
    method: 'delete'
  })
}

export function getDatabaseDetail(id) {
  return request({
    url: `/databases/${id}`,
    method: 'get'
  })
}

export function testDatabaseConnection(id) {
  return request({
    url: `/databases/${id}/test-connection`,
    method: 'get'
  })
}

export function getDatabaseTables(id, params) {
  return request({
    url: `/databases/${id}/tables`,
    method: 'get',
    params
  })
}

export function getDatabaseSchemas(id) {
  return request({
    url: `/databases/${id}/schemas`,
    method: 'get'
  })
}

export function getDatabaseTypes() {
  return request({
    url: '/database-types',
    method: 'get'
  })
}
