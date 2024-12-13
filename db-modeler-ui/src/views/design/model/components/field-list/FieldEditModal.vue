<template>
  <a-modal
    :visible="visible"
    :title="field?.id ? '编辑字段' : '新建字段'"
    @ok="handleOk"
    @cancel="$emit('cancel')"
    :maskClosable="false"
    :destroyOnClose="true"
    :width="680"
    :bodyStyle="{ padding: '12px 24px' }"
    class="field-edit-modal"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 19, offset: 1 }"
      :colon="true"
    >
      <!-- 基本信息区域 -->
      <div class="form-section">
        <div class="section-title">
          <info-circle-outlined /> 基本信息
        </div>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="字段名" name="name" required>
              <a-input
                v-model:value="formState.name"
                placeholder="请输入字段名"
                :maxLength="64"
                @change="handleNameChange"
                allow-clear
              >
                <template #prefix>
                  <code-outlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示名" name="displayName" required>
              <a-input
                v-model:value="formState.displayName"
                placeholder="请输入显示名称"
                :maxLength="64"
                allow-clear
              >
                <template #prefix>
                  <font-colors-outlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数据类型" name="dataType" required>
              <a-select
                v-model:value="formState.dataType"
                style="width: 100%"
                placeholder="请选择数据类型"
                @change="handleDataTypeChange"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="type in dataTypes"
                  :key="type.value"
                  :value="type.value"
                >
                  <span class="data-type-option">
                    <database-outlined />
                    <span>{{ type.label }}</span>
                    <code>{{ type.value }}</code>
                  </span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-space>
              <a-form-item
                v-if="showLength"
                :label="showPrecision ? '长度' : '长度/精度'"
                name="length"
                :wrapper-col="{ span: 24 }"
                style="margin-bottom: 0"
              >
                <a-input-number
                  v-model:value="formState.length"
                  :min="1"
                  :max="65535"
                  style="width: 100px"
                  placeholder="长度"
                  class="number-input"
                />
              </a-form-item>
              <a-form-item
                v-if="showPrecision"
                label="精度"
                name="precision"
                :wrapper-col="{ span: 24 }"
                style="margin-bottom: 0"
              >
                <a-input-number
                  v-model:value="formState.precision"
                  :min="0"
                  :max="30"
                  style="width: 100px"
                  placeholder="精度"
                  class="number-input"
                />
              </a-form-item>
            </a-space>
          </a-col>
        </a-row>
      </div>

      <!-- 属性设置区域 -->
      <div class="form-section">
        <div class="section-title">
          <setting-outlined /> 属性设置
        </div>
        <a-row>
          <a-col :span="24">
            <div class="properties-group">
              <a-checkbox
                v-model:checked="formState.primaryKey"
                @change="handlePrimaryKeyChange"
                class="property-item"
              >
                <template #icon><key-outlined /></template>
                主键
                <a-tooltip title="设置为表的主键字段">
                  <question-circle-outlined class="help-icon" />
                </a-tooltip>
              </a-checkbox>
              <a-checkbox
                v-model:checked="formState.nullable"
                :disabled="formState.primaryKey"
                class="property-item"
              >
                <template #icon><exclamation-circle-outlined /></template>
                允许为空
                <a-tooltip title="字段值是否可以为空">
                  <question-circle-outlined class="help-icon" />
                </a-tooltip>
              </a-checkbox>
              <a-checkbox
                v-model:checked="formState.autoIncrement"
                :disabled="!canAutoIncrement"
                class="property-item"
              >
                <template #icon><arrow-up-outlined /></template>
                自动递增
                <a-tooltip title="数值类型的主键可以设置为自动递增">
                  <question-circle-outlined class="help-icon" />
                </a-tooltip>
              </a-checkbox>
            </div>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="默认值" name="defaultValue">
              <a-input
                v-model:value="formState.defaultValue"
                placeholder="请输入默认值"
                allow-clear
              >
                <template #prefix>
                  <number-outlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </div>

      <!-- 说明区域 -->
      <div class="form-section">
        <div class="section-title">
          <message-outlined /> 字段说明
        </div>
        <a-form-item name="comment">
          <a-textarea
            v-model:value="formState.comment"
            placeholder="请输入字段说明"
            :rows="2"
            :maxLength="200"
            show-count
            allow-clear
          />
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <a-space>
        <a-button @click="$emit('cancel')">取消</a-button>
        <a-button type="primary" @click="handleOk" :loading="saving">
          确定
        </a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
.field-edit-modal {
  :deep(.ant-modal-content) {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  :deep(.ant-modal-header) {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .ant-modal-title {
      font-size: 16px;
      font-weight: 500;
    }
  }

  :deep(.ant-modal-body) {
    max-height: calc(100vh - 280px);
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 3px;
    }
  }

  :deep(.ant-modal-footer) {
    padding: 12px 24px;
    border-top: 1px solid #f0f0f0;
  }
}

