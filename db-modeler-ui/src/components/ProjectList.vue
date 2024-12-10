<template>
  <div class="project-list">
    <div class="project-header">
      <h2>项目列表</h2>
      <a-button type="primary" @click="showCreateModal">新建项目</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="formattedProjects"
      :loading="loading"
      :row-key="record => record.id"
      :pagination="{
        ...pageInfo,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100']
      }"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" @click="handleDesign(record)">设计</a-button>
            <a-popconfirm
              title="确定要删除这个项目吗？"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <template v-else-if="column.key === 'createdAt'">
          {{ formatDate(record.createdAt) }}
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalVisible"
      :title="modalMode === 'create' ? '新建项目' : '编辑项目'"
      @ok="handleModalOk"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="项目名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="项目描述" name="description">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { projectApi } from '@/api/project'
import { useGlobalStore } from '@/stores/global'
import { message } from 'ant-design-vue'
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import type { Project } from '@/api/project'
import { ApiResponseUtil, type PageInfo } from '@/types/api'
import type { FormInstance } from 'ant-design-vue'

const router = useRouter()
const globalStore = useGlobalStore()
const { currentTenant } = storeToRefs(globalStore)
const formRef = ref<FormInstance>()
const loading = ref(false)
const modalVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const currentProjectId = ref<string>('')
const projects = ref<Project[]>([])
const pageInfo = ref<PageInfo>({
  current: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
})

const formState = ref({
  name: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
}

const loadProjects = async () => {
  if (!currentTenant.value?.id) {
    console.warn('No tenant selected')
    return
  }
  loading.value = true
  try {
    console.log('Loading projects for tenant:', currentTenant.value.id)
    const response = await projectApi.getProjectsPage(
      currentTenant.value.id,
      pageInfo.value.current,
      pageInfo.value.pageSize
    )
    console.log('Projects API response:', response)
    
    if (ApiResponseUtil.isSuccess(response)) {
      const data = ApiResponseUtil.getPageData(response)
      if (data) {
        projects.value = data.records
        pageInfo.value = data.pageInfo
        console.log('Loaded projects:', projects.value)
      }
    } else {
      console.warn('Failed to load projects:', response.message)
      message.error('加载项目列表失败：' + ApiResponseUtil.getErrorMsg(response))
      projects.value = []
    }
  } catch (error: any) {
    console.error('Failed to load projects:', error)
    message.error('加载项目列表失败：' + (error.message || '未知错误'))
    projects.value = []
  } finally {
    loading.value = false
  }
}

const handleModalOk = async () => {
  try {
    if (modalMode.value === 'create') {
      const tenantId = currentTenant.value?.id
      if (!tenantId) {
        message.error('请先选择租户')
        return
      }
      const projectData = { ...formState.value, tenantId }
      const response = await projectApi.createProject(projectData)
      
      if (ApiResponseUtil.isSuccess(response)) {
        message.success('创建成功')
        modalVisible.value = false
        await loadProjects()
      } else {
        throw new Error(ApiResponseUtil.getErrorMsg(response))
      }
    } else {
      if (!currentProjectId.value) {
        message.error('项目ID不存在')
        return
      }
      const response = await projectApi.updateProject(currentProjectId.value, formState.value)
      
      if (ApiResponseUtil.isSuccess(response)) {
        message.success('更新成功')
        modalVisible.value = false
        await loadProjects()
      } else {
        throw new Error(ApiResponseUtil.getErrorMsg(response))
      }
    }
  } catch (error: any) {
    console.error('Operation failed:', error)
    message.error(error.message || (modalMode.value === 'create' ? '创建失败' : '更新失败'))
  }
}

const handleDelete = async (id: string) => {
  try {
    const response = await projectApi.deleteProject(id)
    if (ApiResponseUtil.isSuccess(response)) {
      message.success('删除成功')
      await loadProjects()
    } else {
      throw new Error(ApiResponseUtil.getErrorMsg(response))
    }
  } catch (error: any) {
    console.error('Delete failed:', error)
    message.error(error.message || '删除失败')
  }
}

const handleTableChange = (pagination: any) => {
  pageInfo.value.current = pagination.current
  pageInfo.value.pageSize = pagination.pageSize
  loadProjects()
}

const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
    width: '30%'
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: '40%'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '15%'
  },
  {
    title: '操作',
    key: 'action',
    width: '15%'
  }
]

const showCreateModal = () => {
  if (!currentTenant.value?.id) {
    message.error('请先选择租户')
    return
  }
  modalMode.value = 'create'
  formState.value = {
    name: '',
    description: ''
  }
  modalVisible.value = true
}

const handleEdit = (record: Project) => {
  modalMode.value = 'edit'
  currentProjectId.value = record.id
  formState.value = {
    name: record.name,
    description: record.description
  }
  modalVisible.value = true
}

const handleDesign = (record: Project) => {
  globalStore.$patch((state) => {
    state.currentProject = record;
  });
  router.push({
    name: 'model',
    params: { id: record.id }
  });
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString()
}

const formattedProjects = computed(() => {
  return projects.value.map(project => ({
    ...project,
    key: project.id,
    createdAt: project.createdAt || '-',
    description: project.description || '-'
  }))
})

watch(() => currentTenant.value?.id, (newTenantId) => {
  console.log('Tenant changed in ProjectList:', newTenantId)
  if (newTenantId) {
    loadProjects()
  } else {
    projects.value = []
  }
}, { immediate: true })
</script>

<style scoped>
.project-list {
  padding: 24px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-header h2 {
  margin: 0;
}
</style>
