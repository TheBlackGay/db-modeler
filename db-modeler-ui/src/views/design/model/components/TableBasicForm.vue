<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    layout="vertical"
  >
    <a-row :gutter="24">
      <a-col :span="8">
        <a-form-item label="表名" required>
          <a-input
            :value="formData.code"
            placeholder="请输入表名"
            @update:value="updateFormField('code', $event)"
            @change="handleChange"
          />
        </a-form-item>
        <a-form-item label="显示名" required>
          <a-input
            :value="formData.displayName"
            placeholder="请输入显示名"
            @update:value="updateFormField('displayName', $event)"
            @change="handleChange"
          />
        </a-form-item>
        <a-form-item label="数据库类型" required>
          <a-select
            :value="metadata.dbType"
            placeholder="请选择数据库类型"
            @update:value="updateMetadataField('dbType', $event)"
            @change="handleMetadataChange"
          >
            <a-select-option value="MySQL">MySQL</a-select-option>
            <a-select-option value="PostgreSQL">PostgreSQL</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="存储引擎" required>
          <a-select
            :value="metadata.engine"
            :options="engineOptions"
            placeholder="请选择存储引擎"
            @update:value="updateMetadataField('engine', $event)"
            @change="handleMetadataChange"
          />
        </a-form-item>
        <a-form-item label="字符集" required>
          <a-select
            :value="metadata.charset"
            :options="charsetOptions"
            placeholder="请选择字符集"
            @update:value="updateMetadataField('charset', $event)"
            @change="handleMetadataChange"
          />
        </a-form-item>
        <a-form-item label="排序规则" required>
          <a-select
            :value="metadata.collate"
            :options="collateOptions"
            placeholder="请选择排序规则"
            @update:value="updateMetadataField('collate', $event)"
            @change="handleMetadataChange"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item label="表空间">
          <a-input
            :value="metadata.tablespace"
            placeholder="请输入表空间"
            @update:value="updateMetadataField('tablespace', $event)"
            @change="handleMetadataChange"
          />
        </a-form-item>
        <a-form-item label="行格式">
          <a-select
            :value="metadata.rowFormat"
            :options="rowFormatOptions"
            placeholder="请选择行格式"
            @update:value="updateMetadataField('rowFormat', $event)"
            @change="handleMetadataChange"
          />
        </a-form-item>
        <a-form-item label="表注释">
          <a-textarea
            :value="formData.comment"
            :rows="3"
            placeholder="请输入表注释"
            :maxLength="200"
            show-count
            @update:value="updateFormField('comment', $event)"
            @change="handleChange"
          />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { TableInfo, TableMetadata } from '../types'

const props = defineProps<{
  modelValue: TableInfo
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: TableInfo): void
  (e: 'change', value: TableInfo): void
}>()

const formRef = ref()
const formData = ref<TableInfo>({...props.modelValue})
const metadata = ref<TableMetadata>(
  props.modelValue.metadata ? JSON.parse(props.modelValue.metadata) : {
    dbType: 'MySQL',
    engine: 'InnoDB',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    tablespace: '',
    rowFormat: 'DEFAULT'
  }
)

// 数据库引擎选项
const engineOptions = [
  { label: 'InnoDB', value: 'InnoDB' },
  { label: 'MyISAM', value: 'MyISAM' },
  { label: 'Memory', value: 'Memory' },
  { label: 'CSV', value: 'CSV' },
  { label: 'Archive', value: 'Archive' }
]

// 字符集选项
const charsetOptions = [
  { label: 'utf8mb4', value: 'utf8mb4' },
  { label: 'utf8', value: 'utf8' },
  { label: 'latin1', value: 'latin1' },
  { label: 'gbk', value: 'gbk' },
  { label: 'gb2312', value: 'gb2312' }
]

// 排序规则选项
const collateOptions = computed(() => {
  const collations: Record<string, string[]> = {
    utf8mb4: ['utf8mb4_general_ci', 'utf8mb4_unicode_ci', 'utf8mb4_bin'],
    utf8: ['utf8_general_ci', 'utf8_unicode_ci', 'utf8_bin'],
    latin1: ['latin1_swedish_ci', 'latin1_general_ci', 'latin1_bin'],
    gbk: ['gbk_chinese_ci', 'gbk_bin'],
    gb2312: ['gb2312_chinese_ci', 'gb2312_bin']
  }
  
  return (collations[metadata.value.charset] || []).map(value => ({
    label: value,
    value
  }))
})

// 行格式选项
const rowFormatOptions = [
  { label: 'DEFAULT', value: 'DEFAULT' },
  { label: 'DYNAMIC', value: 'DYNAMIC' },
  { label: 'FIXED', value: 'FIXED' },
  { label: 'COMPRESSED', value: 'COMPRESSED' },
  { label: 'REDUNDANT', value: 'REDUNDANT' },
  { label: 'COMPACT', value: 'COMPACT' }
]

// 表单验证规则
const formRules = {
  code: [
    { required: true, message: '请输入表名', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '表名只能包含字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
  ],
  displayName: [
    { required: true, message: '请输入显示名称', trigger: 'blur' }
  ]
}

// 监听字符集变化，自动选择默认排序规则
watch(() => metadata.value.charset, (charset) => {
  const defaultCollations: Record<string, string> = {
    utf8mb4: 'utf8mb4_general_ci',
    utf8: 'utf8_general_ci',
    latin1: 'latin1_swedish_ci',
    gbk: 'gbk_chinese_ci',
    gb2312: 'gb2312_chinese_ci'
  }
  metadata.value.collate = defaultCollations[charset] || ''
  handleMetadataChange()
})

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  formData.value = {...newValue}
  if (newValue.metadata) {
    metadata.value = JSON.parse(newValue.metadata)
  }
}, { deep: true })

const updateFormField = (field: keyof TableInfo, value: any) => {
  formData.value = {
    ...formData.value,
    [field]: value
  }
  handleChange()
}

const updateMetadataField = (field: keyof TableMetadata, value: any) => {
  metadata.value = {
    ...metadata.value,
    [field]: value
  }
  handleMetadataChange()
}

const handleChange = () => {
  const updatedValue = {
    ...formData.value,
    metadata: JSON.stringify(metadata.value)
  }
  emit('update:modelValue', updatedValue)
  emit('change', updatedValue)
}

const handleMetadataChange = () => {
  handleChange()
}

onMounted(() => {
  if (props.modelValue.metadata) {
    try {
      metadata.value = JSON.parse(props.modelValue.metadata)
    } catch (e) {
      console.error('Failed to parse metadata:', e)
    }
  }
})

defineExpose({
  formRef
})
</script> 