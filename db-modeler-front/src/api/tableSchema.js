import request from '@/utils/request'

export function fetchTableSchemas(params) {
  return request({
    url: '/table-schemas',
    method: 'get',
    params
  })
}

export function createTableSchema(data) {
  return request({
    url: '/table-schemas',
    method: 'post',
    data
  })
}

export function updateTableSchema(id, data) {
  return request({
    url: `/table-schemas/${id}`,
    method: 'put',
    data
  })
}

export function deleteTableSchema(id) {
  return request({
    url: `/table-schemas/${id}`,
    method: 'delete'
  })
}

export function getTableSchemaDetail(id) {
  return request({
    url: `/table-schemas/${id}`,
    method: 'get'
  })
}

export function generateTableSchemaSQL(id, dialect = 'mysql') {
  return request({
    url: `/table-schemas/${id}/sql`,
    method: 'get',
    params: { dialect }
  })
}
