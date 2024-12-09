<template>
  <div class="model-content">
    <template v-if="currentData">
      <div class="model-content__header">
        <div class="model-content__title">
          <h2>{{ currentData.name }}</h2>
        </div>
        <div class="model-content__actions">
          <a-button type="primary" @click="handleEdit">编辑</a-button>
          <a-button danger @click="handleDelete">删除</a-button>
        </div>
      </div>
      <div class="model-content__body">
        <a-table
          :columns="columns"
          :data-source="currentData.fields"
          :pagination="false"
          bordered
        >
          <template #action="{ record }">
            <a-space>
              <a @click="handleEditField(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除这个字段吗？"
                @confirm="handleDeleteField(record)"
              >
                <a>删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </a-table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Table, Button, Space, Divider, Popconfirm } from 'ant-design-vue'
import type { TableColumnType } from 'ant-design-vue/es/table'

interface Field {
  id: string
  name: string
  type: string
  length: number
  nullable: boolean
  defaultValue: string
  comment: string
}

interface DataItem {
  id: string
  name: string
  type: string
  fields: Field[]
}

interface Props {
  currentData?: DataItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'editField', record: Field): void
  (e: 'deleteField', record: Field): void
}>()

const columns = ref<TableColumnType[]>([
  {
    title: '字段名',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 150,
  },
  {
    title: '长度',
    dataIndex: 'length',
    key: 'length',
    width: 100,
  },
  {
    title: '允许空',
    dataIndex: 'nullable',
    key: 'nullable',
    width: 100,
    customRender: ({ value }) => value ? '是' : '否'
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 150,
  },
  {
    title: '注释',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
    slots: { customRender: 'action' },
  },
])

const handleEdit = () => {
  emit('edit')
}

const handleDelete = () => {
  emit('delete')
}

const handleEditField = (record: Field) => {
  emit('editField', record)
}

const handleDeleteField = (record: Field) => {
  emit('deleteField', record)
}
</script>

<style lang="scss" scoped>
.model-content {
  &__header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
  }

  &__title {
    h2 {
      margin: 0;
    }
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__body {
    padding: 16px;
  }
}
</style>
