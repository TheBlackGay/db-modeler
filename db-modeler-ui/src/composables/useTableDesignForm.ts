import { ref, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { getEngineOptions, getCharsetOptions, getCollationOptions } from '@/config/database'

export interface PartitionConfig {
  type: 'RANGE' | 'LIST' | 'HASH' | 'KEY'
  expression?: string
  count?: number
  partitions?: Array<{
    name: string
    value: string | number
    comment?: string
  }>
}

export interface TableInfo {
  name: string
  displayName: string
  dbType: string
  engine: string
  charset: string
  collation: string
  comment?: string
  tablespace?: string
  autoIncrement?: number
  rowFormat?: string
  partitionConfig?: PartitionConfig
}

export function useTableDesignForm() {
  const formRef = ref<FormInstance>()
  const tableInfo = ref<TableInfo>({
    name: '',
    displayName: '',
    dbType: 'MySQL',
    engine: '',
    charset: '',
    collation: ''
  })

  const engineOptions = computed(() => getEngineOptions(tableInfo.value.dbType))
  const charsetOptions = computed(() => getCharsetOptions(tableInfo.value.dbType))
  const collationOptions = computed(() => getCollationOptions(tableInfo.value.dbType, tableInfo.value.charset))

  const formRules = {
    name: [{ required: true, message: '请输入表名' }],
    displayName: [{ required: true, message: '请输入显示名' }],
    dbType: [{ required: true, message: '请选择数据库类型' }],
    engine: [{ required: true, message: '请选择存储引擎' }],
    charset: [{ required: true, message: '请选择字符集' }],
    collation: [{ required: true, message: '请选择排序规则' }]
  }

  const validateForm = async () => {
    try {
      await formRef.value?.validate()
      return true
    } catch (error) {
      return false
    }
  }

  const resetForm = () => {
    formRef.value?.resetFields()
  }

  const updateTableInfo = (info: Partial<TableInfo>) => {
    tableInfo.value = {
      ...tableInfo.value,
      ...info
    }
  }

  return {
    formRef,
    tableInfo,
    engineOptions,
    charsetOptions,
    collationOptions,
    formRules,
    validateForm,
    resetForm,
    updateTableInfo
  }
} 