<template>
  <div class="template-list">
    <a-table
      :columns="columns"
      :data-source="templates"
      :row-selection="rowSelection"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handlePreview(record)">预览</a-button>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" @click="handleCopy(record)">复制</a-button>
            <a-popconfirm
              title="确定要删除这个模板吗？"
              @confirm="handleDelete(record)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Template } from '../types';
import { message } from 'ant-design-vue';

const props = defineProps<{
  templates: Template[];
  selectedKeys: string[];
}>();

const emit = defineEmits<{
  (e: 'select', keys: string[]): void;
  (e: 'preview', template: Template): void;
  (e: 'edit', template: Template): void;
  (e: 'delete', template: Template): void;
  (e: 'copy', template: Template): void;
}>();

const columns = [
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '字段名',
    dataIndex: ['template', 'name'],
    key: 'fieldName',
  },
  {
    title: '数据类型',
    key: 'dataType',
    customRender: ({ record }: { record: Template }) => 
      `${record.template.dataType}${record.template.length ? `(${record.template.length})` : ''}`,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 280,
  },
];

const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedKeys,
  onChange: (selectedRowKeys: string[]) => {
    emit('select', selectedRowKeys);
  },
}));

const handlePreview = (template: Template) => {
  try {
    emit('preview', template);
  } catch (error) {
    console.error('预览模板失败:', error);
    message.error('预览模板失败');
  }
};

const handleEdit = (template: Template) => {
  try {
    emit('edit', template);
  } catch (error) {
    console.error('编辑模板失败:', error);
    message.error('编辑模板失败');
  }
};

const handleCopy = (template: Template) => {
  try {
    emit('copy', template);
  } catch (error) {
    console.error('复制模板失败:', error);
    message.error('复制模板失败');
  }
};

const handleDelete = (template: Template) => {
  try {
    emit('delete', template);
  } catch (error) {
    console.error('删除模板失败:', error);
    message.error('删除模板失败');
  }
};
</script>

<style scoped>
.template-list {
  margin-top: 16px;
}
</style>
