<template>
  <div class="field-list" ref="fieldListRef" :class="{ 'compact-mode': compact }">
    <div class="field-list-toolbar">
      <div class="left">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索字段名称或说明"
          style="width: 250px"
          allow-clear
        >
          <template #prefix>
            <search-outlined />
          </template>
        </a-input-search>
        <a-select
          v-model:value="filterType"
          placeholder="数据类型"
          style="width: 120px"
          allow-clear
        >
          <template #suffixIcon><filter-outlined /></template>
          <a-select-option v-for="type in dataTypes" :key="type.value" :value="type.value">
            <span class="data-type-option">
              <database-outlined />
              <span>{{ type.label }}</span>
            </span>
          </a-select-option>
        </a-select>
        <a-select
          v-model:value="filterStatus"
          placeholder="字段状态"
          style="width: 120px"
          allow-clear
        >
          <template #suffixIcon><filter-outlined /></template>
          <a-select-option value="primary">
            <key-outlined /> 主键
          </a-select-option>
          <a-select-option value="required">
            <exclamation-circle-outlined /> 必填
          </a-select-option>
          <a-select-option value="nullable">
            <minus-circle-outlined /> 可空
          </a-select-option>
          <a-select-option value="auto">
            <arrow-up-outlined /> 自增
          </a-select-option>
        </a-select>
      </div>
      <div class="right">
        <a-space>
          <a-dropdown :trigger="['click']">
            <a-button>
              <template #icon><plus-outlined /></template>
              添加字段
              <down-outlined />
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item key="new" @click="handleAdd">
                  <template #icon><plus-outlined /></template>
                  新建字段
                </a-menu-item>
                <a-menu-item key="template" @click="handleUseTemplate">
                  <template #icon><file-text-outlined /></template>
                  使用模板
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item v-for="template in quickTemplates" 
                  :key="template.key"
                  @click="() => handleQuickAdd(template)"
                >
                  <template #icon><component :is="template.icon" /></template>
                  {{ template.name }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          
          <a-button-group>
            <a-tooltip title="复制选中字段 (Ctrl+D)">
              <a-button :disabled="!hasSelection" @click="handleCopySelected">
                <copy-outlined />
              </a-button>
            </a-tooltip>
            <a-tooltip title="删除选中字段 (Delete)">
              <a-button danger :disabled="!hasSelection" @click="handleDeleteSelected">
                <delete-outlined />
              </a-button>
            </a-tooltip>
          </a-button-group>
          
          <a-tooltip title="显示设置">
            <a-button @click="showDisplaySettings">
              <setting-outlined />
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>

    <a-table
      :dataSource="filteredFields"
      :columns="columns"
      :pagination="false"
      :rowKey="record => record.id || record.name"
      :rowSelection="{ 
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true
      }"
      :size="compact ? 'small' : 'middle'"
      :scroll="{ x: 1200 }"
      bordered
      @row-click="handleRowClick"
      row-class-name="draggable-row"
      :customRow="customRow"
    >
      <!-- 拖拽手柄列 -->
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'sort'">
          <div class="drag-handle" @mousedown="startDrag($event, record, index)">
            <holder-outlined />
          </div>
        </template>
        <!-- 字段名称列 -->
        <template v-if="column.dataIndex === 'name'">
          <div class="field-name-cell">
            <span :class="{ 'primary-key': record.primaryKey }">{{ record.name }}</span>
            <span class="display-name" v-if="record.displayName">{{ record.displayName }}</span>
          </div>
        </template>

        <!-- 数据类型列 -->
        <template v-if="column.dataIndex === 'dataType'">
          <div class="data-type-cell">
            <database-outlined class="type-icon" />
            <span class="type">{{ record.dataType }}</span>
            <span class="length" v-if="record.length">({{ record.length }})</span>
          </div>
        </template>

        <!-- 属性列 -->
        <template v-if="column.dataIndex === 'properties'">
          <div class="properties-cell">
            <a-tag v-if="record.primaryKey" color="blue">
              <key-outlined /> 主键
            </a-tag>
            <a-tag v-if="record.autoIncrement" color="green">
              <arrow-up-outlined /> 自增
            </a-tag>
            <a-tag v-if="!record.nullable" color="orange">
              <exclamation-circle-outlined /> 必填
            </a-tag>
          </div>
        </template>

        <!-- 默认值列 -->
        <template v-if="column.dataIndex === 'defaultValue'">
          <div class="default-value-cell">
            <number-outlined v-if="record.defaultValue" class="value-icon" />
            <span>{{ record.defaultValue || '-' }}</span>
          </div>
        </template>

        <!-- 说明列 -->
        <template v-if="column.dataIndex === 'comment'">
          <div class="comment-cell" :title="record.comment">
            <info-circle-outlined v-if="record.comment" class="comment-icon" />
            <span>{{ record.comment || '-' }}</span>
          </div>
        </template>

        <!-- 操作列 -->
        <template v-if="column.dataIndex === 'action'">
          <div class="action-cell">
            <a-space>
              <a-button type="link" @click.stop="handleEdit(record)" class="edit-btn">
                <template #icon><edit-outlined /></template>
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这个字段吗？"
                @confirm="handleDelete(record)"
                @click.stop
              >
                <a-button type="link" danger class="delete-btn">
                  <template #icon><delete-outlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 右键菜单 -->
    <a-dropdown
      :visible="contextMenuVisible"
      :trigger="['contextmenu']"
      @visibleChange="handleContextMenuVisibleChange"
      :getPopupContainer="getPopupContainer"
    >
      <template #overlay>
        <a-menu>
          <a-menu-item key="edit" @click="handleContextMenuEdit">
            <template #icon><edit-outlined /></template>
            编辑字段
          </a-menu-item>
          <a-menu-item key="copy" @click="handleContextMenuCopy">
            <template #icon><copy-outlined /></template>
            复制字段
          </a-menu-item>
          <a-menu-item key="delete" @click="handleContextMenuDelete">
            <template #icon><delete-outlined /></template>
            删除字段
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="insertBefore" @click="handleContextMenuInsert('before')">
            <template #icon><arrow-up-outlined /></template>
            在上方插入
          </a-menu-item>
          <a-menu-item key="insertAfter" @click="handleContextMenuInsert('after')">
            <template #icon><arrow-down-outlined /></template>
            在下方插入
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="moveTop" @click="handleContextMenuMove('top')">
            <template #icon><vertical-align-top-outlined /></template>
            移动到顶部
          </a-menu-item>
          <a-menu-item key="moveBottom" @click="handleContextMenuMove('bottom')">
            <template #icon><vertical-align-bottom-outlined /></template>
            移动到底部
          </a-menu-item>
        </a-menu>
      </template>
      <div style="display: none" />
    </a-dropdown>

    <!-- 快速编辑弹出框 -->
    <a-popover
      :visible="quickEditVisible"
      trigger="click"
      placement="right"
      :getPopupContainer="() => {
        if (quickEditTarget?.value) {
          return quickEditTarget.value;
        }
        if (fieldListRef.value) {
          return fieldListRef.value;
        }
        return document.body || document.documentElement;
      }"
      @visibleChange="handleQuickEditVisibleChange"
    >
      <template #content>
        <div class="quick-edit-form">
          <a-form layout="vertical" :model="quickEditField">
            <a-form-item label="字段名" required>
              <a-input v-model:value="quickEditField.name" />
            </a-form-item>
            <a-form-item label="显示名称" required>
              <a-input v-model:value="quickEditField.displayName" />
            </a-form-item>
            <a-form-item label="数据类型" required>
              <a-select v-model:value="quickEditField.dataType" style="width: 100%">
                <a-select-option v-for="type in dataTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <div class="quick-edit-actions">
              <a-space>
                <a-button size="small" @click="cancelQuickEdit">取消</a-button>
                <a-button type="primary" size="small" @click="saveQuickEdit">保存</a-button>
              </a-space>
            </div>
          </a-form>
        </div>
      </template>
      <div style="display: none" />
    </a-popover>

    <!-- 显示设置抽屉 -->
    <a-drawer
      title="显示设置"
      :visible="settingsVisible"
      @close="settingsVisible = false"
      width="300"
    >
      <div class="display-settings">
        <div class="setting-section">
          <div class="section-title">显示模式</div>
          <a-radio-group v-model:value="displayMode">
            <a-radio value="comfortable">舒适</a-radio>
            <a-radio value="compact">紧凑</a-radio>
          </a-radio-group>
        </div>
        
        <div class="setting-section">
          <div class="section-title">显示列</div>
          <a-checkbox-group v-model:value="visibleColumns">
            <div v-for="col in availableColumns" :key="col.key" class="column-option">
              <a-checkbox :value="col.key">{{ col.title }}</a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>
    </a-drawer>

    <!-- 保持现有的模态框部分不变 -->
    <field-edit-modal
      v-model:visible="editModalVisible"
      :field="editingField"
      :dataTypes="dataTypes"
      @save="handleSave"
      @cancel="handleCancel"
    />

    <field-template-modal
      v-model:visible="templateModalVisible"
      :dataTypes="dataTypes"
      @select="handleTemplateSelect"
      @cancel="templateModalVisible = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.field-list {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  
  .field-list-table {
    margin-top: 16px;
    
    .ant-table-wrapper {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
    }
    
    .ant-table {
      background: transparent;
    }
    
    .ant-table-thead > tr > th {
      background: #fafafa;
    }
  }
  
  .field-list-empty {
    padding: 32px;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
  }

  .field-list-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .left {
      display: flex;
      gap: 8px;

      :deep(.ant-input-affix-wrapper) {
        transition: all 0.3s ease;
      }

      :deep(.ant-input-affix-wrapper:hover) {
        border-color: #40a9ff;
      }
      
      :deep(.ant-input-affix-wrapper:focus),
      :deep(.ant-input-affix-wrapper-focused) {
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }

      :deep(.ant-select) {
        .ant-select-selector {
          transition: all 0.3s ease;
        }
        
        .ant-select-selector:hover {
          border-color: #40a9ff;
        }
        
        &.ant-select-focused .ant-select-selector {
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
      }
    }

    .right {
      .action-btn {
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-1px);
          color: #40a9ff;
          border-color: #40a9ff;
        }
      }
    }
  }

  :deep(.ant-table) {
    .ant-table-thead > tr > th {
      background: #fafafa;
      font-weight: 500;
      transition: background 0.3s ease;

      &:hover {
        background: #f0f0f0;
      }
    }

    .ant-table-tbody > tr {
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background: #f5f7fa !important;
        
        td {
          background: transparent !important;
        }
      }

      &.ant-table-row-selected {
        background: #e6f7ff;
        
        td {
          background: transparent !important;
        }
      }
    }

    .field-name-cell {
      .primary-key {
        font-weight: 500;
        color: #1890ff;
      }
      .display-name {
        margin-left: 8px;
        color: #999;
        font-size: 12px;
      }
    }

    .data-type-cell {
      display: flex;
      align-items: center;
      gap: 6px;

      .type-icon {
        color: #1890ff;
        opacity: 0.7;
      }
      
      .type {
        font-family: monospace;
        color: #454545;
      }
      
      .length {
        color: #999;
      }
    }

    .properties-cell {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;

      .ant-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: 0;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }

    .default-value-cell {
      display: flex;
      align-items: center;
      gap: 6px;

      .value-icon {
        color: #52c41a;
        opacity: 0.7;
      }
    }

    .comment-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .comment-icon {
        color: #faad14;
        opacity: 0.7;
      }
    }

    .action-cell {
      .edit-btn, .delete-btn {
        padding: 0 8px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }
  }

  &.compact-mode {
    :deep(.ant-table) {
      td {
        padding: 4px 8px !important;
      }
      
      .ant-table-thead > tr > th {
        padding: 8px !important;
      }
      
      .ant-tag {
        font-size: 12px;
        padding: 0 4px;
        height: 20px;
        line-height: 18px;
      }

      .field-name-cell {
        .display-name {
          font-size: 11px;
        }
      }
    }
  }

  .drag-handle {
    cursor: move;
    color: #8c8c8c;
    transition: color 0.3s ease;
    
    &:hover {
      color: #1890ff;
    }
  }

  .draggable-row {
    transition: background-color 0.3s ease;
    
    &.dragging {
      background-color: #f5f5f5;
    }
  }

  .display-settings {
    .setting-section {
      margin-bottom: 24px;

      .section-title {
        font-size: 14px;
        color: #1f1f1f;
        margin-bottom: 16px;
      }

      .column-option {
        margin-bottom: 8px;
      }
    }
  }

  .quick-edit-form {
    min-width: 300px;
    padding: 8px;

    .quick-edit-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }

  :deep(.ant-table-row) {
    cursor: pointer;
    user-select: none;
  }
}

