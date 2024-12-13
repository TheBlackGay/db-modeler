<template>
  <div class="search-tools">
    <a-input-search
      v-model:value="searchText"
      placeholder="搜索字段名称、注释"
      @search="handleSearch"
      allow-clear
    >
      <template #prefix>
        <search-outlined />
      </template>
    </a-input-search>

    <a-space>
      <a-select
        v-model:value="filterType"
        style="width: 120px"
        placeholder="数据类型"
        allow-clear
        @change="handleFilterChange"
      >
        <a-select-option v-for="type in dataTypes" :key="type.value" :value="type.value">
          <span>{{ type.label }}</span>
        </a-select-option>
      </a-select>

      <a-select
        v-model:value="filterStatus"
        style="width: 100px"
        placeholder="状态"
        allow-clear
        @change="handleFilterChange"
      >
        <a-select-option value="primary">主键</a-select-option>
        <a-select-option value="required">必填</a-select-option>
        <a-select-option value="nullable">可空</a-select-option>
        <a-select-option value="auto">自增</a-select-option>
      </a-select>

      <a-select
        v-model:value="sortBy"
        style="width: 120px"
        placeholder="排序方式"
        allow-clear
        @change="handleSortChange"
      >
        <a-select-option value="name-asc">名称升序</a-select-option>
        <a-select-option value="name-desc">名称降序</a-select-option>
        <a-select-option value="type">按类型</a-select-option>
        <a-select-option value="required">按必填</a-select-option>
      </a-select>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import type { DataType } from '@/config/database'

interface Props {
  dataTypes: Array<{
    label: string
    value: string
  }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'filter', type: string | undefined, status: string | undefined): void
  (e: 'sort', value: string | undefined): void
}>()

const searchText = ref('')
const filterType = ref<string>()
const filterStatus = ref<string>()
const sortBy = ref<string>()

const handleSearch = () => {
  emit('search', searchText.value)
}

const handleFilterChange = () => {
  emit('filter', filterType.value, filterStatus.value)
}

const handleSortChange = () => {
  emit('sort', sortBy.value)
}

watch(searchText, (value) => {
  emit('search', value)
})
</script>

<style lang="scss" scoped>
.search-tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;

  .ant-input-search {
    max-width: 300px;
  }

  .ant-space {
    flex-wrap: wrap;
  }
}
</style> 