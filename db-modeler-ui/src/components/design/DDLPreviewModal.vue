<template>
  <a-modal
    :visible="visible"
    title="DDL预览"
    :footer="null"
    width="800px"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="ddl-content">
      <pre>{{ content }}</pre>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  content: string
}>()

defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()
</script>

<style lang="scss" scoped>
.ddl-content {
  max-height: 600px;
  overflow: auto;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', Courier, monospace;
  }
}
</style> 