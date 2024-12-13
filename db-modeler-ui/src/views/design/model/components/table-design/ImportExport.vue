<template>
  <div>
    <a-modal
      v-model:visible="importVisible"
      title="导入设置"
      @ok="handleImportConfirm"
    >
      <a-form layout="vertical">
        <a-form-item label="设置内容">
          <a-textarea
            v-model:value="importContent"
            :rows="10"
            placeholder="请粘贴JSON格式的设置内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="exportVisible"
      title="导出设置"
    >
      <a-form layout="vertical">
        <a-form-item label="设置内容">
          <a-textarea
            v-model:value="exportContent"
            :rows="10"
            readonly
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="handleCopy">复制</a-button>
          <a-button @click="handleDownload">下载</a-button>
          <a-button @click="exportVisible = false">关闭</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { saveAs } from 'file-saver'

const props = defineProps<{
  importVisible: boolean
  exportVisible: boolean
  settings: any
}>()

const emit = defineEmits<{
  (e: 'update:importVisible', value: boolean): void
  (e: 'update:exportVisible', value: boolean): void
  (e: 'import', value: any): void
}>()

const importContent = ref('')
const exportContent = ref('')

watch(() => props.exportVisible, (val) => {
  if (val) {
    exportContent.value = JSON.stringify(props.settings, null, 2)
  }
})

const handleImportConfirm = () => {
  try {
    const data = JSON.parse(importContent.value)
    emit('import', data)
    emit('update:importVisible', false)
    importContent.value = ''
  } catch (e) {
    message.error('导入失败：无效的JSON格式')
  }
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(exportContent.value)
    message.success('已复制到剪贴板')
  } catch (e) {
    message.error('复制失败')
  }
}

const handleDownload = () => {
  const blob = new Blob([exportContent.value], { type: 'application/json' })
  saveAs(blob, 'table-settings.json')
}
</script> 