<template>
  <div class="field-list-header">
    <div class="header-actions">
      <a-space>
        <!-- 视图切换 -->
        <a-radio-group v-model:value="viewMode" button-style="solid" size="small">
          <a-radio-button value="table">表格</a-radio-button>
          <a-radio-button value="card">卡片</a-radio-button>
        </a-radio-group>

        <!-- 快速编辑开关 -->
        <a-switch
          v-model:checked="quickEditMode"
          size="small"
          :checkedChildren="'快速编辑'"
          :unCheckedChildren="'普通模式'"
        />

        <!-- 操作按钮 -->
        <a-button type="primary" size="small" @click="$emit('add')">
          <template #icon><plus-outlined /></template>
          添加字段
        </a-button>

        <a-button size="small" @click="$emit('use-template')">
          <template #icon><copy-outlined /></template>
          使用模板
        </a-button>

        <a-button size="small" @click="$emit('import')">
          <template #icon><import-outlined /></template>
          导入
        </a-button>

        <a-button size="small" @click="$emit('export')">
          <template #icon><export-outlined /></template>
          导出
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlusOutlined, CopyOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons-vue'

interface Props {
  viewMode: 'table' | 'card'
  quickEditMode: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:viewMode', value: 'table' | 'card'): void
  (e: 'update:quickEditMode', value: boolean): void
  (e: 'add'): void
  (e: 'use-template'): void
  (e: 'import'): void
  (e: 'export'): void
}>()

const viewMode = computed({
  get: () => props.viewMode,
  set: (value: 'table' | 'card') => emit('update:viewMode', value)
})

const quickEditMode = computed({
  get: () => props.quickEditMode,
  set: (value: boolean) => emit('update:quickEditMode', value)
})
</script>

<style lang="scss" scoped>
.field-list-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;

  .header-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style> 