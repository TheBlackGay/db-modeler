<template>
  <div class="table-settings">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="存储引擎" name="engine">
        <a-select
          v-model:value="form.engine"
          placeholder="请选择存储引擎"
          @change="handleEngineChange"
        >
          <a-select-option 
            v-for="engine in engineOptions"
            :key="engine.value"
            :value="engine.value"
          >
            {{ engine.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="字符集" name="charset">
        <a-select
          v-model:value="form.charset"
          placeholder="请选择字符集"
          @change="handleCharsetChange"
        >
          <a-select-option 
            v-for="charset in charsetOptions"
            :key="charset.value"
            :value="charset.value"
          >
            {{ charset.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="排序规则" name="collation">
        <a-select
          v-model:value="form.collation"
          placeholder="请选择排序规则"
          :disabled="!form.charset"
        >
          <a-select-option 
            v-for="collation in collationOptions"
            :key="collation.value"
            :value="collation.value"
          >
            {{ collation.label }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="表注释" name="comment">
        <a-textarea
          v-model:value="form.comment"
          placeholder="请输入表注释"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>

      <a-divider>高级设置</a-divider>

      <a-form-item label="表空间" name="tablespace">
        <a-input
          v-model:value="form.tablespace"
          placeholder="请输入表空间名称"
        />
      </a-form-item>

      <a-form-item label="自增值" name="autoIncrement">
        <a-input-number
          v-model:value="form.autoIncrement"
          :min="1"
          :step="1"
          placeholder="请输入自增初始值"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="行格式" name="rowFormat">
        <a-select
          v-model:value="form.rowFormat"
          placeholder="请选择行格式"
        >
          <a-select-option value="DEFAULT">DEFAULT</a-select-option>
          <a-select-option value="DYNAMIC">DYNAMIC</a-select-option>
          <a-select-option value="FIXED">FIXED</a-select-option>
          <a-select-option value="COMPRESSED">COMPRESSED</a-select-option>
          <a-select-option value="REDUNDANT">REDUNDANT</a-select-option>
          <a-select-option value="COMPACT">COMPACT</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>

    <div class="form-actions">
      <a-space>
        <a-button type="primary" @click="handleSave">保存</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { 
  getEngineOptions,
  getCharsetOptions,
  getCollateOptions
} from '@/config/database'

interface TableSettings {
  engine: string
  charset: string
  collation: string
  comment: string
  tablespace?: string
  autoIncrement?: number
  rowFormat?: string
}

const props = defineProps<{
  modelValue: TableSettings
  dbType: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: TableSettings): void
  (e: 'save', value: TableSettings): void
}>()

const formRef = ref<FormInstance>()
const form = ref<TableSettings>({ ...props.modelValue })

// 选项
const engineOptions = computed(() => getEngineOptions(props.dbType))
const charsetOptions = computed(() => getCharsetOptions(props.dbType))
const collationOptions = computed(() => getCollateOptions(props.dbType, form.value.charset))

// 表单验证规则
const rules = {
  engine: [
    { required: true, message: '请选择存储引擎', trigger: 'change' }
  ],
  charset: [
    { required: true, message: '请选择字符集', trigger: 'change' }
  ],
  collation: [
    { required: true, message: '请选择排序规则', trigger: 'change' }
  ]
}

// 监听数据变化
watch(() => props.modelValue, (newValue) => {
  form.value = { ...newValue }
}, { deep: true })

// 事件处理
const handleEngineChange = () => {
  emit('update:modelValue', { ...form.value })
}

const handleCharsetChange = () => {
  // 切换字符集时，重置排序规则
  form.value.collation = ''
  emit('update:modelValue', { ...form.value })
}

const handleSave = async () => {
  try {
    await formRef.value?.validate()
    emit('save', form.value)
    message.success('保存成功')
  } catch (error) {
    // 验证失败
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.table-settings {
  padding: 24px;
  background: #fff;

  .form-actions {
    margin-top: 24px;
    text-align: center;
  }
}
</style> 