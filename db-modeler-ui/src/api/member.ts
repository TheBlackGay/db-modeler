import request from '@/utils/request'
import type { ProjectMemberDTO } from '@/types/member'

export function getProjectMembers(projectId: string) {
  return request({
    url: `/api/projects/${projectId}/members`,
    method: 'get'
  })
}

export function addProjectMember(projectId: string, data: { userId: string; role: string }) {
  return request({
    url: `/api/projects/${projectId}/members`,
    method: 'post',
    data
  })
}

export function updateMemberRole(projectId: string, userId: string, data: { role: string }) {
  return request({
    url: `/api/projects/${projectId}/members/${userId}`,
    method: 'put',
    data
  })
}

export function removeProjectMember(projectId: string, userId: string) {
  return request({
    url: `/api/projects/${projectId}/members/${userId}`,
    method: 'delete'
  })
}

export function searchUsers(query: string) {
  return request({
    url: '/api/users/search',
    method: 'get',
    params: { query }
  })
}
