<template>
  <div class="field-list">
    <div class="field-list-header">
      <div class="header-tools">
        <a-space>
          <a-button-group>
            <a-button type="primary" @click="handleAddField">
              <template #icon><plus-outlined /></template>
              新增字段
            </a-button>
            <a-dropdown :trigger="['click']">
              <a-button type="primary">
                <template #icon><down-outlined /></template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="template" @click="handleUseTemplate">
                    <template #icon><snippets-outlined /></template>
                    从模板添加
                  </a-menu-item>
                  <a-menu-item key="copy" @click="handleBatchCopy" :disabled="!selectedFields.length">
                    <template #icon><copy-outlined /></template>
                    复制选中
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="export" @click="handleExportFields">
                    <template #icon><export-outlined /></template>
                    导出字段
                  </a-menu-item>
                  <a-menu-item key="import" @click="handleImportFields">
                    <template #icon><import-outlined /></template>
                    导入字段
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-button-group>

          <a-button-group>
            <a-button @click="handleBatchEdit" :disabled="!selectedFields.length">
              <template #icon><form-outlined /></template>
              批量编辑
            </a-button>
            <a-button danger @click="handleBatchDelete" :disabled="!selectedFields.length">
              <template #icon><delete-outlined /></template>
              批量删除
            </a-button>
          </a-button-group>

          <a-divider type="vertical" />

          <a-button-group>
            <a-tooltip title="上移选中字段">
              <a-button :disabled="!canMoveUp" @click="handleMoveUp">
                <template #icon><arrow-up-outlined /></template>
              </a-button>
            </a-tooltip>
            <a-tooltip title="下移选中字段">
              <a-button :disabled="!canMoveDown" @click="handleMoveDown">
                <template #icon><arrow-down-outlined /></template>
              </a-button>
            </a-tooltip>
          </a-button-group>
        </a-space>

        <a-space>
          <a-radio-group v-model:value="viewMode" size="small" button-style="solid">
            <a-radio-button value="table">表格</a-radio-button>
            <a-radio-button value="card">卡片</a-radio-button>
          </a-radio-group>

          <a-tooltip title="快速编辑模式">
            <a-switch
              v-model:checked="quickEditMode"
              checked-children="快速编辑"
              un-checked-children="普通模式"
            />
          </a-tooltip>

          <a-tooltip title="列设置">
            <a-button type="text" @click="showColumnSettings = true">
              <template #icon><setting-outlined /></template>
            </a-button>
          </a-tooltip>
        </a-space>
      </div>

      <div class="search-tools">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索字段"
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
            placeholder="字段类型"
            allow-clear
          >
            <a-select-option v-for="type in dataTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </a-select-option>
          </a-select>

          <a-select
            v-model:value="filterStatus"
            style="width: 100px"
            placeholder="状态"
            allow-clear
          >
            <a-select-option value="primary">主键</a-select-option>
            <a-select-option value="required">必填</a-select-option>
            <a-select-option value="nullable">可空</a-select-option>
            <a-select-option value="auto">自增</a-select-option>
          </a-select>
        </a-space>
      </div>
    </div>

    <div class="field-table-container">
      <a-table
        :columns="columns"
        :data-source="filteredFields"
        :row-selection="rowSelection"
        :pagination="false"
        size="small"
        bordered
        :scroll="{ y: 400 }"
        :row-class-name="getRowClassName"
      >
        <template #bodyCell="{ column, record, index }">
          <!-- 排序列 -->
          <template v-if="column.key === 'sort'">
            <div class="sort-column">
              <a-space direction="vertical" size="small">
                <up-outlined
                  :class="{ disabled: index === 0 }"
                  @click="handleSortUp(record, index)"
                />
                <down-outlined
                  :class="{ disabled: index === fields.length - 1 }"
                  @click="handleSortDown(record, index)"
                />
              </a-space>
            </div>
          </template>

          <!-- 字段名列 -->
          <template v-else-if="column.key === 'name'">
            <div class="name-column">
              <template v-if="quickEditMode">
                <a-input
                  v-model:value="record.name"
                  @change="() => handleFieldChange(record)"
                  size="small"
                />
              </template>
              <template v-else>
                <span>{{ record.name }}</span>
              </template>
              <template v-if="record.primaryKey">
                <a-tag color="blue">主键</a-tag>
              </template>
              <template v-if="!record.nullable">
                <a-tag color="red">必填</a-tag>
              </template>
            </div>
          </template>

          <!-- 数据类型列 -->
          <template v-else-if="column.key === 'dataType'">
            <div class="type-column">
              <template v-if="quickEditMode">
                <a-select
                  v-model:value="record.dataType"
                  size="small"
                  style="width: 120px"
                  @change="(value) => handleDataTypeChange(record, value)"
                >
                  <a-select-option v-for="type in dataTypes" :key="type.value" :value="type.value">
                    {{ type.label }}
                  </a-select-option>
                </a-select>
                <template v-if="showLength(record.dataType)">
                  <a-input-number
                    v-model:value="record.length"
                    size="small"
                    style="width: 80px"
                    :min="1"
                    @change="() => handleFieldChange(record)"
                  />
                </template>
              </template>
              <template v-else>
                <a-tag :color="getDataTypeColor(record.dataType)">
                  {{ record.dataType }}{{ record.length ? `(${record.length})` : '' }}
                </a-tag>
              </template>
            </div>
          </template>

          <!-- 可空列 -->
          <template v-else-if="column.key === 'nullable'">
            <a-switch
              v-model:checked="record.nullable"
              size="small"
              @change="() => handleFieldChange(record)"
              :disabled="record.primaryKey"
            />
          </template>

          <!-- 主键列 -->
          <template v-else-if="column.key === 'primaryKey'">
            <a-switch
              v-model:checked="record.primaryKey"
              size="small"
              @change="() => handlePrimaryKeyChange(record)"
            />
          </template>

          <!-- 自增列 -->
          <template v-else-if="column.key === 'autoIncrement'">
            <a-switch
              v-model:checked="record.autoIncrement"
              size="small"
              @change="() => handleFieldChange(record)"
              :disabled="!canAutoIncrement(record)"
            />
          </template>

          <!-- 默认值列 -->
          <template v-else-if="column.key === 'defaultValue'">
            <template v-if="quickEditMode">
              <a-input
                v-model:value="record.defaultValue"
                size="small"
                @change="() => handleFieldChange(record)"
                placeholder="默认值"
              />
            </template>
            <template v-else>
              <span>{{ record.defaultValue || '-' }}</span>
            </template>
          </template>

          <!-- 备注列 -->
          <template v-else-if="column.key === 'comment'">
            <template v-if="quickEditMode">
              <a-input
                v-model:value="record.comment"
                size="small"
                @change="() => handleFieldChange(record)"
                placeholder="备注说明"
              />
            </template>
            <template v-else>
              <span>{{ record.comment || '-' }}</span>
            </template>
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <div class="action-column">
              <a-space>
                <a-tooltip title="编辑字段">
                  <a-button type="link" size="small" @click="handleEdit(record)">
                    <template #icon><edit-outlined /></template>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="删除字段">
                  <a-popconfirm
                    title="确定要删除这个字段吗？"
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
        </template>
      </a-table>
    </div>

    <a-modal
      v-model:visible="showColumnSettings"
      title="列设置"
      @ok="handleColumnSettingsOk"
      @cancel="handleColumnSettingsCancel"
    >
      <a-space direction="vertical" style="width: 100%">
        <a-checkbox
          v-for="col in availableColumns"
          :key="col.key"
          v-model:checked="visibleColumns[col.key]"
          :disabled="col.required"
        >
          {{ col.title }}
        </a-checkbox>
        <a-divider />
        <a-button type="link" @click="resetColumnVisibility">
          <template #icon><undo-outlined /></template>
          恢复默认显示
        </a-button>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  PlusOutlined,
  SnippetsOutlined,
  FormOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SearchOutlined,
  EditOutlined,
  UpOutlined,
  DownOutlined,
  ExportOutlined,
  ImportOutlined,
  SettingOutlined,
  UndoOutlined,
  BarsOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Field } from '../types';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const props = defineProps<{
  fields: Field[];
}>();

