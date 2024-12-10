<template>
  <div class="tool-bar">
    <div class="tool-group">
      <a-button type="text" @click="$emit('back')">
        <template #icon><left-outlined /></template>
        返回
      </a-button>
    </div>
    <div class="tool-group">
      <a-button type="text" @click="$emit('save')">
        <template #icon><save-outlined /></template>
        保存
      </a-button>
      <a-button type="text" @click="$emit('undo')" :disabled="!canUndo">
        <template #icon><undo-outlined /></template>
        撤销
      </a-button>
      <a-button type="text" @click="$emit('redo')" :disabled="!canRedo">
        <template #icon><redo-outlined /></template>
        重做
      </a-button>
    </div>
    <div class="tool-group">
      <a-button type="text" @click="$emit('zoom-in')">
        <template #icon><zoom-in-outlined /></template>
        放大
      </a-button>
      <a-button type="text" @click="$emit('zoom-out')">
        <template #icon><zoom-out-outlined /></template>
        缩小
      </a-button>
      <a-button type="text" @click="$emit('fit-screen')">
        <template #icon><fullscreen-outlined /></template>
        适应屏幕
      </a-button>
    </div>
    <div class="tool-group">
      <a-button type="text" @click="$emit('preview-ddl')">
        <template #icon><eye-outlined /></template>
        预览DDL
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LeftOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'

defineProps<{
  canUndo: boolean
  canRedo: boolean
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'save'): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'fit-screen'): void
  (e: 'preview-ddl'): void
}>()
</script>

<style lang="scss" scoped>
.tool-bar {
  height: 48px;
  padding: 0 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 24px;

  .tool-group {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border-right: 1px solid #f0f0f0;

    &:last-child {
      border-right: none;
    }
  }
}
</style> 