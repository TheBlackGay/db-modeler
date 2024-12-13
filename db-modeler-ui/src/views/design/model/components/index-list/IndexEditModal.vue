# 创建新文件
<template>
  <a-modal
    :visible="visible"
    :title="index ? '编辑索引' : '新建索引'"
    @cancel="handleCancel"
    @ok="handleOk"
    width="800px"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="索引名" name="name">
        <a-input v-model:value="form.name" placeholder="请输入索引名" />
      </a-form-item>

      <a-form-item label="索引类型" name="type">
        <a-select v-model:value="form.type">
          <a-select-option value="NORMAL">普通索引</a-select-option>
          <a-select-option value="UNIQUE">唯一索引</a-select-option>
          <a-select-option value="FULLTEXT">全文索引</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="索引字段" name="fields">
        <div class="index-fields">
          <a-table
            :columns="fieldColumns"
            :data-source="form.fields"
            :pagination="false"
            size="small"
            bordered
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'name'">
                <a-select
                  v-model:value="record.name"
                  style="width: 100%"
                  @change="value => handleFieldChange(index, 'name', value)"
                >
                  <a-select-option 
                    v-for="field in availableFields"
                    :key="field.name"
                    :value="field.name"
                  >
                    {{ field.name }} ({{ field.displayName }})
                  </a-select-option>
                </a-select>
              </template>

              <template v-else-if="column.key === 'order'">
                <a-select
                  v-model:value="record.order"
                  style="width: 100%"
                  @change="value => handleFieldChange(index, 'order', value)"
                >
                  <a-select-option value="ASC">升序</a-select-option>
                  <a-select-option value="DESC">降序</a-select-option>
                </a-select>
              </template>

              <template v-else-if="column.key === 'action'">
                <a-space>
                  <up-outlined 
                    :class="{ disabled: index === 0 }"
                    @click="handleMoveField(index, 'up')" 
                  />
                  <down-outlined 
                    :class="{ disabled: index === form.fields.length - 1 }"
                    @click="handleMoveField(index, 'down')" 
                  />
                  <delete-outlined 
                    class="delete"
                    @click="handleRemoveField(index)" 
                  />
                </a-space>
              </template>
            </template>
          </a-table>

          <div class="index-fields-actions">
            <a-button type="dashed" block @click="handleAddField">
              <plus-outlined />添加字段
            </a-button>
          </div>
        </div>
      </a-form-item>

      <a-form-item label="备注" name="comment">
        <a-textarea 
          v-model:value="form.comment" 
          placeholder="请输入索引备注"
          :auto-size="{ minRows: 2, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { 
  PlusOutlined, 
  DeleteOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import type { Index, IndexField, Field } from '../../types'

const props = defineProps<{
  visible: boolean
  index: Index | null
  fields: Field[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', value: Index): void
}>()

const formRef = ref<FormInstance>()
const form = ref<Index>({
  name: '',
  type: 'NORMAL',
  fields: [],
  comment: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入索引名', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '索引名只能包含字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择索引类型', trigger: 'change' }
  ],
  fields: [
    { required: true, message: '请添加索引字段', trigger: 'change' },
    { 
      validator: (_: any, value: IndexField[]) => {
        if (!value || value.length === 0) {
          return Promise.reject('请添加索引字段')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

// 字段列定义
const fieldColumns = [
  { title: '字段名', key: 'name', width: '50%' },
  { title: '排序方式', key: 'order', width: '30%' },
  { title: '操作', key: 'action', width: '20%' }
]

// 可选字段列表（排除已选字段）
const availableFields = computed(() => {
  const usedFields = new Set(form.value.fields.map(f => f.name))
  return props.fields.filter(f => !usedFields.has(f.name) || f.name === '')
})

// 监听索引数据变化
watch(() => props.index, (newValue) => {
  if (newValue) {
    form.value = { ...newValue }
  } else {
    form.value = {
      name: '',
      type: 'NORMAL',
      fields: [],
      comment: ''
    }
  }
}, { immediate: true })

// 监听可见性变化
watch(() => props.visible, (newValue) => {
  if (!newValue) {
    formRef.value?.resetFields()
  }
})

// 事件处理
const handleFieldChange = (index: number, key: string, value: any) => {
  const fields = [...form.value.fields]
  fields[index] = { ...fields[index], [key]: value }
  form.value.fields = fields
}

const handleAddField = () => {
  form.value.fields.push({
    name: '',
    order: 'ASC'
  })
}

const handleRemoveField = (index: number) => {
  form.value.fields.splice(index, 1)
}

const handleMoveField = (index: number, direction: 'up' | 'down') => {
  const fields = [...form.value.fields]
  const newIndex = direction === 'up' ? index - 1 : index + 1
  
  if (newIndex >= 0 && newIndex < fields.length) {
    [fields[index], fields[newIndex]] = [fields[newIndex], fields[index]]
    form.value.fields = fields
  }
}

const handleOk = async () => {
  try {
    await formRef.value?.validate()
    emit('save', form.value)
  } catch (error) {
    // 验证失败
  }
}

const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.index-fields {
  &-actions {
    margin-top: 16px;
  }

  :deep(.ant-table) {
    .ant-table-thead > tr > th {
      background-color: #fafafa;
      font-weight: 500;
      padding: 8px;
    }

    .ant-table-tbody > tr > td {
      padding: 4px 8px;
    }
  }

  :deep(.anticon) {
    cursor: pointer;
    font-size: 14px;

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.delete {
      color: #ff4d4f;
    }

    &:hover:not(.disabled) {
      opacity: 0.8;
    }
  }
}
</style> 