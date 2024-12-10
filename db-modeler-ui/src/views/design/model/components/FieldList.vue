<template>
  <div class="field-list">
    <div class="field-toolbar">
      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <a-space>
            <a-button type="primary" @click="handleAddField">
              <template #icon><plus-outlined /></template>
              新增字段
            </a-button>
            <a-button @click="showTemplateSelector = true">
              <template #icon><file-outlined /></template>
              使用模板
            </a-button>
            <a-button 
              :disabled="!hasSelection" 
              @click="handleBatchCopy"
            >
              <template #icon><copy-outlined /></template>
              复制字段
            </a-button>
            <a-button 
              danger 
              :disabled="!hasSelection"
              @click="handleBatchDelete"
            >
              <template #icon><delete-outlined /></template>
              删除字段
            </a-button>
            <a-divider type="vertical" />
            <a-button @click="handleMoveToTop" :disabled="!hasSelection">
              <template #icon><vertical-align-top-outlined /></template>
              移到顶部
            </a-button>
            <a-button @click="handleMoveToBottom" :disabled="!hasSelection">
              <template #icon><vertical-align-bottom-outlined /></template>
              移到底部
            </a-button>
          </a-space>
        </a-col>
        <a-col>
          <a-space>
            <a-switch 
              v-model:checked="quickEdit" 
              checked-children="快速编辑" 
              un-checked-children="快速编辑"
            />
            <a-input-search
              v-model:value="searchText"
              placeholder="搜索字段"
              style="width: 200px"
              @change="handleSearch"
            />
          </a-space>
        </a-col>
      </a-row>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredFields"
      :pagination="false"
      size="small"
      bordered
      :row-key="record => record.id"
      :row-class-name="getRowClassName"
      :scroll="{ y: 'calc(100vh - 300px)' }"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'sort'">
          <a-space>
            <up-outlined 
              :class="{ disabled: index === 0 }"
              @click="handleMoveField(index, 'up')" 
            />
            <down-outlined 
              :class="{ disabled: index === modelValue.length - 1 }"
              @click="handleMoveField(index, 'down')" 
            />
            <drag-outlined class="drag-handle" />
          </a-space>
        </template>

        <template v-else-if="column.dataIndex === 'action'">
          <a-space>
            <a-tooltip title="编辑字段">
              <edit-outlined 
                class="action-icon"
                @click="handleEditField(record)"
              />
            </a-tooltip>
            <a-tooltip title="删除字段">
              <a-popconfirm
                title="确定要删除这个字段吗？"
                @confirm="handleDeleteField(record)"
              >
                <delete-outlined class="action-icon delete" />
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>

        <template v-else>
          <template v-if="quickEdit && isQuickEditable(column.dataIndex)">
            <div :key="'edit-' + record.id + '-' + column.dataIndex" class="quick-edit-cell">
              <template v-if="['nullable', 'primaryKey', 'autoIncrement'].includes(column.dataIndex)">
                <a-checkbox
                  :checked="record[column.dataIndex]"
                  @change="(e) => handleQuickEdit(record.id, column.dataIndex, e.target.checked)"
                />
              </template>
              
              <template v-else-if="column.dataIndex === 'dataType'">
                <a-select
                  :value="record.dataType"
                  :style="{ width: '100%' }"
                  @change="(value) => handleQuickEdit(record.id, 'dataType', value)"
                >
                  <a-select-option 
                    v-for="option in getOptionsForField('dataType')" 
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </template>
              
              <template v-else-if="['length', 'precision'].includes(column.dataIndex)">
                <a-input-number
                  :value="record[column.dataIndex]"
                  :style="{ width: '100%' }"
                  @change="(value) => handleQuickEdit(record.id, column.dataIndex, value)"
                />
              </template>
              
              <template v-else>
                <a-input
                  :value="record[column.dataIndex]"
                  :style="{ width: '100%' }"
                  @change="(e) => handleQuickEdit(record.id, column.dataIndex, e.target.value)"
                />
              </template>
            </div>
          </template>
          <template v-else>
            <template v-if="['primaryKey', 'nullable', 'autoIncrement'].includes(column.dataIndex)">
              <check-outlined v-if="record[column.dataIndex]" class="text-success" />
              <close-outlined v-else class="text-disabled" />
            </template>
            <template v-else>
              {{ formatFieldValue(record, column.dataIndex) }}
            </template>
          </template>
        </template>
      </template>
    </a-table>

    <field-form
      v-model:visible="showFieldForm"
      :field="currentField"
      @save="handleFieldSave"
    />

    <field-template-selector
      v-model="showTemplateSelector"
      @select="handleTemplateSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { 
  PlusOutlined, 
  CopyOutlined, 
  DeleteOutlined,
  EditOutlined,
  UpOutlined,
  DownOutlined,
  DragOutlined,
  CheckOutlined,
  CloseOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  FileOutlined
} from '@ant-design/icons-vue'
import FieldForm from './FieldForm.vue'
import FieldTemplateSelector from './FieldTemplateSelector.vue'
import { QuickEditInput } from './quick-edit-components'

