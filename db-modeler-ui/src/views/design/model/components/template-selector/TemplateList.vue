<template>
  <div class="template-list">
    <div class="table-header">
      <div class="selected-info" v-if="props.selectedKeys.length">
        已选择 {{ props.selectedKeys.length }} 个模板
        <a-button type="link" size="small" @click="clearSelection">清除选择</a-button>
      </div>
      <div class="table-tools">
        <a-dropdown :trigger="['click']" v-model:visible="sizeMenuVisible">
          <a-button type="text" size="small">
            <template #icon><column-height-outlined /></template>
            表格密度
          </a-button>
          <template #overlay>
            <a-menu :selected-keys="[tableSize]" @click="handleSizeChange">
              <a-menu-item key="small">紧凑</a-menu-item>
              <a-menu-item key="middle">中等</a-menu-item>
              <a-menu-item key="large">宽松</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <a-table
      :columns="columns"
      :data-source="templates"
      :row-selection="rowSelection"
      :pagination="false"
      :size="tableSize"
      :scroll="{ y: 400 }"
      :row-class-name="getRowClassName"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <div class="action-column">
            <a-space>
              <a-tooltip title="预览模板">
                <a-button type="link" size="small" @click="handlePreview(record)">
                  <template #icon><eye-outlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑模板">
                <a-button type="link" size="small" @click="handleEdit(record)">
                  <template #icon><edit-outlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="复制模板">
                <a-button type="link" size="small" @click="handleCopy(record)">
                  <template #icon><copy-outlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除模板">
                <a-popconfirm
                  title="确定要删除这个模板吗？"
                  @confirm="handleDelete(record)"
                  placement="left"
                >
                  <a-button type="link" size="small" danger>
                    <template #icon><delete-outlined /></template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </a-space>
          </div>
        </template>
        <template v-else-if="column.key === 'createTime'">
          <a-tooltip :title="formatDate(record.createTime, true)">
            {{ formatDate(record.createTime) }}
          </a-tooltip>
        </template>
        <template v-else-if="column.key === 'name'">
          <div class="name-column">
            <span class="template-name">{{ record.name }}</span>
            <a-tag v-if="record.category" size="small" :color="getCategoryColor(record.category)">
              {{ record.category }}
            </a-tag>
          </div>
        </template>
        <template v-else-if="column.key === 'dataType'">
          <a-tag :color="getDataTypeColor(record.dataType)">
            {{ record.dataType }}{{ record.length ? `(${record.length})` : '' }}
          </a-tag>
        </template>
      </template>
      <template #emptyText>
        <div class="empty-content">
          <inbox-outlined />
          <p>暂无模板数据</p>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FieldTemplate } from '@/api/template';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  EyeOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  ColumnHeightOutlined,
  InboxOutlined,
} from '@ant-design/icons-vue';

const props = defineProps<{
  templates: FieldTemplate[];
  selectedKeys: string[];
}>();

const emit = defineEmits<{
  (e: 'select', templates: FieldTemplate[]): void;
  (e: 'preview', template: FieldTemplate): void;
  (e: 'edit', template: FieldTemplate): void;
  (e: 'delete', template: FieldTemplate): void;
  (e: 'copy', template: FieldTemplate): void;
}>();

const tableSize = ref<'small' | 'middle' | 'large'>('small');
const sizeMenuVisible = ref(false);

const formatDate = (date: string | undefined, full = false) => {
  if (!date) return '-';
  return full 
    ? dayjs(date).format('YYYY-MM-DD HH:mm:ss')
    : dayjs(date).format('MM-DD HH:mm');
};

const getRowClassName = (_record: any, index: number) => {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'BASIC': 'blue',
    'BUSINESS': 'green',
    'SYSTEM': 'purple'
  };
  return colors[category] || 'default';
};

const getDataTypeColor = (dataType: string) => {
  const colors: Record<string, string> = {
    'varchar': 'green',
    'char': 'cyan',
    'text': 'blue',
    'int': 'orange',
    'bigint': 'orange',
    'decimal': 'gold',
    'datetime': 'purple',
    'date': 'purple',
    'time': 'purple',
    'boolean': 'red'
  };
  return colors[dataType] || 'default';
};

const columns = [
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
    width: 250,
    sorter: (a: FieldTemplate, b: FieldTemplate) => a.name.localeCompare(b.name),
  },
  {
    title: '字段名',
    dataIndex: 'fieldName',
    key: 'fieldName',
    width: 180,
    sorter: (a: FieldTemplate, b: FieldTemplate) => a.fieldName.localeCompare(b.fieldName),
  },
  {
    title: '数据类型',
    key: 'dataType',
    width: 120,
    sorter: (a: FieldTemplate, b: FieldTemplate) => a.dataType.localeCompare(b.dataType),
  },
  {
    title: '描述',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 120,
    align: 'center',
    sorter: (a: FieldTemplate, b: FieldTemplate) => {
      if (!a.createTime || !b.createTime) return 0;
      return dayjs(a.createTime).unix() - dayjs(b.createTime).unix();
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    align: 'center',
    fixed: 'right',
  },
];

