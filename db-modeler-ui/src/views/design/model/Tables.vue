<template>
  <div class="table-page">
    <!-- 工具栏 -->
    <div class="table-toolbar">
      <a-space>
        <a-button type="primary" @click="showCreateModal">
          <template #icon><plus-outlined /></template>
          新建数据表
        </a-button>
        <a-button>
          <template #icon><import-outlined /></template>
          导入
        </a-button>
        <a-button>
          <template #icon><export-outlined /></template>
          导出
        </a-button>
        <a-button type="primary" @click="handleSyncDatabase">
          <template #icon><sync-outlined /></template>
          同步到数据库
        </a-button>
      </a-space>

      <div class="toolbar-right">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索表名或注释"
          style="width: 250px"
          @search="handleSearch"
        />
      </div>
    </div>

    <!-- 表格视图 -->
    <div class="table-view">
      <a-table
        :columns="columns"
        :data-source="filteredTables"
        :pagination="{ pageSize: 20, showSizeChanger: true, showQuickJumper: true }"
        size="small"
        bordered
        :scroll="{ y: 'calc(100vh - 180px)' }"
      >
        <template #bodyCell="{ column, record }">
          <!-- 表名列 -->
          <template v-if="column.key === 'code'">
            <div class="table-name-cell">
              <a class="table-link" @click="handleTableClick(record)">
                {{ record.code }}
              </a>
            </div>
          </template>

          <!-- 类型列 -->
          <template v-else-if="column.key === 'type'">
            {{ record.type === 'TABLE' ? '空表' : '视图' }}
          </template>

          <!-- 主题域列 -->
          <template v-else-if="column.key === 'domain'">
            {{ record.domain === 'BUSINESS' ? '业务域' : '系统域' }}
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" size="small" @click="handleDesign(record)">设计</a-button>
              <a-popconfirm
                title="确定要删除该表吗？"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <!-- 创建/编辑表格的模态框 -->
  <a-modal
    v-model:visible="modalVisible"
    :title="modalMode === 'create' ? '新建数据表' : '编辑数据表'"
    @ok="handleModalOk"
    @cancel="handleModalCancel"
    :confirmLoading="modalLoading"
    width="600px"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <a-form-item label="代码" name="code" required>
        <a-input v-model:value="formState.code" placeholder="请输入表代码">
          <template #addonAfter>
            <a-space>
              <a @click="handleToUpperCase">全大写</a>
              <a-divider type="vertical" />
              <a @click="handleToLowerCase">全小写</a>
            </a-space>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="显示名称" name="displayName">
        <a-input v-model:value="formState.displayName" placeholder="请输入显示名称" />
      </a-form-item>
      <a-form-item label="类型" name="type">
        <a-select v-model:value="formState.type" placeholder="请选择类型">
          <a-select-option value="TABLE">空表</a-select-option>
          <a-select-option value="VIEW">视图</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属主题域" name="domain">
        <a-select v-model:value="formState.domain" placeholder="请选择主题域">
          <a-select-option value="BUSINESS">业务域</a-select-option>
          <a-select-option value="SYSTEM">系统域</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="comment">
        <a-textarea v-model:value="formState.comment" placeholder="请输入备注" :rows="4" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  PlusOutlined, 
  ImportOutlined, 
  ExportOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  TableOutlined
} from '@ant-design/icons-vue'
import type { TableListItem } from '@/types/table'
import { getTableList, createTable, updateTable, deleteTable } from '@/api/table'

const route = useRoute()
const router = useRouter()
const projectId = route.params.id as string

const columns = [
  {
    title: '表名',
    dataIndex: 'code',
    key: 'code',
    width: 200,
    fixed: 'left'
  },
  {
    title: '显示名称',
    dataIndex: 'displayName',
    key: 'displayName',
    width: 200
  },
  {
    title: '说明',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100
  },
  {
    title: '主题域',
    dataIndex: 'domain',
    key: 'domain',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right'
  }
]

// 表格数据和加载状态
const tableList = ref<TableListItem[]>([])
const loading = ref(false)

// 搜索相关
const searchText = ref('')
const filteredTables = computed(() => {
  if (!searchText.value) {
    return tableList.value
  }
  const searchLower = searchText.value.toLowerCase()
  return tableList.value.filter(
    table =>
      table.code.toLowerCase().includes(searchLower) ||
      table.displayName.toLowerCase().includes(searchLower) ||
      (table.comment && table.comment.toLowerCase().includes(searchLower))
  )
})