interface Field {
  id?: string
  name: string
  displayName: string
  dataType: string
  length: number
  precision: number
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean
  defaultValue: string
  comment: string
}

const props = defineProps<{
  modelValue: Field[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Field[]): void
}>()

const columns = [
  { 
    title: '排序', 
    dataIndex: 'sort', 
    width: 80,
    fixed: 'left'
  },
  { title: '字段名', dataIndex: 'name', width: 150 },
  { title: '显示名', dataIndex: 'displayName', width: 150 },
  { title: '数据类型', dataIndex: 'dataType', width: 120 },
  { title: '长度/精度', dataIndex: 'length', width: 100 },
  { title: '可空', dataIndex: 'nullable', width: 80 },
  { title: '主键', dataIndex: 'primaryKey', width: 80 },
  { title: '自增', dataIndex: 'autoIncrement', width: 80 },
  { title: '默认值', dataIndex: 'defaultValue', width: 120 },
  { title: '备注', dataIndex: 'comment', width: 200 },
  { 
    title: '操作', 
    dataIndex: 'action', 
    width: 80,
    fixed: 'right'
  }
]

const quickEdit = ref(false)
const showFieldForm = ref(false)
const currentField = ref<Field | null>(null)
const selectedRowKeys = ref<string[]>([])
const searchText = ref('')
const showTemplateSelector = ref(false)

const hasSelection = computed(() => selectedRowKeys.value.length > 0)

const filteredFields = computed(() => {
  if (!searchText.value) {
    return props.modelValue
  }
  
  const searchLower = searchText.value.toLowerCase()
  return props.modelValue.filter(field => 
    field.name.toLowerCase().includes(searchLower) ||
    field.displayName.toLowerCase().includes(searchLower) ||
    field.comment.toLowerCase().includes(searchLower)
  )
})

const handleAddField = () => {
  currentField.value = null
  showFieldForm.value = true
}

const handleEditField = (field: Field) => {
  currentField.value = { ...field }
  showFieldForm.value = true
}

const handleFieldSave = (field: Field) => {
  const newFields = [...props.modelValue]
  if (currentField.value?.id) {
    const index = newFields.findIndex(f => f.id === field.id)
    if (index > -1) {
      newFields[index] = field
    }
  } else {
    newFields.push(field)
  }
  emit('update:modelValue', newFields)
  showFieldForm.value = false
}

const handleDeleteField = (field: Field) => {
  const newFields = props.modelValue.filter(f => f.id !== field.id)
  emit('update:modelValue', newFields)
}

const handleBatchDelete = () => {
  const newFields = props.modelValue.filter(f => !selectedRowKeys.value.includes(f.id!))
  emit('update:modelValue', newFields)
  selectedRowKeys.value = []
}

const handleBatchCopy = () => {
  const selectedFields = props.modelValue
    .filter(f => selectedRowKeys.value.includes(f.id!))
    .map(f => ({
      ...f,
      id: undefined,
      name: `${f.name}_copy`,
      displayName: `${f.displayName}_复制`
    }))
  emit('update:modelValue', [...props.modelValue, ...selectedFields])
  selectedRowKeys.value = []
}

const handleMoveField = (index: number, direction: 'up' | 'down') => {
  if (
    (direction === 'up' && index === 0) || 
    (direction === 'down' && index === props.modelValue.length - 1)
  ) {
    return
  }

  const newFields = [...props.modelValue]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  const temp = newFields[index]
  newFields[index] = newFields[targetIndex]
  newFields[targetIndex] = temp
  emit('update:modelValue', newFields)
}

const handleMoveToTop = () => {
  const newFields = [...props.modelValue]
  const selectedFields = newFields.filter(f => selectedRowKeys.value.includes(f.id!))
  const unselectedFields = newFields.filter(f => !selectedRowKeys.value.includes(f.id!))
  emit('update:modelValue', [...selectedFields, ...unselectedFields])
}

const handleMoveToBottom = () => {
  const newFields = [...props.modelValue]
  const selectedFields = newFields.filter(f => selectedRowKeys.value.includes(f.id!))
  const unselectedFields = newFields.filter(f => !selectedRowKeys.value.includes(f.id!))
  emit('update:modelValue', [...unselectedFields, ...selectedFields])
}

const onSelectionChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const getCheckboxProps = (record: Field) => ({
  disabled: record.primaryKey // 主键字段不能被选中
})

const isQuickEditable = (field: string) => {
  return !['sort', 'action'].includes(field)
}

const getQuickEditComponent = (field: string) => {
  switch (field) {
    case 'nullable':
    case 'primaryKey':
    case 'autoIncrement':
      return 'a-checkbox'
    case 'dataType':
      return 'a-select'
    case 'length':
    case 'precision':
      return 'a-input-number'
    default:
      return 'a-input'
  }
}

const getOptionsForField = (field: string) => {
  if (field === 'dataType') {
    return [
      { label: 'VARCHAR', value: 'varchar' },
      { label: 'CHAR', value: 'char' },
      { label: 'TEXT', value: 'text' },
      { label: 'INT', value: 'int' },
      { label: 'BIGINT', value: 'bigint' },
      { label: 'DECIMAL', value: 'decimal' },
      { label: 'DATETIME', value: 'datetime' },
      { label: 'DATE', value: 'date' },
      { label: 'TIME', value: 'time' },
      { label: 'BOOLEAN', value: 'boolean' }
    ]
  }
  return []
}

const formatFieldValue = (record: Field, field: string) => {
  if (field === 'length' && record.precision) {
    return `${record.length},${record.precision}`
  }
  return record[field as keyof Field]
}

const handleQuickEdit = (recordId: string, field: string, value: any) => {
  const newFields = props.modelValue.map(f => {
    if (f.id === recordId) {
      const newField = JSON.parse(JSON.stringify(f))
      
      if (['nullable', 'primaryKey', 'autoIncrement'].includes(field)) {
        newField[field] = !!value
      } else if (['length', 'precision'].includes(field)) {
        newField[field] = Number(value) || 0
      } else {
        newField[field] = value
      }

      if (field === 'dataType') {
        const upperValue = String(value).toUpperCase()
        if (['VARCHAR', 'CHAR'].includes(upperValue)) {
          newField.length = 255
          newField.precision = 0
        } else if (['INT', 'BIGINT'].includes(upperValue)) {
          newField.length = 0
          newField.precision = 0
        }
      }

      return newField
    }
    return f
  })

  emit('update:modelValue', newFields)
}

const handleSearch = () => {
  // 搜索逻辑已经通过 computed 属性 filteredFields 实现
}

const handleTemplateSelect = (templates: any[]) => {
  const newFields = [...props.modelValue]
  
  const generateId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  templates.forEach(template => {
    let fieldName = template.name
    let counter = 1
    while (newFields.some(f => f.name === fieldName)) {
      fieldName = `${template.name}_${counter}`
      counter++
    }
    
    newFields.push({
      id: generateId(),
      ...template,
      name: fieldName
    })
  })
  
  emit('update:modelValue', newFields)
}

const getRowClassName = (record: Field, index: number) => {
  if (selectedRowKeys.value.includes(record.id!)) {
    return 'row-selected'
  }
  return ''
}

// 添加编辑状态管理
const editingField = ref<{ id: string; field: string } | null>(null)

// 清理函数
onUnmounted(() => {
  editingField.value = null
})
</script>

<style lang="less" scoped>
.field-list {
  margin-top: 16px;
}

.field-toolbar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 2px;
}

.disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

.drag-handle {
  cursor: move;
  color: #999;
}

.action-icon {
  font-size: 16px;
  cursor: pointer;
  color: #1890ff;
}

.action-icon.delete {
  color: #ff4d4f;
}

.text-success {
  color: #52c41a;
}

.text-disabled {
  color: #d9d9d9;
}

.ant-table-thead > tr > th {
  padding: 8px;
  background: #fafafa;
  font-weight: 600;
  color: #1f1f1f;
}

.ant-table-tbody > tr > td {
  padding: 4px 8px;
  transition: background 0.2s;
}

.field-name {
  font-weight: 500;
  color: #1f1f1f;
  .field-tag {
    margin-left: 4px;
    font-size: 11px;
    line-height: 16px;
    padding: 0 4px;
  }
}

.field-type {
  color: #666;
  .field-length {
    color: #999;
    font-size: 12px;
  }
}

.row-selected {
  background-color: #e6f7ff;
}

.row-editing {
  background-color: #fffbe6;
}

.ant-input {
  border-radius: 2px;
}

.ant-select {
  .ant-select-selector {
    border-radius: 2px;
  }
}

.ant-btn {
  padding: 0 4px;
  font-size: 12px;
  &.ant-btn-link {
    height: 22px;
  }
}
</style>
