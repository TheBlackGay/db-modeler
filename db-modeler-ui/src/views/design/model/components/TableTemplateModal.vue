<template>
  <a-modal
    :title="mode === 'save' ? '保存为模板' : '使用模板'"
    :visible="visible"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="600"
  >
    <template v-if="mode === 'save'">
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="模板名称" name="name">
          <a-input v-model:value="formState.name" placeholder="请输入模板名称" />
        </a-form-item>
        <a-form-item label="模板分类" name="category">
          <a-select
            v-model:value="formState.category"
            :options="categoryOptions"
            placeholder="请选择模板分类"
            allow-clear
            show-search
          />
        </a-form-item>
        <a-form-item label="模板描述" name="description">
          <a-textarea
            v-model:value="formState.description"
            placeholder="请输入模板描述"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </template>
    <template v-else>
      <a-space direction="vertical" style="width: 100%">
        <a-select
          v-model:value="selectedTemplate"
          style="width: 100%"
          placeholder="请选择模板"
          :options="templateOptions"
          show-search
          :filter-option="filterOption"
        >
          <template #option="{ value: template }">
            <a-space>
              <span>{{ template.name }}</span>
              <a-tag v-if="template.category">{{ template.category }}</a-tag>
            </a-space>
          </template>
        </a-select>
        <template v-if="selectedTemplate">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="描述">
              {{ selectedTemplate.description || '无' }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间">
              {{ formatDate(selectedTemplate.createTime) }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 12px 0" />
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="引擎">
              {{ selectedTemplate.settings.engine }}
            </a-descriptions-item>
            <a-descriptions-item label="字符集">
              {{ selectedTemplate.settings.charset }}
            </a-descriptions-item>
            <a-descriptions-item label="排序规则">
              {{ selectedTemplate.settings.collation }}
            </a-descriptions-item>
          </a-descriptions>
        </template>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const props = defineProps<{
  visible: boolean
  mode: 'save' | 'apply'
  currentSettings: any
}>()

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'save'): void
  (e: 'apply', settings: any): void
}>()

const loading = ref(false)
const formRef = ref()
const formState = ref({
  name: '',
  category: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入模板名称' }]
}

// 从本地存储加载模板
const loadTemplates = () => {
  try {
    const stored = localStorage.getItem('tableTemplates')
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    console.error('Failed to load templates:', e)
    return []
  }
}

// 保存模板到本地存储
const saveTemplates = (templates: any[]) => {
  try {
    localStorage.setItem('tableTemplates', JSON.stringify(templates))
  } catch (e) {
    console.error('Failed to save templates:', e)
    message.error('保存模板失败')
  }
}

const templates = ref(loadTemplates())
const selectedTemplate = ref<any>(null)

// 计算所有可用的分类选项
const categoryOptions = computed(() => {
  const categories = new Set(templates.value.map(t => t.category).filter(Boolean))
  return Array.from(categories).map(category => ({
    label: category,
    value: category
  }))
})

// 计算模板选项
const templateOptions = computed(() => {
  return templates.value.map(template => ({
    label: template.name,
    value: template
  }))
})

const filterOption = (input: string, option: any) => {
  const template = option.value
  return (
    template.name.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
    (template.category &&
      template.category.toLowerCase().indexOf(input.toLowerCase()) >= 0)
  )
}

const formatDate = (timestamp: number) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const handleOk = async () => {
  if (props.mode === 'save') {
    try {
      await formRef.value?.validate()
      loading.value = true
      
      const newTemplate = {
        ...formState.value,
        settings: props.currentSettings,
        createTime: Date.now()
      }
      
      templates.value = [...templates.value, newTemplate]
      saveTemplates(templates.value)
      
      message.success('保存模板成功')
      emit('save')
      handleCancel()
    } catch (e) {
      console.error('Validation failed:', e)
    } finally {
      loading.value = false
    }
  } else if (selectedTemplate.value) {
    loading.value = true
    emit('apply', selectedTemplate.value.settings)
    handleCancel()
    loading.value = false
  }
}

const handleCancel = () => {
  formState.value = {
    name: '',
    category: '',
    description: ''
  }
  selectedTemplate.value = null
  emit('update:visible', false)
}

// 监听visible变化，重置表单
watch(
  () => props.visible,
  (newVisible) => {
    if (!newVisible) {
      handleCancel()
    }
  }
)
</script>

<style lang="scss" scoped>
.ant-descriptions {
  background-color: #fafafa;
  padding: 12px;
  border-radius: 2px;
}
</style>