const handleSearch = (value: string) => {
  searchText.value = value
}

// 模态框相关
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formRef = ref()
const formState = ref({
  code: '',
  displayName: '',
  type: 'TABLE',
  domain: undefined,
  comment: '',
  id: ''
})

// 表单验证规则
const rules = {
  code: [
    { required: true, message: '请输入表代码', trigger: 'blur' },
    { min: 2, max: 64, message: '表代码长度应在 2-64 个字符之间', trigger: 'blur' }
  ],
  displayName: [
    { max: 32, message: '显示名称长度不能超过32个字符', trigger: 'blur' }
  ]
}

// 获取表格列表
const fetchTableList = async () => {
  loading.value = true
  try {
    const res = await getTableList(projectId)
    tableList.value = res || []
  } catch (error: any) {
    message.error(error.message || '获取表格列表失败')
  } finally {
    loading.value = false
  }
}

// 显示创建模态框
const showCreateModal = () => {
  modalMode.value = 'create'
  formState.value = {
    code: '',
    displayName: '',
    type: 'TABLE',
    domain: undefined,
    comment: '',
    id: ''
  }
  modalVisible.value = true
}

// 转换大小写
const handleToUpperCase = () => {
  formState.value.code = formState.value.code.toUpperCase()
}

const handleToLowerCase = () => {
  formState.value.code = formState.value.code.toLowerCase()
}

// 显示编辑模态框
const handleEdit = (record: TableListItem) => {
  modalMode.value = 'edit'
  formState.value = {
    ...record,
    displayName: record.displayName || '',
    domain: record.domain || undefined
  }
  modalVisible.value = true
}

// 跳转到表设计页面
const handleDesign = (record: TableListItem) => {
  router.push({
    name: 'table-design',
    params: {
      id: route.params.id,
      tableId: record.id
    }
  })
}

// 处理删除
const handleDelete = async (record: TableListItem) => {
  try {
    await deleteTable(record.id)
    message.success('删除成功')
    fetchTableList()
  } catch (error: any) {
    message.error(error.message || '删除失败')
  }
}

// 同步到数据库
const handleSyncDatabase = () => {
  // TODO: 实现同步到数据库的功能
  message.info('同步到数据库功能开发中...')
}

// 处理模态框确认
const handleModalOk = async () => {
  try {
    await formRef.value.validate()
    modalLoading.value = true

    const data = {
      code: formState.value.code,
      displayName: formState.value.displayName,
      type: formState.value.type,
      domain: formState.value.domain,
      comment: formState.value.comment,
      projectId
    }

    if (modalMode.value === 'create') {
      const res = await createTable(data)
      message.success('创建成功')
      // 创建成功后直接跳转到表设计页面
      router.push({
        name: 'table-design',
        params: { 
          id: projectId,
          tableId: res.id 
        }
      })
    } else {
      await updateTable({
        ...data,
        id: formState.value.id
      })
      message.success('更新成功')
      fetchTableList()
    }

    modalVisible.value = false
  } catch (error: any) {
    message.error(error.message || `${modalMode.value === 'create' ? '创建' : '更新'}失败`)
  } finally {
    modalLoading.value = false
  }
}

// 处理模态框取消
const handleModalCancel = () => {
  modalVisible.value = false
  formRef.value?.resetFields()
}

// 获取表格详情页链接
const getTableLink = (record: TableListItem) => {
  return `/project/${projectId}/model/tables/${record.id}`
}

// 处理表格点击
const handleTableClick = (record: TableListItem) => {
  router.push({
    name: 'table-design',
    params: {
      id: projectId,
      tableId: record.id
    }
  })
}

// 组件挂载时获取表格列表
onMounted(() => {
  fetchTableList()
})
</script>

<style lang="scss" scoped>
.table-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 16px;
  
  .table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .table-view {
    flex: 1;
    overflow: hidden;
    
    :deep(.ant-table-wrapper) {
      height: 100%;
      
      .ant-table {
        height: 100%;
      }
      
      .table-name-cell {
        .table-link {
          color: #1890ff;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

.table-form {
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}
</style>
