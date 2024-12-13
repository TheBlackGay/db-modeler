# 创建新的BasicInfo组件
<template>
  <div class="table-design-basic">
    <div class="table-design-basic-header" @click="toggleMoreSettings">
      <a-space>
        <component :is="moreSettingsVisible ? 'down-outlined' : 'right-outlined'" />
        <span>更多设置</span>
      </a-space>
      <a-space class="table-design-basic-actions">
        <a-tooltip title="使用模板">
          <folder-outlined @click.stop="$emit('apply-template')" />
        </a-tooltip>
        <a-tooltip title="保存为模板">
          <save-outlined @click.stop="$emit('save-template')" />
        </a-tooltip>
        <a-divider type="vertical" />
        <a-tooltip title="导入设置">
          <import-outlined @click.stop="$emit('import-settings')" />
        </a-tooltip>
        <a-tooltip title="导出设置">
          <export-outlined @click.stop="$emit('export-settings')" />
        </a-tooltip>
      </a-space>
    </div>
    <div class="table-design-basic-content" :class="{ 'visible': moreSettingsVisible }">
      <a-form
        ref="formRef"
        :model="modelValue"
        :rules="formRules"
        layout="vertical"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="表名" required>
              <a-input
                v-model:value="modelValue.name"
                placeholder="请输入表名"
                @change="handleChange"
              />
            </a-form-item>
            <a-form-item label="显示名" required>
              <a-input
                v-model:value="modelValue.displayName"
                placeholder="请输入显示名"
                @change="handleChange"
              />
            </a-form-item>
            <a-form-item label="数据库类型" required>
              <a-select
                v-model:value="modelValue.dbType"
                placeholder="请选择数据库类型"
                @change="handleChange"
              >
                <a-select-option value="MySQL">MySQL</a-select-option>
                <a-select-option value="PostgreSQL">PostgreSQL</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="存储引擎" required>
              <a-select
                v-model:value="modelValue.engine"
                :options="engineOptions"
                placeholder="请选择存储引擎"
              />
            </a-form-item>
            <a-form-item label="字符集" required>
              <a-select
                v-model:value="modelValue.charset"
                :options="charsetOptions"
                placeholder="请选择字符集"
              />
            </a-form-item>
            <a-form-item label="排序规则" required>
              <a-select
                v-model:value="modelValue.collation"
                :options="collationOptions"
                placeholder="请选择排序规则"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="表注释">
              <a-textarea
                v-model:value="modelValue.comment"
                :rows="3"
                placeholder="请输入表注释"
                :maxLength="200"
                show-count
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="link" @click="$emit('show-advanced')">
                  <template #icon><setting-outlined /></template>
                  高级设置
                </a-button>
                <a-button type="link" @click="$emit('show-partition')">
                  <template #icon><partition-outlined /></template>
                  分区设置
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FolderOutlined,
  SaveOutlined,
  ImportOutlined,
  ExportOutlined,
  SettingOutlined,
  PartitionOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import { getEngineOptions, getCharsetOptions, getCollationOptions } from '@/config/database'

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'apply-template'): void
  (e: 'save-template'): void
  (e: 'import-settings'): void
  (e: 'export-settings'): void
  (e: 'show-advanced'): void
  (e: 'show-partition'): void
}>()

const formRef = ref<FormInstance>()
const moreSettingsVisible = ref(true)

const engineOptions = computed(() => getEngineOptions(props.modelValue.dbType))
const charsetOptions = computed(() => getCharsetOptions(props.modelValue.dbType))
const collationOptions = computed(() => getCollationOptions(props.modelValue.dbType, props.modelValue.charset))

const formRules = {
  name: [{ required: true, message: '请输入表名' }],
  displayName: [{ required: true, message: '请输入显示名' }],
  dbType: [{ required: true, message: '请选择数据库类型' }],
  engine: [{ required: true, message: '请选择存储引擎' }],
  charset: [{ required: true, message: '请选择字符集' }],
  collation: [{ required: true, message: '请选择排序规则' }]
}

const toggleMoreSettings = () => {
  moreSettingsVisible.value = !moreSettingsVisible.value
}

const handleChange = () => {
  emit('update:modelValue', props.modelValue)
}
</script>

<style lang="less" scoped>
.table-design-basic {
  background-color: #fff;
  border-radius: 2px;
  margin-bottom: 16px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
  }

  &-content {
    padding: 16px;
    display: none;

    &.visible {
      display: block;
    }
  }
}
</style> 