const emit = defineEmits<{
  (e: 'update:fields', fields: Field[]): void;
  (e: 'add'): void;
  (e: 'edit', field: Field): void;
  (e: 'delete', field: Field): void;
  (e: 'batch-edit', fields: Field[]): void;
  (e: 'use-template'): void;
}>();

const searchText = ref('');
const quickEditMode = ref(false);
const selectedFields = ref<string[]>([]);

const dataTypes = [
  { label: 'VARCHAR - 可变长度字符串', value: 'varchar' },
  { label: 'CHAR - 固定长度字符串', value: 'char' },
  { label: 'TEXT - 长文本', value: 'text' },
  { label: 'INT - 整数', value: 'int' },
  { label: 'BIGINT - 长整数', value: 'bigint' },
  { label: 'DECIMAL - 定点数', value: 'decimal' },
  { label: 'DATETIME - 日期时间', value: 'datetime' },
  { label: 'DATE - 日期', value: 'date' },
  { label: 'TIME - 时间', value: 'time' },
  { label: 'BOOLEAN - 布尔值', value: 'boolean' },
];

const columns = [
  {
    title: '排序',
    key: 'sort',
    width: 60,
    align: 'center',
  },
  {
    title: '字段名',
    key: 'name',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '数据类型',
    key: 'dataType',
    width: 200,
  },
  {
    title: '可空',
    key: 'nullable',
    width: 80,
    align: 'center',
  },
  {
    title: '主键',
    key: 'primaryKey',
    width: 80,
    align: 'center',
  },
  {
    title: '自增',
    key: 'autoIncrement',
    width: 80,
    align: 'center',
  },
  {
    title: '默认值',
    key: 'defaultValue',
    width: 150,
  },
  {
    title: '备注',
    key: 'comment',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
  },
];

