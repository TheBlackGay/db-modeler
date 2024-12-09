<template>
  <div class="preview-list">
    <a-table
      :columns="columns"
      :data-source="fields"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button
            type="link"
            danger
            @click="() => $emit('remove', record.id)"
          >
            移除
          </a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
const columns = [
  {
    title: '字段名',
    dataIndex: 'fieldName',
    key: 'fieldName',
  },
  {
    title: '数据类型',
    dataIndex: 'dataType',
    key: 'dataType',
  },
  {
    title: '长度',
    dataIndex: 'length',
    key: 'length',
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
  },
  {
    title: '注释',
    dataIndex: 'comment',
    key: 'comment',
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center',
  },
];

defineProps<{
  fields: any[];
}>();

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<style lang="less" scoped>
.preview-list {
  margin-top: 16px;
}
</style>
