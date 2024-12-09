<template>
  <div class="template-list-container">
    <template v-if="viewMode === 'card'">
      <div class="template-list">
        <a-card
          v-for="template in templates"
          :key="template.id"
          class="template-card"
          :class="{ selected: selectedTemplates.includes(template.id) }"
          hoverable
          @click="handleTemplateClick(template)"
        >
          <template #title>
            <div class="template-title">
              <span>{{ template.name }}</span>
              <a-tag v-if="template.isSystem" color="blue">系统</a-tag>
            </div>
          </template>
          
          <div class="template-content">
            <p class="template-description">{{ template.description }}</p>
            <div class="template-info">
              <div class="info-item">
                <database-outlined />
                <span>{{ template.dataType }}</span>
                <span v-if="template.length">({{ template.length }})</span>
              </div>
              <div class="info-item" v-if="template.defaultValue">
                <code-outlined />
                <span>默认值: {{ template.defaultValue }}</span>
              </div>
            </div>
            <div class="template-tags" v-if="template.tags?.length">
              <a-tag v-for="tag in template.tags" :key="tag">{{ tag }}</a-tag>
            </div>
          </div>

          <template #actions>
            <a-space>
              <a-button
                type="link"
                size="small"
                @click.stop="handlePreview(template)"
              >
                <eye-outlined /> 预览
              </a-button>
              <a-button
                type="link"
                size="small"
                @click.stop="handleSelect(template)"
              >
                <plus-outlined /> 选择
              </a-button>
            </a-space>
          </template>
        </a-card>
      </div>
    </template>
    
    <template v-else>
      <a-table
        :dataSource="templates"
        :columns="columns"
        :rowSelection="rowSelection"
        :rowKey="record => record.id"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'tags'">
            <a-space wrap>
              <a-tag v-for="tag in record.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-space>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handlePreview(record)">
                <eye-outlined /> 预览
              </a-button>
              <a-button type="link" size="small" @click="handleSelect(record)">
                <plus-outlined /> 选择
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  EyeOutlined,
  PlusOutlined,
  DatabaseOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'

const props = defineProps<{
  templates: any[]
  selectedTemplates: string[]
  viewMode: 'card' | 'table'
}>()

const emit = defineEmits<{
  (e: 'update:selectedTemplates', value: string[]): void
  (e: 'preview', template: any): void
  (e: 'select', template: any): void
}>()

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: '30%',
  },
  {
    title: '数据类型',
    dataIndex: 'dataType',
    key: 'dataType',
    width: '15%',
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: '15%',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    width: '15%',
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
  },
]

const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedTemplates,
  onChange: (selectedRowKeys: string[]) => {
    emit('update:selectedTemplates', selectedRowKeys)
  },
}))

const handleTemplateClick = (template: any) => {
  const newSelection = props.selectedTemplates.includes(template.id)
    ? props.selectedTemplates.filter(id => id !== template.id)
    : [...props.selectedTemplates, template.id]
  emit('update:selectedTemplates', newSelection)
}

const handlePreview = (template: any) => {
  emit('preview', template)
}

const handleSelect = (template: any) => {
  emit('select', template)
}
</script>

<style scoped>
.template-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}

.template-card {
  transition: all 0.3s;

  &.selected {
    border-color: #1890ff;
  }
}

.template-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.template-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.template-description {
  color: #666;
  margin-bottom: 8px;
}

.template-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 12px;
}

.template-tags {
  margin-top: 8px;
}
</style>
