import request from '@/utils/request'

export function saveTableDesign(data) {
  return request({
    url: '/table-design/save',
    method: 'post',
    data
  })
}

export function generateDatabaseSQL(data) {
  return request({
    url: '/table-design/generate-sql',
    method: 'post',
    data
  })
}

export function listTableDesigns(params) {
  return request({
    url: '/table-design/list',
    method: 'get',
    params
  })
}

export function getTableDesignDetail(tableDesignId) {
  return request({
    url: `/table-design/detail/${tableDesignId}`,
    method: 'get'
  })
}

export function deleteTableDesign(tableDesignId) {
  return request({
    url: `/table-design/delete/${tableDesignId}`,
    method: 'delete'
  })
}

export function exportTableDesign(tableDesignId, format) {
  return request({
    url: `/table-design/export/${tableDesignId}`,
    method: 'get',
    params: { format },
    responseType: 'blob'
  })
}
