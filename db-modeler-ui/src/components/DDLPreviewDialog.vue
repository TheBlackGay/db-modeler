<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :width="800"
    @cancel="handleCancel"
    :footer="null"
  >
    <div v-if="loading" class="loading-container">
      <a-spin />
    </div>
    <div v-else>
      <div v-if="error" class="error-message">
        <a-alert :message="error" type="error" show-icon />
      </div>
      <div v-else>
        <div v-for="(preview, index) in previewData" :key="index" class="ddl-preview-item">
          <div class="ddl-preview-header">
            <span class="table-name">{{ preview.tableName }}</span>
            <a-tag :color="preview.type === 'CREATE' ? 'green' : 'blue'">
              {{ preview.type }}
            </a-tag>
          </div>
          <a-textarea
            v-model:value="preview.ddl"
            :auto-size="{ minRows: 3, maxRows: 10 }"
            readonly
            class="ddl-preview-content"
          />
          <div v-if="preview.status === 'error'" class="error-message">
            <a-alert :message="preview.error" type="error" show-icon />
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <a-button @click="handleCancel">关闭</a-button>
      <a-button
        v-if="showCopyButton"
        type="primary"
        @click="handleCopy"
        :loading="copying"
      >
        复制DDL
      </a-button>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { previewTableDDL, previewAllTablesDDL } from '@/api/tableDesign'

const props = defineProps<{
  visible: boolean
  tableId?: string
}>()

const emit = defineEmits(['update:visible'])

const loading = ref(false)
const error = ref('')
const previewData = ref<any[]>([])
const copying = ref(false)

const title = computed(() => props.tableId ? 'DDL预览' : '批量DDL预览')

const showCopyButton = computed(() => {
  return previewData.value.length > 0 && !error.value
})

const handleCancel = () => {
  emit('update:visible', false)
  previewData.value = []
  error.value = ''
}

const loadPreview = async () => {
  loading.value = true
  error.value = ''
  try {
    if (props.tableId) {
      const response = await previewTableDDL(props.tableId)
      previewData.value = [response.data]
    } else {
      const response = await previewAllTablesDDL()
      previewData.value = response.data
    }
  } catch (e: any) {
    error.value = e.message || '加载DDL预览失败'
  } finally {
    loading.value = false
  }
}

const handleCopy = async () => {
  copying.value = true
  try {
    const ddlText = previewData.value
      .map(preview => `-- Table: ${preview.tableName}\n${preview.ddl}`)
      .join('\n\n')
    await navigator.clipboard.writeText(ddlText)
    message.success('DDL已复制到剪贴板')
  } catch (e) {
    message.error('复制失败')
  } finally {
    copying.value = false
  }
}

// 监听对话框显示状态
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      loadPreview()
    }
  }
)
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.error-message {
  margin-bottom: 16px;
}

.ddl-preview-item {
  margin-bottom: 16px;
}

.ddl-preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.table-name {
  font-weight: bold;
  margin-right: 8px;
}

.ddl-preview-content {
  font-family: monospace;
  margin-bottom: 8px;
}

.dialog-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
