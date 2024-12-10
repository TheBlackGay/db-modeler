<template>
  <a-modal
    :visible="visible"
    title="批量添加字段"
    width="800px"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="batch-field-form">
      <div class="batch-field-form-header">
        <p>请按以下格式输入字段信息，每行一个字段：</p>
        <p class="format-tip">字段名 显示名 数据类型(长度) [可选项]</p>
        <p class="example-tip">示例：</p>
        <pre class="example-code">
id 编号 bigint [pk,ai]
name 名称 varchar(100) [not null]
age 年龄 int
email 邮箱 varchar(200) [null]
status 状态 tinyint(1) [not null,default:1]
created_at 创建时间 datetime [not null]</pre>
      </div>

      <a-form layout="vertical">
        <a-form-item>
          <a-textarea
            v-model:value="content"
            :rows="12"
            :placeholder="placeholder"
          />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Field } from '../types'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', fields: Field[]): void
}>()

const content = ref('')

const placeholder = `id 编号 bigint [pk,ai]
name 名称 varchar(100) [not null]
age 年龄 int
email 邮箱 varchar(200) [null]
status 状态 tinyint(1) [not null,default:1]
created_at 创建时间 datetime [not null]`

// 解析数据类型和长度
const parseDataType = (type: string) => {
  const match = type.match(/^(\w+)(?:\((\d+)(?:,(\d+))?\))?$/)
  if (!match) return null

  const [, dataType, length, precision] = match
  return {
    dataType: dataType.toLowerCase(),
    length: length ? parseInt(length) : 0,
    precision: precision ? parseInt(precision) : 0
  }
}

// 解析可选项
const parseOptions = (options: string) => {
  const result = {
    nullable: true,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: ''
  }

  if (!options) return result

  const opts = options.slice(1, -1).split(',').map(o => o.trim().toLowerCase())
  
  opts.forEach(opt => {
    if (opt === 'pk') result.primaryKey = true
    else if (opt === 'ai') result.autoIncrement = true
    else if (opt === 'not null') result.nullable = false
    else if (opt === 'null') result.nullable = true
    else if (opt.startsWith('default:')) {
      result.defaultValue = opt.split(':')[1]
    }
  })

  return result
}

// 解析字段定义
const parseFieldDefinition = (line: string): Field | null => {
  const parts = line.trim().split(/\s+/)
  if (parts.length < 3) return null

  const name = parts[0]
  const displayName = parts[1]
  const typeMatch = parts.slice(2).join(' ').match(/^([^[]+)(?:\s*(\[.+\]))?$/)
  
  if (!typeMatch) return null
  
  const [, typeStr, optionsStr] = typeMatch
  const typeInfo = parseDataType(typeStr)
  if (!typeInfo) return null
  
  const options = parseOptions(optionsStr || '')
  
  return {
    name,
    displayName,
    dataType: typeInfo.dataType,
    length: typeInfo.length,
    precision: typeInfo.precision,
    nullable: options.nullable,
    primaryKey: options.primaryKey,
    autoIncrement: options.autoIncrement,
    defaultValue: options.defaultValue,
    comment: ''
  }
}

// 处理确定
const handleOk = () => {
  const fields: Field[] = []
  const lines = content.value.split('\n')
  
  for (const line of lines) {
    if (!line.trim()) continue
    const field = parseFieldDefinition(line)
    if (field) {
      fields.push(field)
    }
  }
  
  if (fields.length > 0) {
    emit('save', fields)
    emit('update:visible', false)
    content.value = ''
  }
}

// 处理取消
const handleCancel = () => {
  emit('update:visible', false)
  content.value = ''
}
</script>

<style lang="scss" scoped>
.batch-field-form {
  &-header {
    margin-bottom: 16px;
  }
  
  .format-tip {
    color: #666;
    margin: 8px 0;
  }
  
  .example-tip {
    margin: 8px 0 4px;
    color: #666;
  }
  
  .example-code {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 4px;
    font-family: monospace;
    margin: 0;
  }
}
</style> 