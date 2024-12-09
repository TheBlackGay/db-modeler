import request from '@/utils/request'
import type { TableRelation, TableRelationFormData } from '@/types/tableRelation'

const BASE_URL = '/api/table-relations'

export function getProjectRelations(projectId: string) {
    return request.get<TableRelation[]>(`${BASE_URL}/project/${projectId}`)
}

export function getRelation(relationId: string) {
    return request.get<TableRelation>(`${BASE_URL}/${relationId}`)
}

export function createRelation(projectId: string, data: TableRelationFormData) {
    return request.post<TableRelation>(`${BASE_URL}/project/${projectId}`, data)
}

export function updateRelation(relationId: string, data: TableRelationFormData) {
    return request.put<TableRelation>(`${BASE_URL}/${relationId}`, data)
}

export function deleteRelation(relationId: string) {
    return request.delete(`${BASE_URL}/${relationId}`)
}

export function validateRelation(data: TableRelationFormData) {
    return request.post<boolean>(`${BASE_URL}/validate`, data)
}