const rowSelection = computed(() => ({
  selectedRowKeys: props.selectedKeys,
  onChange: (selectedRowKeys: string[], selectedRows: FieldTemplate[]) => {
    emit('select', selectedRows);
  },
}));

const clearSelection = () => {
  emit('select', []);
};

const handleSizeChange = ({ key }: { key: string }) => {
  tableSize.value = key as 'small' | 'middle' | 'large';
  sizeMenuVisible.value = false;
};

const handlePreview = (template: FieldTemplate) => {
  try {
    emit('preview', template);
  } catch (error) {
    console.error('预览模板失败:', error);
    message.error('预览模板失败');
  }
};

const handleEdit = (template: FieldTemplate) => {
  try {
    emit('edit', template);
  } catch (error) {
    console.error('编辑模板失败:', error);
    message.error('编辑模板失败');
  }
};

const handleCopy = (template: FieldTemplate) => {
  try {
    emit('copy', template);
  } catch (error) {
    console.error('复制模板失败:', error);
    message.error('复制模板失败');
  }
};

const handleDelete = (template: FieldTemplate) => {
  try {
    emit('delete', template);
  } catch (error) {
    console.error('删除模板失败:', error);
    message.error('删除模板失败');
  }
};
</script>

<style lang="less" scoped>
.template-list {
  margin-top: 16px;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: #fafafa;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

    .selected-info {
      color: #1890ff;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #1890ff;
        border-radius: 50%;
      }
    }

    .table-tools {
      .ant-btn {
        color: rgba(0, 0, 0, 0.45);
        border-radius: 4px;
        padding: 4px 8px;

        &:hover {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
        }

        .anticon {
          font-size: 16px;
        }
      }
    }
  }

  :deep(.ant-table) {
    .ant-table-thead {
      > tr > th {
        background: #fafafa;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        padding: 12px 16px;
        transition: background 0.3s;

        &:hover {
          background: #f0f0f0 !important;
        }

        &.ant-table-column-sort {
          background: #e6f7ff;
        }

        .ant-table-column-sorter {
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }

    .ant-table-tbody {
      > tr {
        &.even-row {
          background-color: #fafafa;
        }

        &.odd-row {
          background-color: #fff;
        }

        &:hover {
          > td {
            background: #e6f7ff !important;
          }
        }

        &.ant-table-row-selected {
          > td {
            background: #e6f7ff;
            
            &:first-child {
              position: relative;
              
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: #1890ff;
              }
            }
          }
        }

        > td {
          padding: 12px 16px;
          transition: all 0.3s;
          border-bottom: 1px solid #f0f0f0;

          &:hover {
            background: rgba(0, 0, 0, 0.02);
          }
        }
      }
    }

    .ant-table-cell {
      &.ant-table-column-sort {
        background: rgba(0, 0, 0, 0.02);
      }
    }
  }

  .action-column {
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    justify-content: center;
    gap: 4px;

    .ant-btn {
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        transform: translateY(-1px);
        background: rgba(0, 0, 0, 0.04);
      }

      &.ant-btn-dangerous {
        &:hover {
          color: #ff4d4f;
          background: rgba(255, 77, 79, 0.1);
        }
      }

      .anticon {
        font-size: 16px;
      }
    }
  }

  .name-column {
    display: flex;
    align-items: center;
    gap: 8px;

    .template-name {
      flex: 1;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ant-tag {
      flex-shrink: 0;
      border-radius: 2px;
      font-size: 12px;
      padding: 0 6px;
      line-height: 18px;
      border: none;
    }
  }

  :deep(.ant-tag) {
    margin: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
    font-size: 12px;
    line-height: 20px;
    padding: 0 8px;
    border: none;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  .empty-content {
    padding: 48px 0;
    text-align: center;
    background: #fafafa;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.25);

    .anticon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    p {
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
    }
  }

  :deep(.ant-dropdown-menu) {
    padding: 4px;
    min-width: 120px;
    border-radius: 4px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
                0 6px 16px 0 rgba(0, 0, 0, 0.08),
                0 9px 28px 8px rgba(0, 0, 0, 0.05);

    .ant-dropdown-menu-item {
      padding: 8px 12px;
      border-radius: 2px;
      transition: all 0.3s;

      &:hover {
        background: rgba(24, 144, 255, 0.1);
      }

      &-selected {
        color: #1890ff;
        font-weight: 500;
        background: rgba(24, 144, 255, 0.1);
      }
    }
  }
}
</style>
