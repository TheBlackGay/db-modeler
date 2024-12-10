<template>
  <a-modal
    :visible="visible"
    title="新建表"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :model="formState"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      :rules="rules"
    >
      <a-form-item label="表代码" name="code" required>
        <a-input :value="formState.code" @update:value="updateField('code', $event)" placeholder="请输入表代码" />
      </a-form-item>
      <a-form-item label="表名" name="displayName" required>
        <a-input :value="formState.displayName" @update:value="updateField('displayName', $event)" placeholder="请输入表名" />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea :value="formState.comment" @update:value="updateField('comment', $event)" placeholder="请输入备注信息" />
      </a-form-item>
      <a-form-item label="类型">
        <a-select :value="formState.type" @update:value="updateField('type', $event)">
          <a-select-option value="TABLE">表</a-select-option>
          <a-select-option value="VIEW">视图</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="域">
        <a-select :value="formState.domain" @update:value="updateField('domain', $event)">
          <a-select-option value="BUSINESS">业务域</a-select-option>
          <a-select-option value="SYSTEM">系统域</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TableInfo } from '@/views/design/model/types'

const props = defineProps<{
  visible: boolean
  loading: boolean
  form: Partial<TableInfo>
  rules: Record<string, any[]>
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:form', value: Partial<TableInfo>): void
  (e: 'ok'): void
}>()

const formState = ref<Partial<TableInfo>>(props.form)

watch(() => props.form, (newValue) => {
  formState.value = { ...newValue }
}, { deep: true })

const updateField = (field: keyof TableInfo, value: any) => {
  formState.value = {
    ...formState.value,
    [field]: value
  }
  emit('update:form', formState.value)
}

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('update:visible', false)
}
</script> 