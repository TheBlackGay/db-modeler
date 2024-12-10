<template>
  <div class="right-panel">
    <div class="panel-header">
      <span class="title">属性</span>
    </div>
    <div class="panel-content">
      <template v-if="tableData">
        <a-form :model="formState" layout="vertical">
          <a-form-item label="表代码">
            <a-input :value="formState.code" @update:value="updateField('code', $event)" placeholder="请输入表代码" />
          </a-form-item>
          <a-form-item label="表名">
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
          <a-form-item label="位置">
            <div class="position-inputs">
              <a-input-number
                :value="formState.position.x"
                @update:value="updatePosition('x', $event)"
                placeholder="X"
                style="width: 120px"
              />
              <a-input-number
                :value="formState.position.y"
                @update:value="updatePosition('y', $event)"
                placeholder="Y"
                style="width: 120px"
              />
            </div>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="handleSave">保存</a-button>
              <a-button @click="handleReset">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </template>
      <template v-else>
        <div class="empty-state">
          <p>请选择一个表格以查看和编辑其属性</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TableInfo } from '@/views/design/model/types'

const props = defineProps<{
  tableData: (TableInfo & { position: { x: number, y: number } }) | null
}>()

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'reset'): void
  (e: 'position-change'): void
  (e: 'update:tableData', value: TableInfo & { position: { x: number, y: number } }): void
}>()

const formState = ref<TableInfo & { position: { x: number, y: number } }>(props.tableData || {
  code: '',
  displayName: '',
  comment: '',
  type: 'TABLE',
  domain: 'BUSINESS',
  position: { x: 0, y: 0 }
})

watch(() => props.tableData, (newValue) => {
  if (newValue) {
    formState.value = { ...newValue }
  }
}, { deep: true })

const updateField = (field: keyof TableInfo, value: any) => {
  formState.value = {
    ...formState.value,
    [field]: value
  }
  emit('update:tableData', formState.value)
}

const updatePosition = (axis: 'x' | 'y', value: number) => {
  formState.value = {
    ...formState.value,
    position: {
      ...formState.value.position,
      [axis]: value
    }
  }
  emit('update:tableData', formState.value)
  emit('position-change')
}

const handleSave = () => {
  emit('save')
}

const handleReset = () => {
  emit('reset')
}
</script>

<style lang="scss" scoped>
.right-panel {
  width: 320px;
  background-color: #fff;
  border-left: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  .panel-header {
    height: 48px;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;

    .title {
      font-weight: 500;
    }
  }

  .panel-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .position-inputs {
      display: flex;
      gap: 8px;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: #999;
    }
  }
}
</style> 