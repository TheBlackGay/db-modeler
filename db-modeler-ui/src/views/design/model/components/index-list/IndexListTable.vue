<template>
  <div class="index-list-table">
    <a-table
      :columns="columns"
      :data-source="indexes"
      :loading="loading"
      :row-selection="rowSelection"
      :pagination="false"
      size="small"
      bordered
      :scroll="{ y: 400 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'fields'">
          {{ formatFields(record.fields) }}
        </template>

        <template v-else-if="column.key === 'action'">
          <a-space>
            <a-tooltip title="编辑索引">
              <a-button type="link" size="small" @click="$emit('edit', record)">
                <template #icon><edit-outlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="删除索引">
              <a-popconfirm
                title="确定要删除这个索引吗？"
                @confirm="$emit('delete', record)"
                placement="left"
              >
                <a-button type="link" size="small" danger>
                  <template #icon><delete-outlined /></template>
                </a-button>
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { Index, IndexField } from '../../types'

const props = defineProps<{
  indexes: Index[]
  loading?: boolean
  selectedKeys: string[]
}>()

const emit = defineEmits<{
  (e: 'select', keys: string[]): void
  (e: 'edit', index: Index): void
  (e: 'delete', index: Index): void
}>()

const columns = [
  {
    title: '索引名',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: '字段',
    key: 'fields',
    width: 300,
  },
  {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
  },
]

const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedKeys,
  onChange: (selectedRowKeys: string[]) => {
    emit('select', selectedRowKeys)
  },
}))

const formatFields = (fields: IndexField[]) => {
  return fields.map(f => `${f.name} ${f.order}`).join(', ')
}
</script>

<style lang="scss" scoped>
.index-list-table {
  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    font-weight: 500;
  }
}
</style> 