<template>
  <div class="model-design">
    <h2>模型设计</h2>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  PlusOutlined,
  ExportOutlined,
  ImportOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import type { DataModel, ModelTable, ModelListItem } from '@/types/model'
import {
  getModelList,
  getModelDetail,
  createModel,
  updateModel,
  deleteModel,
  exportModel,
  importModel
} from '@/api/model'

const router = useRouter()
const route = useRoute()

// 状态
const modelList = ref<ModelListItem[]>([])
const selectedKeys = ref<string[]>([])
const currentModel = ref<DataModel | null>(null)
const activeTab = ref('tables')
const showCreateModal = ref(false)
const createLoading = ref(false)
const loading = ref(false)

const createForm = ref({
  name: '',
  dbType: 'MySQL',
  version: '1.0.0',
  description: ''
})

// 获取模型列表
const fetchModelList = async () => {
  loading.value = true
  try {
    const projectId = route.params.projectId as string
    const data = await getModelList(projectId)
    modelList.value = data
  } catch (error) {
    message.error('获取模型列表失败')
  } finally {
    loading.value = false
  }
}

// 获取模型详情
const fetchModelDetail = async (modelId: string) => {
  try {
    const data = await getModelDetail(modelId)
    currentModel.value = data
  } catch (error) {
    message.error('获取模型详情失败')
  }
}

// 菜单项
const modelMenuItems = computed(() => 
  modelList.value.map(model => ({
    key: model.id,
    label: model.name,
    icon: '📊'
  }))
)

// 表格列定义
const tableColumns = [
  {
    title: '表名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '注释',
    dataIndex: 'comment',
    key: 'comment'
  },
  {
    title: '引擎',
    dataIndex: 'engine',
    key: 'engine'
  },
  {
    title: '字符集',
    dataIndex: 'charset',
    key: 'charset'
  },
  {
    title: '字段数',
    dataIndex: 'fields',
    key: 'fields'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    customRender: ({ text }: { text: string }) => formatDate(text)
  },
  {
    title: '操作',
    key: 'action',
    width: 200
  }
]

// 事件处理
const handleMenuClick = async ({ key }: { key: string }) => {
  await fetchModelDetail(key)
}

const handleCreateModel = async () => {
  if (!createForm.value.name) {
    message.warning('请输入模型名称')
    return
  }
  if (!createForm.value.dbType) {
    message.warning('请选择数据库类型')
    return
  }

  createLoading.value = true
  try {
    const projectId = route.params.projectId as string
    await createModel({
      ...createForm.value,
      projectId
    })
    message.success('创建成功')
    showCreateModal.value = false
    createForm.value = {
      name: '',
      dbType: 'MySQL',
      version: '1.0.0',
      description: ''
    }
    await fetchModelList()
  } catch (error) {
    message.error('创建失败')
  } finally {
    createLoading.value = false
  }
}

const handleEditTable = (table: ModelTable) => {
  router.push(`/projects/${route.params.projectId}/tables/${table.id}`)
}

const handleViewFields = (table: ModelTable) => {
  router.push(`/projects/${route.params.projectId}/tables/${table.id}/fields`)
}

const handleDeleteTable = async (table: ModelTable) => {
  try {
    await deleteModel(table.id)
    message.success('删除成功')
    await fetchModelDetail(currentModel.value!.id)
  } catch (error) {
    message.error('删除失败')
  }
}

const handleExport = async () => {
  if (!currentModel.value) return
  
  try {
    const blob = await exportModel(currentModel.value.id, 'sql')
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentModel.value.name}.sql`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败')
  }
}

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    const projectId = route.params.projectId as string
    await importModel(projectId, input.files[0])
    message.success('导入成功')
    await fetchModelList()
  } catch (error) {
    message.error('导入失败')
  }
}

// 工具函数
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  fetchModelList()
})
</script>

<style lang="scss" scoped>
.model-design {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tool-bar {
    height: 48px;
    padding: 0 16px;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    gap: 24px;

    .tool-group {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 12px;
      border-right: 1px solid #f0f0f0;

      &:last-child {
        border-right: none;
      }
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;

    .model-list {
      width: 240px;
      background-color: #fff;
      border-right: 1px solid #f0f0f0;
      display: flex;
      flex-direction: column;

      .list-header {
        height: 48px;
        padding: 0 16px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
          font-weight: 500;
        }
      }

      .list-content {
        flex: 1;
        overflow-y: auto;
      }
    }

    .content-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;

      .empty-state {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .model-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h2 {
          margin: 0;
        }
      }

      .model-info {
        margin-bottom: 24px;
        padding: 16px;
        background-color: #fafafa;
        border-radius: 4px;
      }

      .table-list {
        margin-top: 16px;

        .danger {
          color: #ff4d4f;
        }
      }

      .diagram-placeholder {
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fafafa;
        border-radius: 4px;
        color: #999;
      }
    }
  }
}
</style>
