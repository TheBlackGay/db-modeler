<template>
  <div class="table-basic-info">
    <a-form 
      :model="modelValue" 
      layout="vertical"
      @update:model-value="handleUpdate"
    >
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item 
            label="表名" 
            required
            :rules="[
              { required: true, message: '请输入表名' },
              { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '表名只能包含字母、数字和下划线，且必须以字母开头' }
            ]"
          >
            <a-input 
              v-model:value="modelValue.name" 
              placeholder="请输入表名"
              :disabled="!!modelValue.id" 
              @change="handleNameChange"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item 
            label="显示名" 
            required
            :rules="[{ required: true, message: '请输入显示名' }]"
          >
            <a-input 
              v-model:value="modelValue.displayName" 
              placeholder="请输入显示名" 
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="数据库类型">
            <a-select 
              v-model:value="modelValue.dbType"
              @change="handleDbTypeChange"
              :options="[
                { label: 'MySQL', value: 'MySQL' },
                { label: 'PostgreSQL', value: 'PostgreSQL' },
                { label: 'Oracle', value: 'Oracle' },
                { label: 'SQLite', value: 'SQLite' },
                { label: 'SQLServer', value: 'SQLServer' }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item 
            label="存储引擎" 
            v-if="modelValue.dbType === 'MySQL'"
          >
            <a-select 
              v-model:value="modelValue.engine"
              :options="[
                { label: 'InnoDB', value: 'InnoDB' },
                { label: 'MyISAM', value: 'MyISAM' },
                { label: 'Memory', value: 'Memory' },
                { label: 'CSV', value: 'CSV' },
                { label: 'Archive', value: 'Archive' }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="字符集">
            <a-select 
              v-model:value="modelValue.charset"
              :options="[
                { label: 'utf8mb4', value: 'utf8mb4' },
                { label: 'utf8', value: 'utf8' },
                { label: 'latin1', value: 'latin1' },
                { label: 'gbk', value: 'gbk' }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="排序规则">
            <a-select 
              v-model:value="modelValue.collate"
              :options="[
                { label: 'utf8mb4_general_ci', value: 'utf8mb4_general_ci' },
                { label: 'utf8mb4_unicode_ci', value: 'utf8mb4_unicode_ci' },
                { label: 'utf8_general_ci', value: 'utf8_general_ci' },
                { label: 'latin1_swedish_ci', value: 'latin1_swedish_ci' }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24">
          <a-form-item label="备注">
            <a-textarea 
              v-model:value="modelValue.comment" 
              placeholder="请输入表备注"
              :rows="3" 
              :maxLength="500"
              show-count
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface TableBasicInfo {
  id?: string
  name: string
  displayName: string
  dbType: string
  engine: string
  charset: string
  collate: string
  comment: string
}

const props = defineProps<{
  modelValue: TableBasicInfo
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: TableBasicInfo): void
}>()

const handleUpdate = (value: TableBasicInfo) => {
  emit('update:modelValue', value)
}

const handleDbTypeChange = (value: string) => {
  const newValue = { ...props.modelValue }
  if (value === 'MySQL') {
    newValue.engine = 'InnoDB'
    newValue.charset = 'utf8mb4'
    newValue.collate = 'utf8mb4_general_ci'
  } else {
    newValue.engine = ''
    newValue.charset = ''
    newValue.collate = ''
  }
  emit('update:modelValue', newValue)
}

const handleNameChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (!props.modelValue.displayName) {
    emit('update:modelValue', {
      ...props.modelValue,
      displayName: value
    })
  }
}
</script>

<style scoped>
.table-basic-info {
  margin-bottom: 24px;
  padding: 24px;
  background: #fafafa;
  border-radius: 2px;
}
</style>
