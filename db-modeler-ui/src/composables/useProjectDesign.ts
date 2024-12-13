import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { message } from 'ant-design-vue'
import { projectApi } from '@/api/project'
import type { Project } from '@/api/project'
import type { ApiResponse } from '@/types/api'
import { useGlobalStore } from '@/stores/global'

export function useProjectDesign() {
  const project: Ref<Project | null> = ref(null)
  const loading = ref(false)
  const saving = ref(false)

  const globalStore = useGlobalStore()
  const currentTenant = computed(() => globalStore.currentTenant)

  const loadProject = async (id: string) => {
    if (!id) {
      console.warn('[loadProject] 项目ID为空')
      return
    }

    try {
      loading.value = true
      console.log('[loadProject] 开始加载项目:', id)

      // 检查缓存
      const cachedProject = globalStore.projects.find(p => p.id === id)
      if (cachedProject) {
        console.log('[loadProject] 使用缓存的项目信息:', cachedProject)
        project.value = cachedProject
        return
      }

      // 从服务器加载
      console.log('[loadProject] 从服务器加载项目')
      const { data: apiResponse } = await projectApi.getProjectById(id)

      if (!apiResponse || apiResponse.code !== 0 || !apiResponse.data) {
        throw new Error(apiResponse?.message || '加载项目失败')
      }

      console.log('[loadProject] 响应数据:', apiResponse)
      project.value = apiResponse.data

    } catch (error: any) {
      console.error('[loadProject] 加载失败:', error)
      message.error(error.message || '加载项目失败')
      project.value = null
    } finally {
      loading.value = false
    }
  }

  const handleSave = async () => {
    if (!project.value) {
      message.warning('没有要保存的项目数据')
      return
    }

    if (!currentTenant.value) {
      message.warning('请先选择租户')
      return
    }

    try {
      console.log('[handleSave] 开始保存项目:', project.value)
      const { data: apiResponse } = await projectApi.updateProject(
        project.value.id,
        {
          name: project.value.name,
          description: project.value.description,
          tenantId: currentTenant.value?.id
        }
      )

      console.log('[handleSave] 保存响应:', apiResponse)
      if (apiResponse.code === 0) {
        message.success('保存成功')
        // 更新缓存
        await globalStore.loadProjectsForTenant(currentTenant.value.id)
      } else {
        throw new Error(apiResponse.message || '保存失败')
      }
    } catch (error: any) {
      console.error('[handleSave] 保存失败:', error)
      message.error(error.message || '保存失败')
    }
  }

  return {
    project,
    loading,
    saving,
    loadProject,
    handleSave
  }
} 