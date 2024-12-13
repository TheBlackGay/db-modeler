<template>
  <div class="field-list-card">
    <a-row :gutter="[16, 16]">
      <a-col :span="8" v-for="(field, index) in fields" :key="field.id">
        <a-card :bordered="true" size="small" class="field-card">
          <template #title>
            <div class="card-title">
              <template v-if="quickEditMode">
                <a-input
                  v-model:value="field.name"
                  @change="handleFieldChange(field)"
                  size="small"
                  class="name-input"
                />
              </template>
              <template v-else>
                <span class="field-name">{{ field.name }}</span>
              </template>
            </div>
          </template>
          
          <template #extra>
            <a-space>
              <a-button type="link" size="small" @click="$emit('edit', field, index)">
                <template #icon><edit-outlined /></template>
              </a-button>
              <a-popconfirm
                title="确定要删除这个字段吗?"
                @confirm="$emit('delete', field, index)"
              >
                <a-button type="link" danger size="small">
                  <template #icon><delete-outlined /></template>
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>

          <div class="field-content">
            <div class="field-item">
              <span class="label">数据类型:</span>
              <div class="value">
                <template v-if="quickEditMode">
                  <a-select
                    v-model:value="field.dataType"
                    style="width: 100%"
                    size="small"
                    @change="handleFieldChange(field)"
                  >
                    <a-select-option 
                      v-for="type in dataTypes" 
                      :key="type.value" 
                      :value="type.value"
                    >
                      {{ type.label }}
                    </a-select-option>
                  </a-select>
                </template>
                <template v-else>
                  {{ getDataTypeLabel(field.dataType) }}
                </template>
              </div>
            </div>

            <div class="field-item">
              <span class="label">长度/精度:</span>
              <div class="value">
                <template v-if="quickEditMode">
                  <a-input-number
                    v-model:value="field.length"
                    :min="0"
                    size="small"
                    style="width: 100%"
                    @change="handleFieldChange(field)"
                  />
                </template>
                <template v-else>
                  {{ field.length }}
                </template>
              </div>
            </div>

            <div class="field-properties">
              <a-checkbox
                :checked="field.nullable"
                :disabled="!quickEditMode"
                @change="(e) => {
                  field.nullable = e.target.checked
                  handleFieldChange(field)
                }"
              >
                可空
              </a-checkbox>
              <a-checkbox
                :checked="field.primaryKey"
                :disabled="!quickEditMode"
                @change="(e) => {
                  field.primaryKey = e.target.checked
                  handleFieldChange(field)
                }"
              >
                主键
              </a-checkbox>
              <a-checkbox
                :checked="field.autoIncrement"
                :disabled="!quickEditMode"
                @change="(e) => {
                  field.autoIncrement = e.target.checked
                  handleFieldChange(field)
                }"
              >
                自增
              </a-checkbox>
            </div>

            <div class="field-item">
              <span class="label">默认值:</span>
              <div class="value">
                <template v-if="quickEditMode">
                  <a-input
                    v-model:value="field.defaultValue"
                    size="small"
                    @change="handleFieldChange(field)"
                  />
                </template>
                <template v-else>
                  {{ field.defaultValue || '-' }}
                </template>
              </div>
            </div>

            <div class="field-item">
              <span class="label">备注:</span>
              <div class="value">
                <template v-if="quickEditMode">
                  <a-input
                    v-model:value="field.comment"
                    size="small"
                    @change="handleFieldChange(field)"
                  />
                </template>
                <template v-else>
                  {{ field.comment || '-' }}
                </template>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { Field } from '@/views/design/model/types'

interface Props {
  fields: Field[]
  dataTypes: Array<{
    label: string
    value: string
  }>
  quickEditMode: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update', field: Field): void
  (e: 'edit', field: Field, index: number): void
  (e: 'delete', field: Field, index: number): void
}>()

const getDataTypeLabel = (value: string) => {
  const type = props.dataTypes.find(t => t.value === value)
  return type ? type.label : value
}

const handleFieldChange = (field: Field) => {
  emit('update', field)
}
</script>

<style lang="scss" scoped>
.field-list-card {
  .field-card {
    height: 100%;
    
    :deep(.ant-card-head) {
      min-height: 40px;
      padding: 0 12px;
      
      .ant-card-head-title {
        padding: 8px 0;
      }
      
      .ant-card-extra {
        padding: 8px 0;
      }
    }

    .card-title {
      display: flex;
      align-items: center;
      
      .field-name {
        font-weight: 500;
      }
      
      .name-input {
        width: 150px;
      }
    }

    .field-content {
      .field-item {
        margin-bottom: 8px;
        
        .label {
          color: #666;
          font-size: 12px;
        }
        
        .value {
          margin-top: 4px;
        }
      }

      .field-properties {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 8px 0;
      }
    }
  }
}
</style> 