import request from '@/utils/request'

export function listColumnTypes(params) {
  return request({
    url: '/column-type/list',
    method: 'get',
    params
  })
}

export function createColumnType(data) {
  return request({
    url: '/column-type/create',
    method: 'post',
    data
  })
}

export function updateColumnType(data) {
  return request({
    url: `/column-type/update/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteColumnType(id) {
  return request({
    url: `/column-type/delete/${id}`,
    method: 'delete'
  })
}

export function getColumnTypeDetail(id) {
  return request({
    url: `/column-type/detail/${id}`,
    method: 'get'
  })
}

export function searchColumnTypes(params) {
  return request({
    url: '/column-type/search',
    method: 'get',
    params
  })
}

export function getColumnTypesByDatabaseType(databaseType) {
  return request({
    url: `/column-type/database/${databaseType}`,
    method: 'get'
  })
}
