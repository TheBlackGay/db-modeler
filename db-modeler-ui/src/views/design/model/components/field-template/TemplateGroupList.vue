<template>
  <div class="template-group-container">
    <div class="group-header">
      <div class="group-actions">
        <a-space>
          <a-button type="primary" @click="$emit('createGroup')">
            <template #icon><plus-outlined /></template>
            新建分组
          </a-button>
          <a-dropdown>
            <a-button>
              <template #icon><import-outlined /></template>
              导入/导出
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="$emit('importGroups')">
                  <upload-outlined />导入分组
                </a-menu-item>
                <a-menu-item @click="$emit('exportSelectedGroups')">
                  <download-outlined />导出选中分组
                </a-menu-item>
                <a-menu-item @click="$emit('exportAllGroups')">
                  <export-outlined />导出所有分组
                </a-menu-item>
                <a-menu-item @click="$emit('exportAsSQL')">
                  <database-outlined />导出为 SQL
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-dropdown v-if="selectedGroups.length > 0" :trigger="['hover']">
            <a-button>
              <template #icon><setting-outlined /></template>
              批量操作
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="$emit('batchDuplicate')">
                  <copy-outlined />复制所选分组
                </a-menu-item>
                <a-menu-item @click="$emit('batchDelete')">
                  <delete-outlined />删除所选分组
                </a-menu-item>
                <a-menu-item @click="$emit('batchTags')">
                  <tags-outlined />批量管理标签
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-select
            v-model:value="selectedTags"
            mode="multiple"
            placeholder="按标签筛选"
            style="min-width: 200px"
            :options="availableTags"
            :maxTagCount="3"
            allowClear
            @change="handleTagsChange"
          >
            <template #suffixIcon>
              <tag-outlined />
            </template>
          </a-select>
        </a-space>
      </div>
    </div>

    <template v-if="viewMode === 'card'">
      <draggable
        v-model="groups"
        class="template-group-list"
        handle=".drag-handle"
        @start="$emit('dragStart')"
        @end="$emit('dragEnd')"
      >
        <template #item="{ element: group }">
          <a-card
            :key="group.id"
            class="template-group-card"
            :class="{ 
              'is-selected': selectedGroups.includes(group.id),
              'is-dragging': isDragging && draggedGroup?.id === group.id
            }"
          >
            <template #title>
              <div class="group-title">
                <drag-outlined class="drag-handle" />
                <span>{{ group.name }}</span>
                <a-tag
                  v-if="group.isSystem"
                  color="blue"
                >系统</a-tag>
                <a-tag
                  v-if="group.isImported"
                  color="green"
                >已导入</a-tag>
              </div>
            </template>
            <template #extra>
              <a-space>
                <a-checkbox
                  :checked="selectedGroups.includes(group.id)"
                  @change="(e) => handleGroupCheckChange(e, group.id)"
                />
                <a-dropdown :trigger="['click']">
                  <a-button type="link">
                    <template #icon><more-outlined /></template>
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="$emit('editGroup', group)">
                        <edit-outlined />编辑
                      </a-menu-item>
                      <a-menu-item @click="$emit('duplicateGroup', group)">
                        <copy-outlined />复制
                      </a-menu-item>
                      <a-menu-item @click="$emit('exportAsSQL', group)">
                        <database-outlined />导出为 SQL
                      </a-menu-item>
                      <a-menu-item 
                        v-if="!group.isSystem"
                        danger 
                        @click="handleDelete(group)"
                      >
                        <delete-outlined />删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </template>
            <div class="group-content">
              <div class="group-info">
                <p class="group-description">{{ group.description }}</p>
                <div class="group-meta">
                  <span>
                    <template-outlined />
                    {{ group.templates.length }} 个模板
                  </span>
                  <span>
                    <clock-outlined />
                    {{ formatDate(group.lastModified) }}
                  </span>
                </div>
                <div class="group-tags">
                  <a-tag
                    v-for="tag in group.tags"
                    :key="tag"
                    :color="getTagColor(tag)"
                    closable
                    @close="$emit('removeTag', group.id, tag)"
                  >
                    {{ tag }}
                  </a-tag>
                  <a-tag
                    v-if="group.tags.length < 5"
                    style="background: #fff; borderStyle: dashed"
                    @click="$emit('addTag', group)"
                  >
                    <plus-outlined /> 添加标签
                  </a-tag>
                </div>
                
                <!-- 模板预览 -->
                <a-collapse
                  v-if="group.templates.length > 0"
                  ghost
                  :bordered="false"
                >
                  <a-collapse-panel key="templates">
                    <template #header>
                      <span class="template-preview-header">
                        <unordered-list-outlined />
                        模板列表
                      </span>
                    </template>
                    <div class="template-list">
                      <a-tag
                        v-for="template in group.templates"
                        :key="template.id"
                        :color="getTemplateColor(template)"
                      >
                        {{ template.name }}
                      </a-tag>
                    </div>
                  </a-collapse-panel>
                </a-collapse>

                <!-- 推荐模板 -->
                <template v-if="group.recommendedTemplates?.length">
                  <div class="recommended-templates">
                    <div class="section-title">
                      <bulb-outlined />
                      推荐模板
                    </div>
                    <div class="template-list">
                      <a-tag
                        v-for="template in group.recommendedTemplates"
                        :key="template.id"
                        color="orange"
                        style="cursor: pointer"
                        @click="$emit('addTemplate', group, template)"
                      >
                        <plus-outlined /> {{ template.name }}
                      </a-tag>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <template #actions>
              <a-space>
                <a-button type="link" size="small" @click="$emit('previewGroup', group)">
                  <eye-outlined /> 预览
                </a-button>
                <a-button 
                  type="link" 
                  size="small"
                  @click="handleReorder(group)"
                >
                  <ordered-list-outlined /> 排序
                </a-button>
                <a-button 
                  type="primary" 
                  size="small"
                  @click="$emit('selectGroup', group)"
                >
                  <check-outlined /> 选择
                </a-button>
              </a-space>
            </template>
          </a-card>
        </template>
      </draggable>
    </template>
    <template v-else>
      <a-table
        :dataSource="groups"
        :columns="columns"
        :rowSelection="{ selectedRowKeys: selectedGroups, onChange: handleSelectionChange }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import {
  PlusOutlined, ImportOutlined, UploadOutlined, DownloadOutlined,
  ExportOutlined, DatabaseOutlined, SettingOutlined, TagOutlined,
  EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined,
  DragOutlined, MoreOutlined, TemplateOutlined, ClockOutlined,
  UnorderedListOutlined, OrderedListOutlined, BulbOutlined,
  CheckOutlined
} from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

