<template>
  <a-modal
    :visible="visible"
    title="使用字段模板"
    @ok="handleOk"
    @cancel="$emit('cancel')"
    :maskClosable="false"
    :destroyOnClose="true"
    width="800px"
  >
    <div class="template-modal">
      <div class="template-filter">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索模板"
          style="width: 240px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="category"
          style="width: 160px"
          placeholder="选择分类"
          allowClear
          @change="handleCategoryChange"
        >
          <a-select-option value="COMMON">常用字段</a-select-option>
          <a-select-option value="SYSTEM">系统字段</a-select-option>
          <a-select-option value="BUSINESS">业务字段</a-select-option>
          <a-select-option value="CUSTOM">自定义</a-select-option>
        </a-select>
      </div>

      <a-table
        :dataSource="filteredTemplates"
        :columns="columns"
        :pagination="false"
        :rowKey="record => record.id"
        :rowSelection="{ selectedRowKeys: selectedKeys, onChange: handleSelectionChange }"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'dataType'">
            {{ getDataTypeLabel(record.dataType) }}
          </template>
          <template v-if="column.key === 'properties'">
            <a-space>
              <a-tag v-if="record.primaryKey" color="blue">主键</a-tag>
              <a-tag v-if="!record.nullable" color="red">必填</a-tag>
              <a-tag v-if="record.autoIncrement" color="green">自增</a-tag>
            </a-space>
          </template>
        </template>
      </a-table>

      <div class="template-preview" v-if="selectedTemplate">
        <div class="preview-title">预览</div>
        <a-descriptions :column="2" size="small" bordered>
          <a-descriptions-item label="字段名">
            {{ selectedTemplate.name }}
          </a-descriptions-item>
          <a-descriptions-item label="显示名称">
            {{ selectedTemplate.displayName }}
          </a-descriptions-item>
          <a-descriptions-item label="数据类型">
            {{ getDataTypeLabel(selectedTemplate.dataType) }}
          </a-descriptions-item>
          <a-descriptions-item label="长度/精度">
            {{ selectedTemplate.length || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="默认值">
            {{ selectedTemplate.defaultValue || '-' }}
          </a-descriptions-item>
          <a-descriptions-item label="备注">
            {{ selectedTemplate.comment || '-' }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Field } from '@/views/design/model/types'

interface Props {
  visible: boolean
  dataTypes: Array<{
    label: string
    value: string
  }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'select', template: Field): void
  (e: 'cancel'): void
}>()

// 状态
const searchText = ref('')
const category = ref<string>()
const selectedKeys = ref<string[]>([])

// 模拟模板数据
const templates = [
  {
    id: 'id',
    name: 'id',
    displayName: '主键ID',
    dataType: 'BIGINT',
    length: 0,
    precision: 0,
    nullable: false,
    primaryKey: true,
    autoIncrement: true,
    defaultValue: '',
    comment: '主键ID',
    category: 'COMMON'
  },
  {
    id: 'name',
    name: 'name',
    displayName: '名称',
    dataType: 'VARCHAR',
    length: 64,
    precision: 0,
    nullable: false,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: '',
    comment: '名称',
    category: 'COMMON'
  },
  {
    id: 'created_at',
    name: 'created_at',
    displayName: '创建时间',
    dataType: 'DATETIME',
    length: 0,
    precision: 0,
    nullable: false,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: 'CURRENT_TIMESTAMP',
    comment: '创建时间',
    category: 'SYSTEM'
  },
  {
    id: 'updated_at',
    name: 'updated_at',
    displayName: '更新时间',
    dataType: 'DATETIME',
    length: 0,
    precision: 0,
    nullable: false,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    comment: '更新时间',
    category: 'SYSTEM'
  },
  {
    id: 'deleted',
    name: 'deleted',
    displayName: '是否删除',
    dataType: 'TINYINT',
    length: 0,
    precision: 0,
    nullable: false,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: '0',
    comment: '是否删除: 0-未删除, 1-已删除',
    category: 'SYSTEM'
  }
]

// 计算属性
const filteredTemplates = computed(() => {
  let result = [...templates]

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(template =>
      template.name.toLowerCase().includes(search) ||
      template.displayName.toLowerCase().includes(search) ||
      template.comment?.toLowerCase().includes(search)
    )
  }

  if (category.value) {
    result = result.filter(template => template.category === category.value)
  }

  return result
})

const selectedTemplate = computed(() => {
  if (selectedKeys.value.length === 0) return null
  return templates.find(t => t.id === selectedKeys.value[0])
})

const columns = [
  {
    title: '字段名',
    key: 'name',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '显示名称',
    key: 'displayName',
    dataIndex: 'displayName',
    width: 150
  },
  {
    title: '数据类型',
    key: 'dataType',
    dataIndex: 'dataType',
    width: 120
  },
  {
    title: '属性',
    key: 'properties',
    width: 200
  },
  {
    title: '备注',
    key: 'comment',
    dataIndex: 'comment'
  }
]

// 方法
const getDataTypeLabel = (value: string) => {
  const type = props.dataTypes.find(t => t.value === value)
  return type ? type.label : value
}

const handleSearch = () => {
  selectedKeys.value = []
}

const handleCategoryChange = () => {
  selectedKeys.value = []
}

const handleSelectionChange = (selectedRowKeys: string[]) => {
  selectedKeys.value = selectedRowKeys
}

const handleOk = () => {
  if (selectedTemplate.value) {
    emit('select', selectedTemplate.value)
  }
}
</script>

<style lang="scss" scoped>
.template-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .template-filter {
    display: flex;
    gap: 16px;
  }

  .template-preview {
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    padding: 16px;

    .preview-title {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
    }
  }
}
</style> 