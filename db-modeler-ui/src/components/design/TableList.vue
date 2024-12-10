<template>
  <div class="left-panel">
    <div class="panel-header">
      <span class="title">数据表</span>
      <a-button type="primary" size="small" @click="$emit('create')">
        <template #icon><plus-outlined /></template>
        新建表
      </a-button>
    </div>
    <div class="panel-content">
      <a-input-search
        :value="searchText"
        placeholder="搜索表"
        size="small"
        @update:value="searchText = $event"
      />
      <div class="table-list">
        <a-spin :spinning="loading">
          <a-list :data-source="filteredTableList" :pagination="false">
            <template #renderItem="{ item }">
              <a-list-item @click="$emit('select', item)" :class="{ active: activeTableId === item.id }">
                {{ item.displayName }}
              </a-list-item>
            </template>
          </a-list>
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { TableInfo } from '@/views/design/model/types'

const props = defineProps<{
  loading: boolean
  tableList: TableInfo[]
  activeTableId?: string
}>()

defineEmits<{
  (e: 'create'): void
  (e: 'select', table: TableInfo): void
}>()

const searchText = ref('')

const filteredTableList = computed(() => {
  if (!searchText.value) return props.tableList
  const searchLower = searchText.value.toLowerCase()
  return props.tableList.filter(table => 
    table.displayName.toLowerCase().includes(searchLower) ||
    table.code.toLowerCase().includes(searchLower)
  )
})
</script>

<style lang="scss" scoped>
.left-panel {
  width: 280px;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;

  .panel-header {
    height: 48px;
    padding: 0 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-weight: 500;
    }
  }

  .panel-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;

    .table-list {
      margin-top: 16px;

      .ant-list-item {
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f5f5;
        }

        &.active {
          background-color: #e6f7ff;
          color: #1890ff;
        }
      }
    }
  }
}
</style> 