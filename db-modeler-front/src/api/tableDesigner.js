import request from '@/utils/request'

export function createTable(data) {
  return request({
    url: '/table-designer/create',
    method: 'post',
    data
  })
}

export function updateTable(id, data) {
  return request({
    url: `/table-designer/update/${id}`,
    method: 'put',
    data
  })
}

export function deleteTable(id) {
  return request({
    url: `/table-designer/delete/${id}`,
    method: 'delete'
  })
}

export function listTables(params) {
  return request({
    url: '/table-designer/list',
    method: 'get',
    params
  })
}

export function getTableDetail(id) {
  return request({
    url: `/table-designer/detail/${id}`,
    method: 'get'
  })
}

export function generateTableSQL(id, params) {
  return request({
    url: `/table-designer/generate-sql/${id}`,
    method: 'get',
    params
  })
}

export function compareTableVersions(id, params) {
  return request({
    url: `/table-designer/compare-versions/${id}`,
    method: 'get',
    params
  })
}

export function searchTables(params) {
  return request({
    url: '/table-designer/search',
    method: 'get',
    params
  })
}

export function exportTableDefinition(id, format = 'json') {
  return request({
    url: `/table-designer/export/${id}`,
    method: 'get',
    params: { format }
  })
}

export function importTableDefinition(data) {
  return request({
    url: '/table-designer/import',
    method: 'post',
    data
  })
}
