import { http } from '@/utils/http'
import type { GraphLayout, NodePosition } from '@/types/graphLayout'

// 获取项目的图形布局
export const getProjectLayout = (projectId: string) => {
    return http.get<GraphLayout>(`/api/graph-layouts/project/${projectId}`)
}

// 保存项目的图形布局
export const saveProjectLayout = (projectId: string, positions: NodePosition[]) => {
    return http.post<GraphLayout>(`/api/graph-layouts/project/${projectId}`, { positions })
}

// 更新项目的图形布局
export const updateProjectLayout = (layoutId: string, positions: NodePosition[]) => {
    return http.put<GraphLayout>(`/api/graph-layouts/${layoutId}`, { positions })
}