.data-type-option {
  display: flex;
  align-items: center;
  gap: 8px;

  .anticon {
    color: #1890ff;
    opacity: 0.7;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import type { Field } from '@/types/table'
import {
  SearchOutlined,
  FilterOutlined,
  DatabaseOutlined,
  PlusOutlined,
  FileTextOutlined,
  CopyOutlined,
  DeleteOutlined,
  SettingOutlined,
  EditOutlined,
  KeyOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HolderOutlined,
  NumberOutlined,
  InfoCircleOutlined,
  UserOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
  MoreOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import FieldEditModal from './FieldEditModal.vue'
import FieldTemplateModal from './FieldTemplateModal.vue'
import { useFieldImportExport } from '@/composables/useFieldImportExport'

// Props 定义
const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
});

// Emits 定义
const emit = defineEmits<{
  (e: 'update:fields', fields: Field[]): void;
  (e: 'add'): void;
  (e: 'edit', field: Field): void;
  (e: 'delete', field: Field): void;
  (e: 'selection-change', selectedKeys: string[]): void;
}>();

// 状态管理
const searchText = ref('');
const filterType = ref('');
const filterStatus = ref('');
const selectedRowKeys = ref<string[]>([]);
const contextMenuVisible = ref(false);
const contextMenuTarget = ref<HTMLElement | null>(null);
const quickEditVisible = ref(false);
const quickEditTarget = ref<HTMLElement | null>(null);
const quickEditField = ref<Partial<Field>>({});
const quickEditIndex = ref(-1);

// 计算属性
const filteredFields = computed(() => {
  let result = [...props.fields];
  
  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(field => 
      field.name?.toLowerCase().includes(search) ||
      field.displayName?.toLowerCase().includes(search) ||
      field.comment?.toLowerCase().includes(search)
    );
  }
  
  // 类型过滤
  if (filterType.value) {
    result = result.filter(field => field.dataType === filterType.value);
  }
  
  // 状态过滤
  if (filterStatus.value) {
    switch (filterStatus.value) {
      case 'primary':
        result = result.filter(field => field.primaryKey);
        break;
      case 'required':
        result = result.filter(field => !field.nullable);
        break;
      case 'nullable':
        result = result.filter(field => field.nullable);
        break;
      case 'auto':
        result = result.filter(field => field.autoIncrement);
        break;
    }
  }
  
  return result;
});

