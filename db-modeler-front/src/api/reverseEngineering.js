import request from '@/utils/request'

export function extractDatabaseSchema(connectionId, data) {
  return request({
    url: `/reverse-engineering/extract-schema/${connectionId}`,
    method: 'post',
    data
  })
}

export function synchronizeTableSchema(connectionId, data) {
  return request({
    url: `/reverse-engineering/synchronize-schema/${connectionId}`,
    method: 'post',
    data
  })
}

export function compareTableSchemas(connectionId, data) {
  return request({
    url: `/reverse-engineering/compare-schemas/${connectionId}`,
    method: 'post',
    data
  })
}

export function generateSchemaSyncScript(connectionId, data) {
  return request({
    url: `/reverse-engineering/generate-sync-script/${connectionId}`,
    method: 'post',
    data
  })
}