const props = defineProps<{
  groups: any[]
  selectedGroups: string[]
  viewMode: 'card' | 'table'
  availableTags: Array<{ label: string, value: string }>
}>()

const emit = defineEmits<{
  (e: 'update:selectedGroups', value: string[]): void
  (e: 'createGroup'): void
  (e: 'importGroups'): void
  (e: 'exportSelectedGroups'): void
  (e: 'exportAllGroups'): void
  (e: 'exportAsSQL', group: any): void
  (e: 'batchDuplicate'): void
  (e: 'batchDelete'): void
  (e: 'batchTags'): void
  (e: 'dragStart'): void
  (e: 'dragEnd'): void
  (e: 'previewGroup', group: any): void
  (e: 'editGroup', group: any): void
  (e: 'duplicateGroup', group: any): void
  (e: 'deleteGroup', groupId: string): void
  (e: 'removeTag', groupId: string, tag: string): void
  (e: 'addTag', group: any): void
  (e: 'addTemplate', group: any, template: any): void
  (e: 'selectGroup', group: any): void
  (e: 'reorderTemplates', group: any): void
}>()

const isDragging = ref(false)
const draggedGroup = ref<any>(null)

// 处理删除确认
function handleDelete(group: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分组 "${group.name}" 吗？此操作不可恢复。`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      emit('deleteGroup', group.id)
    }
  })
}

// 处理模板排序
function handleReorder(group: any) {
  emit('reorderTemplates', group)
}

// 获取标签颜色
function getTagColor(tag: string) {
  const colors = {
    system: 'blue',
    custom: 'green',
    common: 'orange',
    default: 'default'
  }
  return colors[tag] || colors.default
}

// 获取模板颜色
function getTemplateColor(template: any) {
  if (template.isSystem) return 'blue'
  if (template.isCustom) return 'green'
  return 'default'
}

// 格式化日期
function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  // 24小时内
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours === 0) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} 分钟前`
    }
    return `${hours} 小时前`
  }
  
  // 7天内
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days} 天前`
  }
  
  // 其他情况显示具体日期
  return date.toLocaleDateString()
}

// 处理分组选择
function handleGroupCheckChange(e: any, groupId: string) {
  const newSelection = e.target.checked
    ? [...props.selectedGroups, groupId]
    : props.selectedGroups.filter(id => id !== groupId)
  emit('update:selectedGroups', newSelection)
}
</script>

<style scoped>
.template-group-container {
  flex: 1;
  overflow: auto;
}

.group-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.template-group-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.template-group-card {
  transition: all 0.3s;
  
  &.is-selected {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  &.is-dragging {
    opacity: 0.5;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .drag-handle {
    cursor: move;
    color: #999;
    
    &:hover {
      color: #666;
    }
  }
}

.group-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-description {
  color: #666;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group-meta {
  display: flex;
  gap: 16px;
  color: #999;
  font-size: 12px;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.group-tags {
  margin: 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.template-preview-header {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
}

.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.recommended-templates {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #f0f0f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
}

:deep(.ant-collapse-ghost) {
  background: transparent;
  
  .ant-collapse-header {
    padding: 4px 0 !important;
  }
  
  .ant-collapse-content {
    background: transparent;
  }
  
  .ant-collapse-content-box {
    padding: 0 !important;
  }
}
</style>
