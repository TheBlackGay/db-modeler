import request from '@/utils/request'

export function extractViews(connectionId, data) {
  return request({
    url: `/database-metadata/extract-views/${connectionId}`,
    method: 'post',
    data
  })
}

export function extractRoutines(connectionId, data) {
  return request({
    url: `/database-metadata/extract-routines/${connectionId}`,
    method: 'post',
    data
  })
}

export function extractForeignKeys(connectionId, data) {
  return request({
    url: `/database-metadata/extract-foreign-keys/${connectionId}`,
    method: 'post',
    data
  })
}

export function extractTriggers(connectionId, data) {
  return request({
    url: `/database-metadata/extract-triggers/${connectionId}`,
    method: 'post',
    data
  })
}

export function synchronizeMetadata(connectionId, data) {
  return request({
    url: `/database-metadata/synchronize/${connectionId}`,
    method: 'post',
    data
  })
}

export function generateMetadataSyncScript(data) {
  return request({
    url: `/database-metadata/generate-sync-script`,
    method: 'post',
    data
  })
}