const filteredFields = computed(() => {
  let result = props.fields;

  // 搜索过滤
  if (searchText.value) {
    const search = searchText.value.toLowerCase();
    result = result.filter(field => 
      field.name.toLowerCase().includes(search) ||
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

const rowSelection = {
  selectedRowKeys: selectedFields.value,
  onChange: (selectedRowKeys: string[]) => {
    selectedFields.value = selectedRowKeys;
  },
};

const canMoveUp = computed(() => {
  return selectedFields.value.length === 1 && selectedFields.value[0] !== props.fields[0].id;
});

const canMoveDown = computed(() => {
  return selectedFields.value.length === 1 && 
    selectedFields.value[0] !== props.fields[props.fields.length - 1].id;
});

const getDataTypeColor = (type: string) => {
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
    'boolean': 'red',
  };
  return colors[type] || 'default';
};

const showLength = (type: string) => {
  return ['varchar', 'char', 'int', 'bigint', 'decimal'].includes(type);
};

const canAutoIncrement = (field: Field) => {
  return field.primaryKey && ['int', 'bigint'].includes(field.dataType);
};

const getRowClassName = (_record: any, index: number) => {
  return index % 2 === 0 ? 'even-row' : 'odd-row';
};

const handleAddField = () => {
  emit('add');
};

const handleUseTemplate = () => {
  emit('use-template');
};

const handleBatchEdit = () => {
  const fields = props.fields.filter(f => selectedFields.value.includes(f.id!));
  emit('batch-edit', fields);
};

const handleBatchDelete = () => {
  // 实现批量删除逻辑
};

const handleMoveUp = () => {
  if (!canMoveUp.value) return;
  const index = props.fields.findIndex(f => f.id === selectedFields.value[0]);
  if (index > 0) {
    const newFields = [...props.fields];
    [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
    emit('update:fields', newFields);
  }
};

const handleMoveDown = () => {
  if (!canMoveDown.value) return;
  const index = props.fields.findIndex(f => f.id === selectedFields.value[0]);
  if (index < props.fields.length - 1) {
    const newFields = [...props.fields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    emit('update:fields', newFields);
  }
};

const handleSearch = () => {
  // 搜索已经通过计算属性实现
};

const handleFieldChange = (field: Field) => {
  const index = props.fields.findIndex(f => f.id === field.id);
  if (index > -1) {
    const newFields = [...props.fields];
    newFields[index] = { ...field };
    emit('update:fields', newFields);
  }
};

const handleDataTypeChange = (field: Field, value: string) => {
  field.dataType = value;
  if (!showLength(value)) {
    field.length = undefined;
  }
  if (!canAutoIncrement(field)) {
    field.autoIncrement = false;
  }
  handleFieldChange(field);
};

const handlePrimaryKeyChange = (field: Field) => {
  if (!field.primaryKey) {
    field.autoIncrement = false;
  }
  handleFieldChange(field);
};

const handleEdit = (field: Field) => {
  emit('edit', field);
};

const handleDelete = (field: Field) => {
  emit('delete', field);
};

const handleSortUp = (field: Field, index: number) => {
  if (index === 0) return;
  const newFields = [...props.fields];
  [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
  emit('update:fields', newFields);
};

const handleSortDown = (field: Field, index: number) => {
  if (index === props.fields.length - 1) return;
  const newFields = [...props.fields];
  [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
  emit('update:fields', newFields);
};

// 视图模式
const viewMode = ref<'table' | 'card'>('table');

// 列显示控制
const availableColumns = [
  { key: 'name', title: '字段名', required: true },
  { key: 'dataType', title: '数据类型', required: true },
  { key: 'length', title: '长度/精度' },
  { key: 'nullable', title: '可空' },
  { key: 'primaryKey', title: '主键' },
  { key: 'autoIncrement', title: '自增' },
  { key: 'defaultValue', title: '默认值' },
  { key: 'comment', title: '备注' },
];

const visibleColumns = ref(
  availableColumns.reduce((acc, col) => {
    acc[col.key] = true;
    return acc;
  }, {} as Record<string, boolean>)
);

// 过滤条件
const filterType = ref<string>();
const filterStatus = ref<string>();

// 导出字段
const handleExportFields = () => {
  try {
    const exportData = props.fields.map(field => ({
      '字段名': field.name,
      '数据类型': field.dataType,
      '长度/精度': field.length,
      '可空': field.nullable ? '是' : '否',
      '主键': field.primaryKey ? '是' : '否',
      '自增': field.autoIncrement ? '是' : '否',
      '默认值': field.defaultValue || '',
      '备注': field.comment || '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fields');
    
    // 设置列宽
    const colWidths = [
      { wch: 15 }, // 字段名
      { wch: 12 }, // 数据类型
      { wch: 10 }, // 长度/精度
      { wch: 6 },  // 可空
      { wch: 6 },  // 主键
      { wch: 6 },  // 自增
      { wch: 15 }, // 默认值
      { wch: 20 }, // 备注
    ];
    ws['!cols'] = colWidths;

    // 生成并下载文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(data, `table_fields_${Date.now()}.xlsx`);
    message.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    message.error('导出失败');
  }
};

// 导入字段
const handleImportFields = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  input.onchange = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            const newFields = jsonData.map((row: any) => ({
              id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: row['字段名'],
              dataType: row['数据类型'],
              length: row['长度/精度'],
              nullable: row['可空'] === '是',
              primaryKey: row['主键'] === '是',
              autoIncrement: row['自增'] === '是',
              defaultValue: row['默认值'],
              comment: row['备注'],
            }));

            // 验证导入的字段
            const invalidFields = newFields.filter(field => !field.name || !field.dataType);
            if (invalidFields.length > 0) {
              message.error('导入的数据格式不正确，请检查字段名和数据类型是否完整');
              return;
            }

            emit('update:fields', [...props.fields, ...newFields]);
            message.success(`成功导入 ${newFields.length} 个字段`);
          } catch (error) {
            console.error('解析Excel失败:', error);
            message.error('解析Excel失败，请检查文件格式');
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        console.error('导入失败:', error);
        message.error('导入失败');
      }
    }
  };
  input.click();
};

// 复制选中字段
const handleBatchCopy = () => {
  const selectedFieldsList = props.fields.filter(f => selectedFields.value.includes(f.id!));
  const copiedFields = selectedFieldsList.map(field => ({
    ...field,
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${field.name}_copy`,
  }));
  emit('update:fields', [...props.fields, ...copiedFields]);
  message.success(`已复制 ${copiedFields.length} 个字段`);
};

// 列显示控制
const handleColumnVisibilityChange = () => {
  // 确保必需列始终显示
  availableColumns.forEach(col => {
    if (col.required) {
      visibleColumns.value[col.key] = true;
    }
  });
};

const resetColumnVisibility = () => {
  availableColumns.forEach(col => {
    visibleColumns.value[col.key] = true;
  });
  message.success('已恢复默认列显示');
};

const showColumnSettings = ref(false);

const handleColumnSettingsOk = () => {
  handleColumnVisibilityChange();
  showColumnSettings.value = false;
};

const handleColumnSettingsCancel = () => {
  showColumnSettings.value = false;
};
</script>

<style lang="less" scoped>
.field-list {
  .field-list-header {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .header-tools {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #fafafa;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

      .ant-btn-group {
        .ant-btn {
          &:not(:first-child) {
            margin-left: -1px;
          }
        }
      }

      .ant-radio-group {
        .ant-radio-button-wrapper {
          padding: 0 12px;
        }
      }
    }

    .search-tools {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .ant-input-search {
        max-width: 300px;
      }
    }
  }

  .field-table-container {
    :deep(.ant-table) {
      .ant-table-thead {
        > tr > th {
          background: #fafafa;
          font-weight: 600;
          padding: 8px;
          
          &:hover {
            background: #f0f0f0 !important;
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
            padding: 4px 8px;
            transition: all 0.3s;
          }
        }
      }
    }
  }

  .sort-column {
    .anticon {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.45);
      transition: all 0.3s;

      &:hover {
        color: #1890ff;
      }

      &.disabled {
        color: rgba(0, 0, 0, 0.25);
        cursor: not-allowed;

        &:hover {
          color: rgba(0, 0, 0, 0.25);
        }
      }
    }
  }

  .name-column {
    display: flex;
    align-items: center;
    gap: 8px;

    .ant-tag {
      margin: 0;
    }
  }

  .type-column {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .action-column {
    opacity: 0.2;
    transition: opacity 0.3s;

    .ant-btn {
      padding: 0 4px;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  :deep(.ant-table-row:hover) {
    .action-column {
      opacity: 1;
    }
  }

  // 添加卡片视图样式
  .field-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-top: 16px;

    .field-card {
      background: #fff;
      border-radius: 6px;
      padding: 16px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .field-name {
          font-weight: 500;
          font-size: 16px;
        }

        .field-actions {
          opacity: 0;
          transition: opacity 0.3s;
        }
      }

      &:hover .field-actions {
        opacity: 1;
      }

      .card-content {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
        font-size: 13px;

        .label {
          color: rgba(0, 0, 0, 0.45);
        }

        .value {
          color: rgba(0, 0, 0, 0.85);
        }
      }

      .card-footer {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
