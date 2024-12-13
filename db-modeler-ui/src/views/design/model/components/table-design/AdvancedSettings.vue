<template>
  <a-modal
    v-model:visible="visible"
    title="高级设置"
    width="600px"
    @ok="handleSave"
  >
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="表空间">
            <a-input 
              v-model:value="formData.tablespace"
              placeholder="请输入表空间"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="自动增长值">
            <a-input-number
              v-model:value="formData.autoIncrement"
              :min="1"
              :step="1"
              placeholder="请输入自动增长值"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="行格式">
            <a-select 
              v-model:value="formData.rowFormat"
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
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:modelValue', value: any): void
  (e: 'save', value: any): void
}>()

const formData = ref({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
  formData.value = { ...val }
}, { deep: true })

const handleSave = () => {
  emit('save', formData.value)
  emit('update:visible', false)
}
</script> 