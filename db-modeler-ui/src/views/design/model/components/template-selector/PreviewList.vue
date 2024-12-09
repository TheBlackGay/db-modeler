<template>
  <div class="preview-list">
    <a-table
      :columns="columns"
      :data-source="fields"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handleRemove(record)">移除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import type { PreviewField } from '../types';

const props = defineProps<{
  fields: PreviewField[];
}>();

const emit = defineEmits<{
  (e: 'remove', field: PreviewField): void;
}>();

const columns = [
  {
    title: '字段名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '数据类型',
    key: 'dataType',
    customRender: ({ record }: { record: PreviewField }) => 
      `${record.dataType}${record.length ? `(${record.length})` : ''}`,
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
  },
  {
    title: '描述',
    dataIndex: 'comment',
    key: 'comment',
  },
  {
    title: '操作',
    key: 'action',
  },
];

const handleRemove = (field: PreviewField) => {
  emit('remove', field);
};
</script>

<style scoped>
.preview-list {
  margin-top: 16px;
}
</style>