// 事件处理
const handleAdd = () => {
  emit('add');
};

const handleEdit = (field: Field) => {
  emit('edit', field);
};

const handleDelete = (field: Field) => {
  emit('delete', field);
};

const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys;
  emit('selection-change', selectedKeys);
};

// 右键菜单处理
const handleContextMenu = (e: MouseEvent, field: Field) => {
  e.preventDefault();
  contextMenuTarget.value = e.target as HTMLElement;
  contextMenuVisible.value = true;
};

// 获取弹出容器
const getPopupContainer = (triggerNode?: HTMLElement) => {
  // 首先尝试使用右键点击的目标元素
  if (contextMenuTarget?.value) {
    return contextMenuTarget.value;
  }
  
  // 然后尝试使用组件引用
  if (fieldListRef.value) {
    return fieldListRef.value;
  }
  
  // 最后使用 document.body
  return document.body || document.documentElement;
};

// 表格列定义
const columns = [
  {
    title: '字段名称',
    dataIndex: 'name',
    width: '20%',
    sorter: (a: Field, b: Field) => a.name.localeCompare(b.name)
  },
  {
    title: '数据类型',
    dataIndex: 'dataType',
    width: '15%'
  },
  {
    title: '属性',
    dataIndex: 'properties',
    width: '15%'
  },
  {
    title: '默认值',
    dataIndex: 'defaultValue',
    width: '15%'
  },
  {
    title: '说明',
    dataIndex: 'comment',
    width: '25%'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '10%',
    fixed: 'right'
  }
]

