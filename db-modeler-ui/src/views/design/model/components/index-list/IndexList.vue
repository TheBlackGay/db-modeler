<template>
  <div class="index-list">
    <div class="index-list-header">
      <div class="left">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><plus-outlined /></template>
            添加索引
          </a-button>
          <a-button danger :disabled="!selectedKeys.length" @click="handleBatchDelete">
            <template #icon><delete-outlined /></template>
            批量删除
          </a-button>
        </a-space>
      </div>
      <div class="right">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索索引"
          style="width: 200px"
          @change="handleSearch"
        />
      </div>
    </div>

    <index-list-table
      :indexes="filteredIndexes"
      :loading="loading"
      :selectedKeys="selectedKeys"
      @select="handleSelect"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <index-edit-modal
      v-model:visible="showEditModal"
      :index="currentIndex"
      :fields="fields"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import IndexListTable from './IndexListTable.vue'
import IndexEditModal from './IndexEditModal.vue'
import type { Index, Field } from '../../types'

const props = defineProps<{
  modelValue: Index[]
  fields: Field[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Index[]): void
}>()

// 状态
const loading = ref(false)
const searchText = ref('')
const selectedKeys = ref<string[]>([])
const showEditModal = ref(false)
const currentIndex = ref<Index | null>(null)

// 计算属性
const filteredIndexes = computed(() => {
  if (!searchText.value) return props.modelValue
  const search = searchText.value.toLowerCase()
  return props.modelValue.filter(index => 
    index.name.toLowerCase().includes(search) ||
    index.comment?.toLowerCase().includes(search)
  )
})

// 事件处理
const handleAdd = () => {
  currentIndex.value = null
  showEditModal.value = true
}

const handleEdit = (index: Index) => {
  currentIndex.value = { ...index }
  showEditModal.value = true
}

const handleDelete = async (index: Index) => {
  try {
    emit('update:modelValue', props.modelValue.filter(i => i.id !== index.id))
    message.success('删除成功')
  } catch (error) {
    message.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  try {
    emit('update:modelValue', props.modelValue.filter(i => !selectedKeys.value.includes(i.id!)))
    selectedKeys.value = []
    message.success('批量删除成功')
  } catch (error) {
    message.error('批量删除失败')
  }
}

const handleSave = (index: Index) => {
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
  showEditModal.value = false
  message.success(idx > -1 ? '更新成功' : '添加成功')
}

const handleSelect = (keys: string[]) => {
  selectedKeys.value = keys
}

const handleSearch = () => {
  // 搜索逻辑已在 computed 属性中实现
}
</script>

<style lang="scss" scoped>
.index-list {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}
</style> 