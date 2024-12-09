<template>
  <div class="index-list">
    <div class="index-toolbar">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleAddIndex">
              <template #icon><plus-outlined /></template>
              新增索引
            </a-button>
            <a-button 
              danger 
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <template #icon><delete-outlined /></template>
              删除索引
            </a-button>
          </a-space>
        </a-col>
        <a-col>
          <a-space>
            <a-input-search
              v-model:value="searchText"
              placeholder="搜索索引"
              style="width: 200px"
              @change="handleSearch"
            />
          </a-space>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredIndexes"
      :pagination="false"
      size="small"
      bordered
      :row-selection="rowSelection"
      :scroll="{ y: 'calc(100vh - 400px)' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'fields'">
          {{ formatFields(record.fields) }}
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <a-space>
            <a-tooltip title="编辑索引">
              <edit-outlined 
                class="action-icon"
                @click="handleEditIndex(record)"
              />
            </a-tooltip>
            <a-tooltip title="删除索引">
              <a-popconfirm
                title="确定要删除这个索引吗？"
                @confirm="handleDeleteIndex(record)"
              >
                <delete-outlined class="action-icon delete" />
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </a-table>

    <index-form
      v-model:visible="showIndexForm"
      :index="currentIndex"
      :fields="fields"
      @save="handleIndexSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  PlusOutlined, 
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons-vue'

interface IndexField {
  name: string
  order: 'ASC' | 'DESC'
}

interface Index {
  id?: string
  name: string
  type: 'UNIQUE' | 'NORMAL' | 'FULLTEXT'
  fields: IndexField[]
  comment: string
}

const props = defineProps<{
  modelValue: Index[]
  fields: any[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Index[]): void
}>()

const columns = [
  { title: '索引名', dataIndex: 'name', width: 200 },
  { title: '类型', dataIndex: 'type', width: 120 },
  { title: '字段', dataIndex: 'fields', width: 300 },
  { title: '备注', dataIndex: 'comment', width: 200 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' }
]

const showIndexForm = ref(false)
const currentIndex = ref<Index | null>(null)
const selectedRowKeys = ref<string[]>([])
const searchText = ref('')

const hasSelection = computed(() => selectedRowKeys.value.length > 0)

const filteredIndexes = computed(() => {
  if (!searchText.value) return props.modelValue
  const search = searchText.value.toLowerCase()
  return props.modelValue.filter(index => 
    index.name.toLowerCase().includes(search) ||
    index.comment?.toLowerCase().includes(search)
  )
})

const rowSelection = {
  selectedRowKeys,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  }
}

const formatFields = (fields: IndexField[]) => {
  return fields.map(f => `${f.name} ${f.order}`).join(', ')
}

const handleAddIndex = () => {
  currentIndex.value = null
  showIndexForm.value = true
}

const handleEditIndex = (index: Index) => {
  currentIndex.value = { ...index }
  showIndexForm.value = true
}

const handleIndexSave = (index: Index) => {
  const indexes = [...props.modelValue]
  const idx = indexes.findIndex(i => i.id === index.id)
  if (idx > -1) {
    indexes[idx] = index
  } else {
    indexes.push({
      ...index,
      id: crypto.randomUUID()
    })
  }
  emit('update:modelValue', indexes)
  showIndexForm.value = false
}

const handleDeleteIndex = (index: Index) => {
  emit('update:modelValue', props.modelValue.filter(i => i.id !== index.id))
}

const handleBatchDelete = () => {
  emit('update:modelValue', props.modelValue.filter(i => !selectedRowKeys.value.includes(i.id!)))
  selectedRowKeys.value = []
}

const handleSearch = () => {
  // 搜索逻辑已经在 computed 属性中实现
}
</script>

<style lang="scss" scoped>
.index-list {
  .index-toolbar {
    margin-bottom: 16px;
  }

  :deep(.action-icon) {
    cursor: pointer;
    font-size: 16px;
    color: #1890ff;

    &.delete {
      color: #ff4d4f;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
