import type { DataModel, CreateModelRequest, UpdateModelRequest, ModelListItem } from '@/types/model'
import { request } from '@/utils/request'

export function getModelList(projectId: string) {
  return request.get<ModelListItem[]>(`/api/projects/${projectId}/models`)
}

export function getModelDetail(modelId: string) {
  return request.get<DataModel>(`/api/models/${modelId}`)
}

export function createModel(data: CreateModelRequest) {
  return request.post<DataModel>('/api/models', data)
}

export function updateModel(data: UpdateModelRequest) {
  return request.put<DataModel>(`/api/models/${data.id}`, data)
}

export function deleteModel(modelId: string) {
  return request.delete(`/api/models/${modelId}`)
}

export function exportModel(modelId: string, format: string) {
  return request.get(`/api/models/${modelId}/export?format=${format}`, {
    responseType: 'blob'
  })
}

export function importModel(projectId: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('projectId', projectId)
  return request.post<DataModel>('/api/models/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