.form-section {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1f1f1f;
    font-weight: 500;
    margin-bottom: 16px;
    padding-left: 8px;
    border-left: 3px solid #1890ff;

    .anticon {
      color: #1890ff;
      opacity: 0.8;
    }
  }
}

.properties-group {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
  }

  .property-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
    
    &:not(.ant-checkbox-wrapper-disabled):hover {
      transform: translateY(-1px);
    }

    .help-icon {
      margin-left: 4px;
      color: #999;
      cursor: help;
      transition: color 0.3s ease;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
}

:deep(.ant-form-item) {
  margin-bottom: 16px;

  .ant-form-item-label {
    padding-bottom: 4px;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

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

.data-type-option {
  display: flex;
  align-items: center;
  gap: 8px;

  code {
    color: #666;
    background: #f5f5f5;
    padding: 2px 4px;
    border-radius: 2px;
    font-size: 12px;
  }

  .anticon {
    color: #1890ff;
    opacity: 0.7;
  }
}

:deep(.ant-input-number) {
  transition: all 0.3s ease;
}

:deep(.ant-input-number:hover) {
  border-color: #40a9ff;
}

:deep(.ant-input-number:focus),
:deep(.ant-input-number-focused) {
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';
import type { PropType } from 'vue';
import type { Field } from '@/types/table';
import { Form } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import {
  InfoCircleOutlined,
  CodeOutlined,
  FontColorsOutlined,
  DatabaseOutlined,
  SettingOutlined,
  KeyOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  NumberOutlined,
  MessageOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue'

const useForm = Form.useForm;

// Props 定义
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  field: {
    type: Object as PropType<Field>,
    default: () => ({})
  },
  dataTypes: {
    type: Array as PropType<Array<{ label: string, value: string }>>,
    required: true
  }
});

// Emits 定义
const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'save', field: Field): void;
  (e: 'cancel'): void;
}>();

// 表单状态
const formState = ref<Field>({
  name: '',
  displayName: '',
  dataType: '',
  length: null,
  precision: null,
  nullable: true,
  primaryKey: false,
  autoIncrement: false,
  defaultValue: '',
  comment: ''
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入字段名' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '字段名只能包含字母、数字和下划线，且必须以字母或下划线开头' }
  ],
  displayName: [
    { required: true, message: '请输入显示名称' }
  ],
  dataType: [
    { required: true, message: '请选择数据类型' }
  ],
  length: [
    { type: 'number', min: 1, message: '长度必须大于0' }
  ],
  precision: [
    { type: 'number', min: 0, message: '精度不能小于0' }
  ]
};

// 表单实例
const formRef = ref();
const { validate, validateInfos } = useForm(formState, rules);

// 计算属性
const showLength = computed(() => {
  const type = formState.value.dataType?.toUpperCase();
  return ['VARCHAR', 'CHAR', 'DECIMAL', 'NUMERIC'].includes(type);
});

const showPrecision = computed(() => {
  const type = formState.value.dataType?.toUpperCase();
  return ['DECIMAL', 'NUMERIC'].includes(type);
});

const canAutoIncrement = computed(() => {
  const type = formState.value.dataType?.toUpperCase();
  return ['INT', 'BIGINT', 'SMALLINT', 'TINYINT'].includes(type) && formState.value.primaryKey;
});

// 监听字段变化
watch(() => props.field, (newField) => {
  if (newField) {
    formState.value = { ...newField };
  }
}, { deep: true });

// 处理数据类型变化
const handleDataTypeChange = (value: string) => {
  formState.value.dataType = value;
  
  // 重置长度和精度
  if (!showLength.value) {
    formState.value.length = null;
  }
  if (!showPrecision.value) {
    formState.value.precision = null;
  }
  
  // 如果不支持自增，关闭自增
  if (!canAutoIncrement.value) {
    formState.value.autoIncrement = false;
  }
};

// 处理主键变化
const handlePrimaryKeyChange = (checked: boolean) => {
  formState.value.primaryKey = checked;
  if (checked) {
    formState.value.nullable = false;
  }
};

// 保存表单
const handleOk = async () => {
  try {
    await validate();
    emit('save', formState.value);
  } catch (error) {
    console.error('表单验证失败:', error);
  }
};

// 取消编辑
const handleCancel = () => {
  emit('cancel');
};

// 数据类型选择过滤
const filterOption = (input: string, option: any) => {
  const label = option.label?.toLowerCase()
  const value = option.value?.toLowerCase()
  const searchText = input.toLowerCase()
  return label?.includes(searchText) || value?.includes(searchText)
}
</script> 