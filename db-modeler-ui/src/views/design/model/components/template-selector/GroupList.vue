<template>
  <div class="group-list">
    <a-table
      :columns="columns"
      :data-source="groups"
      :row-selection="rowSelection"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" @click="handleDelete(record)" danger>删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TemplateGroup } from '../types';

const props = defineProps<{
  groups: TemplateGroup[];
  selectedKeys: string[];
}>();

const emit = defineEmits<{
  (e: 'select', keys: string[]): void;
  (e: 'edit', group: TemplateGroup): void;
  (e: 'delete', group: TemplateGroup): void;
}>();

const columns = [
  {
    title: '组名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '包含字段',
    key: 'templates',
    customRender: ({ record }: { record: TemplateGroup }) => record.templates.length,
  },
  {
    title: '操作',
    key: 'action',
  },
];

const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedKeys,
  onChange: (selectedRowKeys: string[]) => {
    emit('select', selectedRowKeys);
  },
}));

const handleEdit = (group: TemplateGroup) => {
  emit('edit', group);
};

const handleDelete = (group: TemplateGroup) => {
  emit('delete', group);
};
</script>

<style scoped>
.group-list {
  margin-top: 16px;
}
</style>
