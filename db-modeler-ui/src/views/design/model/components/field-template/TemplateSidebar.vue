<template>
  <div class="template-sidebar">
    <template v-if="showRecent">
      <div class="recent-header">
        <span>最近使用</span>
        <a-button type="link" @click="clearRecent">清空</a-button>
      </div>
      <a-list
        class="recent-list"
        :data-source="recentTemplates"
        size="small"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a @click="selectRecentTemplate(item)">{{ item.name }}</a>
              </template>
              <template #description>
                {{ item.template.dataType }}
                <template v-if="item.template.length">
                  ({{ item.template.length }})
                </template>
              </template>
            </a-list-item-meta>
            <template #extra>
              <a-button
                type="link"
                size="small"
                @click="removeFromRecent(item)"
              >
                <delete-outlined />
              </a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
      <a-divider />
    </template>
    
    <a-menu
      v-model:selectedKeys="selectedCategory"
      style="height: 100%"
      @select="handleCategorySelect"
    >
      <a-menu-item
        v-for="category in categories"
        :key="category.value"
        :disabled="!hasCategoryResults(category.value)"
      >
        <template #icon>
          <folder-outlined v-if="category.value === 'group'" />
          <database-outlined v-else />
        </template>
        {{ category.label }}
        <a-badge
          :count="getCategoryCount(category.value)"
          :number-style="{ backgroundColor: '#52c41a' }"
        />
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DeleteOutlined, FolderOutlined, DatabaseOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  categories: Array<{ value: string; label: string }>
  recentTemplates: Array<any>
  showRecent: boolean
  categoryResults: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'categorySelect', category: string[]): void
  (e: 'clearRecent'): void
  (e: 'selectRecentTemplate', template: any): void
  (e: 'removeFromRecent', template: any): void
}>()

const selectedCategory = ref<string[]>([props.categories[0]?.value])

const hasCategoryResults = (category: string) => {
  return props.categoryResults[category] > 0
}

const getCategoryCount = (category: string) => {
  return props.categoryResults[category] || 0
}

const handleCategorySelect = (info: { selectedKeys: string[] }) => {
  emit('categorySelect', info.selectedKeys)
}

const clearRecent = () => {
  emit('clearRecent')
}

const selectRecentTemplate = (template: any) => {
  emit('selectRecentTemplate', template)
}

const removeFromRecent = (template: any) => {
  emit('removeFromRecent', template)
}
</script>

<style scoped>
.template-sidebar {
  width: 200px;
  border-right: 1px solid #f0f0f0;
  padding-right: 16px;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.recent-list {
  margin-bottom: 16px;
}
</style>