// 拖拽相关状态
const dragStartIndex = ref<number | null>(null)
const dragEndIndex = ref<number | null>(null)
const isDragging = ref(false)

// 显示设置状态
const settingsVisible = ref(false)
const displayMode = ref('comfortable')
const visibleColumns = ref(['name', 'dataType', 'properties', 'defaultValue', 'comment', 'action'])

// 可用列配置
const availableColumns = [
  { key: 'name', title: '字段名称' },
  { key: 'dataType', title: '数据类型' },
  { key: 'properties', title: '属性' },
  { key: 'defaultValue', title: '默认值' },
  { key: 'comment', title: '说明' },
  { key: 'action', title: '操作' }
]

// 拖拽处理函数
const startDrag = (e: MouseEvent, record: any, index: number) => {
  dragStartIndex.value = index
  isDragging.value = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', endDrag)
}

const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  // 计算拖拽目标位置...
  const rows = document.querySelectorAll('.draggable-row')
  const mouseY = e.clientY
  
  rows.forEach((row, index) => {
    const rect = row.getBoundingClientRect()
    if (mouseY >= rect.top && mouseY <= rect.bottom) {
      dragEndIndex.value = index
    }
  })
}

const endDrag = () => {
  if (dragStartIndex.value !== null && dragEndIndex.value !== null) {
    // 更新字段顺序
    const newFields = [...props.fields]
    const [movedField] = newFields.splice(dragStartIndex.value, 1)
    newFields.splice(dragEndIndex.value, 0, movedField)
    emit('update:fields', newFields)
  }
  
  dragStartIndex.value = null
  dragEndIndex.value = null
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', endDrag)
}

