<template>
  <div class="field-list-table">
    <a-table
      :dataSource="fields"
      :columns="columns"
      :pagination="false"
      size="middle"
      :rowKey="record => record.id"
      bordered
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <template v-if="quickEditMode">
            <a-input v-model:value="record.name" @change="handleFieldChange(record)" size="small" />
          </template>
          <template v-else>{{ record.name }}</template>
        </template>

        <template v-if="column.key === 'dataType'">
          <template v-if="quickEditMode">
            <a-select v-model:value="record.dataType" style="width: 120px" size="small" @change="handleFieldChange(record)">
              <a-select-option v-for="type in dataTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </a-select-option>
            </a-select>
          </template>
          <template v-else>{{ getDataTypeLabel(record.dataType) }}</template>
        </template>

        <template v-if="column.key === 'length'">
          <template v-if="quickEditMode">
            <a-input-number v-model:value="record.length" :min="0" size="small" style="width: 80px" @change="handleFieldChange(record)" />
          </template>
          <template v-else>{{ record.length }}</template>
        </template>

        <template v-if="column.key === 'nullable'">
          <a-checkbox :checked="record.nullable" :disabled="!quickEditMode" @change="(e) => { record.nullable = e.target.checked; handleFieldChange(record) }" />
        </template>

        <template v-if="column.key === 'primaryKey'">
          <a-checkbox :checked="record.primaryKey" :disabled="!quickEditMode" @change="(e) => { record.primaryKey = e.target.checked; handleFieldChange(record) }" />
        </template>

        <template v-if="column.key === 'autoIncrement'">
          <a-checkbox :checked="record.autoIncrement" :disabled="!quickEditMode" @change="(e) => { record.autoIncrement = e.target.checked; handleFieldChange(record) }" />
        </template>

        <template v-if="column.key === 'defaultValue'">
          <template v-if="quickEditMode">
            <a-input v-model:value="record.defaultValue" size="small" @change="handleFieldChange(record)" />
          </template>
          <template v-else>{{ record.defaultValue }}</template>
        </template>

        <template v-if="column.key === 'comment'">
          <template v-if="quickEditMode">
            <a-input v-model:value="record.comment" size="small" @change="handleFieldChange(record)" />
          </template>
          <template v-else>{{ record.comment }}</template>
        </template>

        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="$emit('edit', record, index)">编辑</a-button>
            <a-popconfirm title="确定要删除这个字段吗?" @confirm="$emit('delete', record, index)">
              <a-button type="link" danger size="small">删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Field } from '@/views/design/model/types'

interface Props {
  fields: Field[]
  dataTypes: Array<{
    label: string
    value: string
  }>
  quickEditMode: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update', field: Field): void
  (e: 'edit', field: Field, index: number): void
  (e: 'delete', field: Field, index: number): void
}>()

const columns = computed(() => [
  { title: '字段名', key: 'name', width: 180, fixed: 'left' },
  { title: '数据类型', key: 'dataType', width: 150 },
  { title: '长度/精度', key: 'length', width: 100 },
  { title: '可空', key: 'nullable', width: 80, align: 'center' },
  { title: '主键', key: 'primaryKey', width: 80, align: 'center' },
  { title: '自增', key: 'autoIncrement', width: 80, align: 'center' },
  { title: '默认值', key: 'defaultValue', width: 120 },
  { title: '备注', key: 'comment', width: 200 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' }
])

const getDataTypeLabel = (value: string) => {
  const type = props.dataTypes.find(t => t.value === value)
  return type ? type.label : value
}

const handleFieldChange = (field: Field) => {
  emit('update', field)
}
</script>

<style lang="scss" scoped>
.field-list-table {
  :deep(.ant-table-cell) {
    vertical-align: middle;
  }
}
</style> 