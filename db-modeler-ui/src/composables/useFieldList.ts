import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { Field } from '@/views/design/model/types'

export interface UseFieldListOptions {
  onUpdate: (fields: Field[]) => void
}

export function useFieldList(fields: Field[], options: UseFieldListOptions) {
  const selectedFields = ref<string[]>([])
  const searchText = ref('')
  const filterType = ref<string>()
  const filterStatus = ref<string>()
  const quickEditMode = ref(false)
  const viewMode = ref<'table' | 'card'>('table')

  const dataTypes = [
    { label: 'VARCHAR - 可变长度字符串', value: 'varchar' },
    { label: 'CHAR - 固定长度字符串', value: 'char' },
    { label: 'TEXT - 长文本', value: 'text' },
    { label: 'INT - 整数', value: 'int' },
    { label: 'BIGINT - 长整数', value: 'bigint' },
    { label: 'DECIMAL - 定点数', value: 'decimal' },
    { label: 'DATETIME - 日期时间', value: 'datetime' },
    { label: 'DATE - 日期', value: 'date' },
    { label: 'TIME - 时间', value: 'time' },
    { label: 'BOOLEAN - 布尔值', value: 'boolean' }
  ]

  const filteredFields = computed(() => {
    let result = fields

    // 搜索过滤
    if (searchText.value) {
      const search = searchText.value.toLowerCase()
      result = result.filter(field => 
        field.name.toLowerCase().includes(search) ||
        field.comment?.toLowerCase().includes(search)
      )
    }

    // 类型过滤
    if (filterType.value) {
      result = result.filter(field => field.dataType === filterType.value)
    }

    // 状态过滤
    if (filterStatus.value) {
      switch (filterStatus.value) {
        case 'primary':
          result = result.filter(field => field.primaryKey)
          break
        case 'required':
          result = result.filter(field => !field.nullable)
          break
        case 'nullable':
          result = result.filter(field => field.nullable)
          break
        case 'auto':
          result = result.filter(field => field.autoIncrement)
          break
      }
    }

    return result
  })

  const canMoveUp = computed(() => {
    return selectedFields.value.length === 1 && selectedFields.value[0] !== fields[0].id
  })

  const canMoveDown = computed(() => {
    return selectedFields.value.length === 1 && 
      selectedFields.value[0] !== fields[fields.length - 1].id
  })

  const handleFieldChange = (field: Field) => {
    const index = fields.findIndex(f => f.id === field.id)
    if (index > -1) {
      const newFields = [...fields]
      newFields[index] = { ...field }
      options.onUpdate(newFields)
    }
  }

  const handleDataTypeChange = (field: Field, value: string) => {
    field.dataType = value
    if (!showLength(value)) {
      field.length = undefined
    }
    if (!canAutoIncrement(field)) {
      field.autoIncrement = false
    }
    handleFieldChange(field)
  }

  const handlePrimaryKeyChange = (field: Field) => {
    if (!field.primaryKey) {
      field.autoIncrement = false
    }
    handleFieldChange(field)
  }

  const handleMoveUp = () => {
    if (!canMoveUp.value) return
    const index = fields.findIndex(f => f.id === selectedFields.value[0])
    if (index > 0) {
      const newFields = [...fields]
      ;[newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]]
      options.onUpdate(newFields)
    }
  }

  const handleMoveDown = () => {
    if (!canMoveDown.value) return
    const index = fields.findIndex(f => f.id === selectedFields.value[0])
    if (index < fields.length - 1) {
      const newFields = [...fields]
      ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
      options.onUpdate(newFields)
    }
  }

  const handleBatchCopy = () => {
    const selectedFieldsList = fields.filter(f => selectedFields.value.includes(f.id!))
    const copiedFields = selectedFieldsList.map(field => ({
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${field.name}_copy`
    }))
    options.onUpdate([...fields, ...copiedFields])
    message.success(`已复制 ${copiedFields.length} 个字段`)
  }

  const handleBatchDelete = () => {
    const newFields = fields.filter(f => !selectedFields.value.includes(f.id!))
    options.onUpdate(newFields)
    selectedFields.value = []
    message.success(`已删除 ${selectedFields.value.length} 个字段`)
  }

  const showLength = (type: string) => {
    return ['varchar', 'char', 'int', 'bigint', 'decimal'].includes(type)
  }

  const canAutoIncrement = (field: Field) => {
    return field.primaryKey && ['int', 'bigint'].includes(field.dataType)
  }

  const getDataTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'varchar': 'green',
      'char': 'cyan',
      'text': 'blue',
      'int': 'orange',
      'bigint': 'orange',
      'decimal': 'gold',
      'datetime': 'purple',
      'date': 'purple',
      'time': 'purple',
      'boolean': 'red'
    }
    return colors[type] || 'default'
  }

  return {
    selectedFields,
    searchText,
    filterType,
    filterStatus,
    quickEditMode,
    viewMode,
    dataTypes,
    filteredFields,
    canMoveUp,
    canMoveDown,
    handleFieldChange,
    handleDataTypeChange,
    handlePrimaryKeyChange,
    handleMoveUp,
    handleMoveDown,
    handleBatchCopy,
    handleBatchDelete,
    showLength,
    canAutoIncrement,
    getDataTypeColor
  }
} 