<template>
  <a-modal
    :visible="visible"
    :title="field ? '编辑字段' : '新增字段'"
    @cancel="handleCancel"
    @ok="handleOk"
    width="720px"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      layout="vertical"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
            label="字段名" 
            name="name"
          >
            <a-input 
              v-model:value="formState.name" 
              :disabled="!!field?.id"
              placeholder="请输入字段名"
              @change="handleNameChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item 
            label="显示名" 
            name="displayName"
          >
            <a-input 
              v-model:value="formState.displayName" 
              placeholder="请输入显示名"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item 
            label="数据类型" 
            name="dataType"
          >
            <a-select 
              v-model:value="formState.dataType"
              :options="dataTypeOptions"
              @change="handleDataTypeChange"
              show-search
              :filter-option="filterDataType"
            >
              <template #optionLabel="option">
                <span>{{ option?.label || '' }}</span>
                <span v-if="option?.value && getDataTypeConfig(option.value)?.hasLength" style="color: #999">
                  ({{ getDataTypeConfig(option.value)?.maxLength || '∞' }})
                </span>
              </template>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="showLength">
          <a-form-item 
            :label="showPrecision ? '长度' : '长度/精度'" 
            name="length"
          >
            <a-input-number 
              v-model:value="formState.length" 
              :min="1"
              :max="currentDataType?.maxLength"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="showPrecision">
          <a-form-item 
            label="精度" 
            name="precision"
          >
            <a-input-number 
              v-model:value="formState.precision" 
              :min="0"
              :max="formState.length"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-space>
            <a-form-item name="primaryKey">
              <a-checkbox 
                v-model:checked="formState.primaryKey"
                @change="handlePrimaryKeyChange"
              >
                主键
              </a-checkbox>
            </a-form-item>
            <a-form-item name="autoIncrement">
              <a-checkbox 
                v-model:checked="formState.autoIncrement"
                :disabled="!canAutoIncrement"
              >
                自增
              </a-checkbox>
            </a-form-item>
            <a-form-item name="nullable">
              <a-checkbox 
                v-model:checked="formState.nullable"
                :disabled="formState.primaryKey"
              >
                可空
              </a-checkbox>
            </a-form-item>
          </a-space>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
            label="默认值" 
            name="defaultValue"
          >
            <a-input 
              v-model:value="formState.defaultValue" 
              placeholder="请输入默认值"
              :disabled="formState.autoIncrement"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item 
            label="备注" 
            name="comment"
          >
            <a-input 
              v-model:value="formState.comment" 
              placeholder="请输入字段备注"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject, unref, type Ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { 
  getDataTypes, 
  getDataTypeConfig,
  type DataType 
} from '@/config/database'

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
  visible: boolean
  field: Field | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', field: Field): void
}>()

const dbType = inject<Ref<string>>('dbType', ref('MySQL'))
const currentDbType = computed(() => unref(dbType))

console.log('Injected dbType:', currentDbType.value)

const formRef = ref<FormInstance>()
const formState = ref<Field>({
  name: '',
  displayName: '',
  dataType: 'VARCHAR',
  length: 255,
  precision: 0,
  nullable: true,
  primaryKey: false,
  autoIncrement: false,
  defaultValue: '',
  comment: ''
})

const rules = {
  name: [
    { required: true, message: '请输入字段名' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母开头' }
  ],
  displayName: [
    { required: true, message: '请输入显示名' }
  ],
  dataType: [
    { required: true, message: '请选择数据类型' }
  ],
  length: [
    { 
      validator: (rule: any, value: number) => {
        if (showLength.value && !value) {
          return Promise.reject('请输入长度')
        }
        if (currentDataType.value?.maxLength && value > currentDataType.value.maxLength) {
          return Promise.reject(`长度不能超过 ${currentDataType.value.maxLength}`)
        }
        return Promise.resolve()
      }
    }
  ],
  precision: [
    {
      validator: (rule: any, value: number) => {
        if (showPrecision.value && value > formState.value.length) {
          return Promise.reject('精度不能大于长度')
        }
        return Promise.resolve()
      }
    }
  ]
}

const dataTypeOptions = computed(() => {
  console.log('Computing dataTypeOptions with dbType:', currentDbType.value)
  const types = getDataTypes(currentDbType.value)
  console.log('Available data types:', types)
  const options = types.map(type => ({
    label: type.label,
    value: type.value.toUpperCase()
  }))
  console.log('Data type options:', options)
  return options
})

const currentDataType = computed(() => {
  console.log('Getting data type config for:', formState.value.dataType)
  const config = getDataTypeConfig(currentDbType.value, formState.value.dataType)
  console.log('Current data type config:', config)
  return config
})

const showLength = computed(() => {
  return currentDataType.value?.hasLength || false
})

const showPrecision = computed(() => {
  return currentDataType.value?.hasPrecision || false
})

const canAutoIncrement = computed(() => {
  return currentDataType.value?.supportAutoIncrement || false
})

watch(() => props.field, (field) => {
  if (field) {
    formState.value = { 
      ...field,
      dataType: field.dataType.toUpperCase()
    }
  } else {
    formState.value = {
      name: '',
      displayName: '',
      dataType: 'VARCHAR',
      length: 255,
      precision: 0,
      nullable: true,
      primaryKey: false,
      autoIncrement: false,
      defaultValue: '',
      comment: ''
    }
  }
}, { immediate: true })

const handleDataTypeChange = (value: string) => {
  const typeConfig = getDataTypeConfig(currentDbType.value, value)
  if (typeConfig) {
    if (typeConfig.hasLength) {
      formState.value.length = typeConfig.defaultLength || 0
    } else {
      formState.value.length = 0
    }
    if (typeConfig.hasPrecision) {
      formState.value.precision = typeConfig.defaultPrecision || 0
    } else {
      formState.value.precision = 0
    }
    if (!typeConfig.supportAutoIncrement) {
      formState.value.autoIncrement = false
    }
  }
}

const handlePrimaryKeyChange = (checked: boolean) => {
  if (checked) {
    formState.value.nullable = false
  }
  if (!checked || !currentDataType.value?.supportAutoIncrement) {
    formState.value.autoIncrement = false
  }
}

const handleNameChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (!formState.value.displayName) {
    formState.value.displayName = value
  }
}

const filterDataType = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const handleOk = () => {
  formRef.value?.validate().then(() => {
    emit('save', { 
      ...formState.value,
      id: props.field?.id
    })
    emit('update:visible', false)
  })
}

const handleCancel = () => {
  emit('update:visible', false)
}

// 监听 dbType 的变化
watch(currentDbType, (newDbType) => {
  console.log('dbType changed:', newDbType)
  // 当数据库类型改变时，重新验证当前数据类型是否有效
  const types = getDataTypes(newDbType)
  if (!types.find(t => t.value.toUpperCase() === formState.value.dataType.toUpperCase())) {
    // 如果当前数据类型在新的数据库类型中不存在，则重置为默认值
    const defaultType = types[0]
    if (defaultType) {
      formState.value.dataType = defaultType.value.toUpperCase()
      formState.value.length = defaultType.defaultLength || 0
      formState.value.precision = defaultType.defaultPrecision || 0
    }
  }
}, { immediate: true })
</script>

<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
