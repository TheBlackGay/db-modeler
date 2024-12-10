<template>
  <div class="project-header">
    <div class="left">
      <a-button type="link" @click="$emit('back')">
        <template #icon><left-outlined /></template>
        返回
      </a-button>
      <a-divider type="vertical" />
      <h2 class="title">{{ project?.name }}</h2>
    </div>
    <div class="right">
      <a-space>
        <a-button type="primary" @click="$emit('create-table')">
          <template #icon><plus-outlined /></template>
          新建表
        </a-button>
        <a-button @click="$emit('save')">
          <template #icon><save-outlined /></template>
          保存
        </a-button>
        <a-button @click="$emit('preview')">
          <template #icon><eye-outlined /></template>
          预览
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LeftOutlined,
  PlusOutlined,
  SaveOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import type { Project } from '@/api/types'

defineProps<{
  project: Project | null
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'create-table'): void
  (e: 'save'): void
  (e: 'preview'): void
}>()
</script>

<style lang="scss" scoped>
.project-header {
  height: 64px;
  padding: 0 24px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
    gap: 16px;

    .title {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
  }
}
</style> 