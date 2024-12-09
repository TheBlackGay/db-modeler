<template>
  <a-modal
    :visible="visible"
    :title="'分区设置'"
    width="800px"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="分区类型" name="type">
        <a-select v-model:value="form.type">
          <a-select-option value="RANGE">RANGE分区</a-select-option>
          <a-select-option value="LIST">LIST分区</a-select-option>
          <a-select-option value="HASH">HASH分区</a-select-option>
          <a-select-option value="KEY">KEY分区</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="分区表达式" name="expression" v-if="form.type !== 'KEY'">
        <a-input v-model:value="form.expression" placeholder="例如: YEAR(create_time) 或 id" />
      </a-form-item>

      <template v-if="form.type === 'RANGE' || form.type === 'LIST'">
        <a-form-item label="分区定义" name="partitions">
          <div class="partition-list">
            <a-table
              :columns="partitionColumns"
              :data-source="form.partitions"
              :pagination="false"
              size="small"
              bordered
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'name'">
                  <a-input 
                    v-model:value="record.name"
                    placeholder="分区名称"
                    @change="() => validatePartition(index)"
                  />
                </template>

                <template v-else-if="column.dataIndex === 'value'">
                  <a-input 
                    v-model:value="record.value"
                    :placeholder="form.type === 'RANGE' ? 'LESS THAN 值' : 'IN 值列表'"
                    @change="() => validatePartition(index)"
                  />
                </template>

                <template v-else-if="column.dataIndex === 'comment'">
                  <a-input 
                    v-model:value="record.comment"
                    placeholder="备注"
                  />
                </template>

                <template v-else-if="column.dataIndex === 'action'">
                  <a-space>
                    <up-outlined 
                      :class="{ disabled: index === 0 }"
                      @click="handleMovePartition(index, 'up')"
                    />
                    <down-outlined 
                      :class="{ disabled: index === form.partitions.length - 1 }"
                      @click="handleMovePartition(index, 'down')"
                    />
                    <delete-outlined 
                      class="delete"
                      @click="handleRemovePartition(index)"
                    />
                  </a-space>
                </template>
              </template>
            </a-table>

            <div class="partition-actions">
              <a-button type="dashed" block @click="handleAddPartition">
                <plus-outlined />添加分区
              </a-button>
            </div>
          </div>
        </a-form-item>
      </template>

      <template v-else-if="form.type === 'HASH'">
        <a-form-item label="分区数量" name="partitionCount">
          <a-input-number 
            v-model:value="form.partitionCount"
            :min="1"
            :max="1024"
          />
        </a-form-item>
      </template>

      <template v-else-if="form.type === 'KEY'">
        <a-form-item label="分区字段" name="keyColumns">
          <a-select
            v-model:value="form.keyColumns"
            mode="multiple"
            :options="fieldOptions"
            placeholder="选择分区字段"
          />
        </a-form-item>
        <a-form-item label="分区数量" name="partitionCount">
          <a-input-number 
            v-model:value="form.partitionCount"
            :min="1"
            :max="1024"
          />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { 
  PlusOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

interface PartitionConfig {
  type: 'RANGE' | 'LIST' | 'HASH' | 'KEY'
  expression?: string
  partitions?: Array<{
    name: string
    value: string
    comment?: string
  }>
  partitionCount?: number
  keyColumns?: string[]
}

const props = defineProps<{
  visible: boolean
  config?: PartitionConfig
  fields: Array<{
    name: string
    displayName: string
  }>
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', value: PartitionConfig): void
}>()

const formRef = ref<FormInstance>()
const form = ref<PartitionConfig>({
  type: 'RANGE',
  expression: '',
  partitions: [],
  partitionCount: 4,
  keyColumns: []
})

// 监听配置变化
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    form.value = {
      type: newConfig.type || 'RANGE',
      expression: newConfig.expression || '',
      partitions: [...(newConfig.partitions || [])],
      partitionCount: newConfig.partitionCount || 4,
      keyColumns: [...(newConfig.keyColumns || [])]
    }
  }
}, { immediate: true })

onMounted(() => {
  if (props.config) {
    form.value = {
      type: props.config.type || 'RANGE',
      expression: props.config.expression || '',
      partitions: [...(props.config.partitions || [])],
      partitionCount: props.config.partitionCount || 4,
      keyColumns: [...(props.config.keyColumns || [])]
    }
  }
})

const rules = {
  type: [{ required: true, message: '请选择分区类型' }],
  expression: [{ required: true, message: '请输入分区表达式', trigger: 'blur' }],
  partitions: [{
    required: true,
    message: '请至少添加一个分区',
    trigger: 'change',
    type: 'array',
    min: 1
  }],
  partitionCount: [{
    required: true,
    message: '请输入分区数量',
    trigger: 'change',
    type: 'number',
    min: 1,
    max: 1024
  }],
  keyColumns: [{
    required: true,
    message: '请选择分区字段',
    trigger: 'change',
    type: 'array',
    min: 1
  }]
}

const partitionColumns = [
  { title: '分区名称', dataIndex: 'name', width: '25%' },
  { title: '分区值', dataIndex: 'value', width: '35%' },
  { title: '备注', dataIndex: 'comment', width: '25%' },
  { title: '操作', dataIndex: 'action', width: '15%' }
]

const fieldOptions = computed(() => 
  props.fields.map(f => ({
    label: `${f.name} (${f.displayName})`,
    value: f.name
  }))
)

const validatePartition = (index: number) => {
  const partition = form.value.partitions?.[index]
  if (!partition) return

  // 验证分区名称
  if (!partition.name) {
    partition.name = `p${index}`
  } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(partition.name)) {
    partition.name = `p${index}`
  }

  // 验证分区值
  if (form.value.type === 'RANGE') {
    if (!partition.value.toUpperCase().startsWith('LESS THAN')) {
      partition.value = `LESS THAN (${partition.value})`
    }
  } else if (form.value.type === 'LIST') {
    if (!partition.value.toUpperCase().startsWith('IN')) {
      partition.value = `IN (${partition.value})`
    }
  }
}

const handleAddPartition = () => {
  if (!form.value.partitions) {
    form.value.partitions = []
  }
  const index = form.value.partitions.length
  form.value.partitions.push({
    name: `p${index}`,
    value: '',
    comment: ''
  })
}

const handleRemovePartition = (index: number) => {
  form.value.partitions?.splice(index, 1)
}

const handleMovePartition = (index: number, direction: 'up' | 'down') => {
  if (!form.value.partitions) return
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= form.value.partitions.length) return
  const temp = form.value.partitions[index]
  form.value.partitions[index] = form.value.partitions[newIndex]
  form.value.partitions[newIndex] = temp
}

const handleOk = () => {
  formRef.value?.validate().then(() => {
    emit('save', form.value)
    emit('update:visible', false)
  })
}

const handleCancel = () => {
  emit('update:visible', false)
}
</script>

<style lang="scss" scoped>
.partition-list {
  .partition-actions {
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
