import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import type { Project, ApiResponse } from '@/api/types'
import { projectApi } from '@/api/project'
import { useGlobalStore } from '@/stores/global'

export function useProjectDesign() {
  const router = useRouter()
  const route = useRoute()
  const globalStore = useGlobalStore()

  // 状态
  const loading = ref(false)
  const project = ref<Project | null>(null)
  const showCreateModal = ref(false)
  const createLoading = ref(false)

  // 加载项目详情
  const loadProject = async () => {
    const projectId = route.params.id as string
    if (!projectId) {
      console.error('[loadProject] 项目ID不存在')
      message.error('项目ID不存在')
      return
    }

    // 确保有租户信息
    const currentTenant = globalStore.currentTenant
    if (!currentTenant) {
      console.error('[loadProject] 租户信息不存在')
      message.error('请先选择租户')
      router.push('/projects')
      return
    }

    loading.value = true
    try {
      console.log('[loadProject] 开始加载项目:', {
        projectId,
        tenantId: currentTenant.id,
        tenant: currentTenant,
        routeParams: route.params
      })

      // 先尝试从全局状态获取项目信息
      const cachedProject = globalStore.projects.find(p => p.id === projectId)
      if (cachedProject) {
        console.log('[loadProject] 使用缓存的项目信息:', cachedProject)
        project.value = cachedProject
        return
      }

      console.log('[loadProject] 从服务器加载项目信息')
      const response = await projectApi.getProjectById(projectId, currentTenant.id)
      console.log('[loadProject] 项目响应:', {
        response,
        responseData: response?.data,
        responseCode: response?.data?.code,
        responseMessage: response?.data?.message
      })

      if (!response) {
        console.error('[loadProject] 响应为空')
        throw new Error('获取项目详情失败：响应为空')
      }

      if (typeof response !== 'object') {
        console.error('[loadProject] 响应格式错误:', response)
        throw new Error('获取项目详情失败：响应格式错误')
      }

      const responseData = response.data as ApiResponse<Project>
      console.log('[loadProject] 响应数据:', responseData)

      // 如果响应数据是标准格式
      if (responseData && typeof responseData === 'object' && 'code' in responseData) {
        if (responseData.code === 0 && responseData.data) {
          // 验证项目所属租户
          if (responseData.data.tenantId !== currentTenant.id) {
            console.error('[loadProject] 租户不匹配:', {
              projectTenantId: responseData.data.tenantId,
              currentTenantId: currentTenant.id
            })
            throw new Error('无权访问该项目')
          }
          project.value = responseData.data
          console.log('[loadProject] 项目加载成功:', project.value)
          return
        }

        console.error('[loadProject] 响应状态错误:', {
          code: responseData.code,
          message: responseData.message,
          data: responseData.data
        })
        throw new Error(responseData.message || '获取项目详情失败')
      }

      // 其他情况，抛出错误
      console.error('[loadProject] 无效的响应数据格式:', responseData)
      throw new Error('获取项目详情失败：响应数据格式错误')
    } catch (error: any) {
      console.error('[loadProject] 错误详情:', {
        error,
        message: error.message,
        stack: error.stack,
        type: error.constructor.name,
        isAxiosError: error.isAxiosError,
        response: error.response,
        request: error.request
      })
      message.error(error.message || '获取项目详情失败')
      router.push('/projects')
    } finally {
      loading.value = false
    }
  }

  // 保存项目
  const handleSave = async () => {
    if (!project.value) {
      console.warn('[handleSave] 没有项目数据')
      return
    }

    const currentTenant = globalStore.currentTenant
    if (!currentTenant) {
      message.error('请先选择租户')
      return
    }

    loading.value = true
    try {
      console.log('[handleSave] 开始保存项目:', project.value)
      const response = await projectApi.updateProject(project.value.id, {
        name: project.value.name,
        description: project.value.description,
        tenantId: currentTenant.id
      })

      console.log('[handleSave] 保存响应:', response)
      const responseData = response.data
      if (responseData.code === 0) {
        message.success('保存成功')
      } else {
        console.error('[handleSave] 保存失败:', responseData)
        throw new Error(responseData.message || '保存失败')
      }
    } catch (error: any) {
      console.error('[handleSave] 错误详情:', {
        error,
        message: error.message,
        stack: error.stack
      })
      message.error(error.message || '保存失败')
    } finally {
      loading.value = false
    }
  }

  // 预览项目
  const handlePreview = () => {
    if (!project.value) {
      console.warn('[handlePreview] 没有项目数据')
      return
    }
    // TODO: 实现预览功能
    message.info('预览功能开发中')
  }

  // 返回项目列表
  const handleBack = () => {
    router.push('/projects')
  }

  return {
    loading,
    project,
    showCreateModal,
    createLoading,
    loadProject,
    handleSave,
    handlePreview,
    handleBack
  }
} 