import request from '@/utils/request'

export function testDatabaseConnection(data) {
  return request({
    url: '/database-test/test-connection',
    method: 'post',
    data
  })
}

export function getSupportedDatabaseTypes() {
  return request({
    url: '/database-test/database-types',
    method: 'get'
  })
}