// 快速添加处理函数
const handleQuickAdd = (template: typeof quickTemplates[0]) => {
  const newFields = [...props.fields]
  template.fields.forEach(field => {
    newFields.push({
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })
  })
  emit('update:fields', newFields)
  message.success(`已添加${template.fields.length}个${template.name}`)
}

// 复制和删除选中字段
const handleCopySelected = () => {
  const newFields = [...props.fields]
  selectedRowKeys.value.forEach(key => {
    const field = props.fields.find(f => f.id === key || f.name === key)
    if (field) {
      newFields.push({
        ...cloneDeep(field),
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${field.name}_copy`
      })
    }
  })
  emit('update:fields', newFields)
  message.success(`已复制${selectedRowKeys.value.length}个字段`)
}

const handleDeleteSelected = () => {
  const newFields = props.fields.filter(
    field => !selectedRowKeys.value.includes(field.id || field.name)
  )
  emit('update:fields', newFields)
  selectedRowKeys.value = []
  message.success(`已删除${selectedRowKeys.value.length}个字段`)
}

// 显示设置处理
const showDisplaySettings = () => {
  settingsVisible.value = true
}

// 键盘快捷键处理
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'd' && hasSelection.value) {
    e.preventDefault()
    handleCopySelected()
  } else if (e.key === 'Delete' && hasSelection.value) {
    e.preventDefault()
    handleDeleteSelected()
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// 快速编辑处理函数
const showQuickEdit = (e: MouseEvent, field: Field, index: number) => {
  quickEditTarget.value = e.target as HTMLElement
  quickEditField.value = cloneDeep(field)
  quickEditIndex.value = index
  quickEditVisible.value = true
}

const handleQuickEditVisibleChange = (visible: boolean) => {
  if (!visible) {
    cancelQuickEdit()
  }
}

const cancelQuickEdit = () => {
  quickEditVisible.value = false
  quickEditField.value = null
  quickEditIndex.value = -1
}

const saveQuickEdit = () => {
  if (quickEditField.value && quickEditIndex.value > -1) {
    const newFields = [...props.fields]
    newFields[quickEditIndex.value] = quickEditField.value
    emit('update:fields', newFields)
    cancelQuickEdit()
  }
}
</script> 