<template>
  <div v-if="previewFields.length > 0" class="template-preview">
    <div class="preview-header">
      <h4>已选择的字段预览</h4>
      <a-space>
        <a-button size="small" @click="$emit('clearSelection')">
          清空选择
        </a-button>
        <a-tooltip title="拖拽排序">
          <drag-outlined />
        </a-tooltip>
      </a-space>
    </div>
    
    <draggable
      v-model="fields"
      class="preview-list"
      handle=".drag-handle"
      item-key="id"
      @start="$emit('dragStart')"
      @end="$emit('dragEnd')"
    >
      <template #item="{ element: field }">
        <div class="preview-item">
          <div class="preview-item-content">
            <drag-outlined class="drag-handle" />
            <div class="field-info">
              <div class="field-name">
                {{ field.name }}
                <a-tag v-if="field.group" size="small">
                  {{ field.group }}
                </a-tag>
              </div>
              <div class="field-type">
                {{ field.dataType }}
                <template v-if="field.length">({{ field.length }})</template>
              </div>
            </div>
          </div>
          <a-button
            type="link"
            danger
            size="small"
            @click="$emit('removeField', field)"
          >
            <delete-outlined />
          </a-button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { DragOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  previewFields: any[]
}>()

const emit = defineEmits<{
  (e: 'update:previewFields', value: any[]): void
  (e: 'clearSelection'): void
  (e: 'dragStart'): void
  (e: 'dragEnd'): void
  (e: 'removeField', field: any): void
}>()

const fields = computed({
  get: () => props.previewFields,
  set: (value) => emit('update:previewFields', value)
})
</script>

<style scoped>
.template-preview {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 300px;
  max-height: 400px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  h4 {
    margin: 0;
  }
}

.preview-list {
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  background: #fafafa;
  border-radius: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.preview-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.drag-handle {
  cursor: move;
  color: #999;
}

.field-info {
  flex: 1;
  min-width: 0;
}

.field-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.field-type {
  font-size: 12px;
  color: #666;
}
</style>
