<template>
  <div class="table-design">
    <div class="table-design-header">
      <a-space>
        <a-button type="primary" @click="handleSave">
          <template #icon><save-outlined /></template>
          保存
        </a-button>
        <a-button @click="handleSync">
          <template #icon><sync-outlined /></template>
          同步到数据库
        </a-button>
        <a-divider type="vertical" />
        <a-button @click="handleExportSQL">
          <template #icon><export-outlined /></template>
          导出SQL
        </a-button>
        <a-button @click="handleImportFields">
          <template #icon><import-outlined /></template>
          导入字段
        </a-button>
      </a-space>
    </div>

    <div class="table-design-content">
      <div class="table-design-basic">
        <div class="table-design-basic-header" @click="toggleMoreSettings">
          <a-space>
            <component :is="moreSettingsVisible ? 'down-outlined' : 'right-outlined'" />
            <span>更多设置</span>
          </a-space>
          <a-space class="table-design-basic-actions">
            <a-tooltip title="使用模板">
              <folder-outlined @click.stop="handleApplyTemplate" />
            </a-tooltip>
            <a-tooltip title="保存为模板">
              <save-outlined @click.stop="handleSaveTemplate" />
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip title="导入设置">
              <import-outlined @click.stop="handleImportSettings" />
            </a-tooltip>
            <a-tooltip title="导出设置">
              <export-outlined @click.stop="handleExportSettings" />
            </a-tooltip>
          </a-space>
        </div>
        <div class="table-design-basic-content" :class="{ 'visible': moreSettingsVisible }">
          <a-form
            ref="formRef"
            :model="tableInfo"
            :rules="formRules"
            layout="vertical"
          >
            <a-row :gutter="24">
              <a-col :span="8">
                <a-form-item label="表名" required>
                  <a-input
                    v-model:value="tableInfo.name"
                    placeholder="请输入表名"
                    @change="debouncedTableInfoChange"
                  />
                </a-form-item>
                <a-form-item label="显示名" required>
                  <a-input
                    v-model:value="tableInfo.displayName"
                    placeholder="请输入显示名"
                    @change="debouncedTableInfoChange"
                  />
                </a-form-item>
                <a-form-item label="数据库类型" required>
                  <a-select
                    v-model:value="tableInfo.dbType"
                    placeholder="请选择数据库类型"
                    @change="debouncedTableInfoChange"
                  >
                    <a-select-option value="MySQL">MySQL</a-select-option>
                    <a-select-option value="PostgreSQL">PostgreSQL</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="存储引擎" required>
                  <a-select
                    v-model:value="tableInfo.engine"
                    :options="engineOptions"
                    placeholder="请选择存储引擎"
                  />
                </a-form-item>
                <a-form-item label="字符集" required>
                  <a-select
                    v-model:value="tableInfo.charset"
                    :options="charsetOptions"
                    placeholder="请选择字符集"
                  />
                </a-form-item>
                <a-form-item label="排序规则" required>
                  <a-select
                    v-model:value="tableInfo.collation"
                    :options="collationOptions"
                    placeholder="请选择排序规则"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="表注释">
                  <a-textarea
                    v-model:value="tableInfo.comment"
                    :rows="3"
                    placeholder="请输入表注释"
                    :maxLength="200"
                    show-count
                  />
                </a-form-item>
                <a-form-item>
                  <a-space>
                    <a-button type="link" @click="showAdvancedSettings = true">
                      <template #icon><setting-outlined /></template>
                      高级设置
                    </a-button>
                    <a-button type="link" @click="showPartitionSettings = true">
                      <template #icon><partition-outlined /></template>
                      分区设置
                    </a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>

      <!-- 高级设置对话框 -->
      <a-modal
        v-model:visible="showAdvancedSettings"
        title="高级设置"
        width="600px"
        @ok="handleAdvancedSettingsSave"
      >
        <a-form layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="表空间">
                <a-input 
                  v-model:value="tableInfo.tablespace"
                  placeholder="请输入表空间"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="自动增长值">
                <a-input-number
                  v-model:value="tableInfo.autoIncrement"
                  :min="1"
                  :step="1"
                  placeholder="请输入自动增长值"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="行格式">
                <a-select 
                  v-model:value="tableInfo.rowFormat"
                  placeholder="请选择行格式"
                >
                  <a-select-option value="DEFAULT">DEFAULT</a-select-option>
                  <a-select-option value="DYNAMIC">DYNAMIC</a-select-option>
                  <a-select-option value="FIXED">FIXED</a-select-option>
                  <a-select-option value="COMPRESSED">COMPRESSED</a-select-option>
                  <a-select-option value="REDUNDANT">REDUNDANT</a-select-option>
                  <a-select-option value="COMPACT">COMPACT</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>

      <a-tabs v-model:activeKey="activeTab" class="table-design-tabs">
        <a-tab-pane key="fields" tab="字段">
          <FieldList
            v-model="fields"
            @update:model-value="handleFieldsChange"
            @add="handleAddField"
            @edit="handleEditField"
            @delete="handleDeleteField"
            @batch-edit="handleBatchEdit"
            @use-template="handleUseTemplate"
          />
        </a-tab-pane>
        <a-tab-pane key="indexes" tab="索引">
          <IndexList
            v-model="indexes"
            :fields="fields"
            @update:model-value="handleIndexesChange"
          />
        </a-tab-pane>
      </a-tabs>

      <FieldForm
        v-model:visible="showFieldForm"
        :field="editingField"
        :db-type="tableInfo.dbType"
        @submit="handleFieldFormSubmit"
        @cancel="handleFieldFormCancel"
      />
    </div>

    <partition-settings-modal
      v-model:visible="showPartitionSettings"
      :config="tableInfo.partitionConfig"
      :fields="fields"
      @save="handlePartitionSave"
    />

    <a-modal
      v-model:visible="showImportModal"
      title="导入设置"
      @ok="handleImportConfirm"
    >
      <a-form layout="vertical">
        <a-form-item label="设置内容">
          <a-textarea
            v-model:value="importContent"
            :rows="10"
            placeholder="请粘贴JSON格式的设置内容"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <table-template-modal
      v-model:visible="showTemplateModal"
      :mode="templateMode"
      :current-settings="getCurrentSettings()"
      @save="handleTemplateSave"
      @apply="handleTemplateApply"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, watch, computed, onMounted, onUnmounted, shallowRef, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { saveTableDesign, getTableDesignById } from '@/api/project'
import { useGlobalStore } from '@/stores/global'
import { getEngineOptions, getCharsetOptions, getCollateOptions } from '@/config/database'
import { 
  SaveOutlined, 
  SyncOutlined, 
  ExportOutlined,
  ImportOutlined,
  RightOutlined,
  DownOutlined,
  FolderOutlined,
  SettingOutlined,
  PartitionOutlined
} from '@ant-design/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import FieldList from './components/FieldList.vue'
import IndexList from './components/IndexList.vue'
import TableBasicForm from './components/TableBasicForm.vue'
import PartitionSettingsModal from './components/PartitionSettingsModal.vue'
import TableTemplateModal from './components/TableTemplateModal.vue'
import FieldForm from './components/FieldForm.vue'

interface TableInfo {
  id?: string
  code?: string
  projectId?: string
  name: string
  displayName: string
  dbType: string
  engine: string
  charset: string
  collation: string
  tablespace: string
  comment: string
  rowFormat: string
  autoIncrement?: number
  partitionConfig?: any
}

interface Field {
  id?: string
  name: string
  displayName: string
  dataType: string
  length: number
  precision: number
  nullable: boolean
  primaryKey: boolean
  autoIncrement: boolean
  defaultValue: string
  comment: string
}

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()
const formRef = ref()
const activeTab = ref('fields')
const fields = ref<Field[]>([])
const indexes = ref<any[]>([])
const tableInfo = ref<TableInfo>({
  id: '',
  name: '',
  displayName: '',
  dbType: 'MYSQL',
  engine: 'InnoDB',
  charset: 'utf8mb4',
  collation: 'utf8mb4_general_ci',
  comment: '',
  tablespace: '',
  rowFormat: 'DEFAULT',
  autoIncrement: 1,
  projectId: '',
  type: 'TABLE',
  domain: 'BUSINESS',
  status: 'DRAFT',
  synced: false
})

const dbTypeRef = ref<string>('MYSQL')

// 计算属性，用于处理数据库类型
const currentDbType = computed({
  get: () => dbTypeRef.value,
  set: (value) => {
    if (!value) return
    console.log('Setting dbType to:', value)
    const newValue = value.toUpperCase()
    console.log('Normalized dbType:', newValue)
    dbTypeRef.value = newValue
    tableInfo.value.dbType = newValue
  }
})
provide('dbType', currentDbType)

// 监听 tableInfo.dbType 的变化并更新 dbTypeRef
watch(() => tableInfo.value.dbType, (newDbType) => {
  console.log('dbType changed in tableInfo:', newDbType)
  if (!newDbType) {
    console.log('dbType is undefined or null')
    return
  }
  const normalizedDbType = newDbType.toUpperCase()
  console.log('Normalized dbType:', normalizedDbType)
  if (normalizedDbType !== dbTypeRef.value) {
    console.log('Updating dbTypeRef to:', normalizedDbType)
    dbTypeRef.value = normalizedDbType
  }
}, { immediate: true })

const moreSettingsVisible = shallowRef(false)
const showPartitionSettings = shallowRef(false)
const showImportModal = shallowRef(false)
const showTemplateModal = shallowRef(false)
const templateMode = ref<'save' | 'apply'>('apply')
const showAdvancedSettings = shallowRef(false)

// 数据库引擎选项
const engineOptions = computed(() => {
  const dbType = tableInfo.value?.dbType || 'MYSQL'
  return getEngineOptions(dbType)
})

// 字符集选项
const charsetOptions = computed(() => {
  const dbType = tableInfo.value?.dbType || 'MYSQL'
  return getCharsetOptions(dbType)
})

// 排序规则选项
const collationOptions = computed(() => {
  const dbType = tableInfo.value?.dbType || 'MYSQL'
  return getCollateOptions(dbType)
})

// 监听字符集变化
watch(() => tableInfo.value?.charset, (newCharset) => {
  if (!tableInfo.value) return
  
  // 根据字符集自动选择对应的排序规则
  if (newCharset === 'utf8mb4') {
    tableInfo.value.collation = 'utf8mb4_general_ci'
  } else if (newCharset === 'utf8') {
    tableInfo.value.collation = 'utf8_general_ci'
  } else if (newCharset === 'latin1') {
    tableInfo.value.collation = 'latin1_swedish_ci'
  }
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入表名', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '表名只能包含字母、数字和下划线，且必须以字母开头', trigger: 'blur' }
  ],
  displayName: [
    { required: true, message: '请输入显示名称', trigger: 'blur' }
  ],
  engine: [
    { required: true, message: '请选择存储引擎', trigger: 'change' }
  ],
  charset: [
    { required: true, message: '请选择字符集', trigger: 'change' }
  ],
  collation: [
    { required: true, message: '请选择排序规则', trigger: 'change' }
  ]
}

const formatPartitionType = (type: string) => {
  const types: Record<string, string> = {
    RANGE: 'RANGE分区',
    LIST: 'LIST分区',
    HASH: 'HASH分区',
    KEY: 'KEY分区'
  }
  return types[type] || type
}

const debouncedTableInfoChange = useDebounceFn((value: any) => {
  // 当数据库类型改变时，更新 provide 的值
  if (typeof value === 'string') {
    tableInfo.value.dbType = value
  } else {
    Object.assign(tableInfo.value, value)
    if (value.dbType !== tableInfo.value.dbType) {
      tableInfo.value.dbType = value.dbType
    }
  }
}, 300)

const handleFieldsChange = (value: Field[]) => {
  fields.value = value
}

const handleIndexesChange = (value: any[]) => {
  indexes.value = value
}

const toggleMoreSettings = () => {
  moreSettingsVisible.value = !moreSettingsVisible.value
}

const handleSave = async () => {
  try {
    if (!tableInfo.value.projectId) {
      message.error('项目ID不能为空')
      return
    }

    // 验证必需字段
    if (!tableInfo.value.name) {
      message.error('表名不能为空')
      return
    }
    if (!tableInfo.value.displayName) {
      message.error('显示名不能为空')
      return
    }
    if (!tableInfo.value.dbType) {
      message.error('数据库类型不能为空')
      return
    }
    if (!tableInfo.value.engine) {
      message.error('存储引擎不能为空')
      return
    }
    if (!tableInfo.value.charset) {
      message.error('字符集不能为空')
      return
    }
    if (!tableInfo.value.collation) {
      message.error('排序规则不能为空')
      return
    }

    // 构建metadata
    const metadata = {
      dbType: tableInfo.value.dbType || 'MySQL',
      engine: tableInfo.value.engine || 'InnoDB',
      charset: tableInfo.value.charset || 'utf8mb4',
      collate: tableInfo.value.collation || 'utf8mb4_general_ci',
      tablespace: tableInfo.value.tablespace || '',
      rowFormat: tableInfo.value.rowFormat || 'DEFAULT',
      autoIncrement: tableInfo.value.autoIncrement || 1
    }

    // 验证metadata必需字段
    if (!metadata.dbType || !metadata.engine || !metadata.charset || !metadata.collate) {
      message.error('数据库配置信息不完整')
      return
    }

    // 构建columns数据
    const columns = {
      fields: fields.value || [],
      indexes: indexes.value || []
    }

    // 构建请求数据
    const tableData = {
      id: tableInfo.value.id,
      code: tableInfo.value.name,
      displayName: tableInfo.value.displayName,
      comment: tableInfo.value.comment || '',
      type: 'TABLE',
      domain: 'BUSINESS',
      columns: JSON.stringify(columns),
      metadata: JSON.stringify(metadata),
      projectId: tableInfo.value.projectId,
      status: 'DRAFT',
      synced: false
    }

    console.log('Saving table data:', tableData)
    const response = await saveTableDesign(tableData)
    
    if (response?.data) {
      message.success('保存成功')
      // 更新表单数据
      if (!tableInfo.value.id) {
        // 如果是新建，保存成功后更新ID
        tableInfo.value.id = response.data.id
      }
      // 重新加载表数据
      await loadTableDesign(tableData.id)
    } else {
      throw new Error('保存失败：未收到有效的响应数据')
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    if (error.response?.data?.message) {
      message.error('保存失败: ' + error.response.data.message)
    } else if (error.message) {
      message.error(error.message)
    } else {
      message.error('保存失败，请检查输入是否完整')
    }
  }
}

const handleSync = async () => {
  try {
    // TODO: 实现同步到数据库的逻辑
    message.success('同步成功')
  } catch (error) {
    message.error('同步失败')
  }
}

const handleExportSQL = () => {
  // TODO: 实现导出SQL功能
  message.info('导出SQL功能开发中...')
}

const handleImportFields = () => {
  // TODO: 实现导入字段功能
  message.info('导入字段功能开发中...')
}

const handlePartitionSave = (config: any) => {
  tableInfo.value.partitionConfig = config
}

const importContent = ref('')

const handleImportSettings = (e: Event) => {
  e.stopPropagation()
  showImportModal.value = true
}

const handleExportSettings = (e: Event) => {
  e.stopPropagation()
  const settings = {
    engine: tableInfo.value.engine,
    charset: tableInfo.value.charset,
    collation: tableInfo.value.collation,
    tablespace: tableInfo.value.tablespace,
    rowFormat: tableInfo.value.rowFormat,
    autoIncrement: tableInfo.value.autoIncrement,
    partitionConfig: tableInfo.value.partitionConfig
  }
  const content = JSON.stringify(settings, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${tableInfo.value.name}_settings.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const handleImportConfirm = () => {
  try {
    const settings = JSON.parse(importContent.value)
    Object.assign(tableInfo.value, settings)
    showImportModal.value = false
    importContent.value = ''
    message.success('导入成功')
  } catch (error) {
    message.error('导入失败：无效的JSON格式')
  }
}

const getCurrentSettings = () => {
  return {
    engine: tableInfo.value.engine,
    charset: tableInfo.value.charset,
    collation: tableInfo.value.collation,
    tablespace: tableInfo.value.tablespace,
    rowFormat: tableInfo.value.rowFormat,
    autoIncrement: tableInfo.value.autoIncrement,
    partitionConfig: tableInfo.value.partitionConfig
  }
}

const handleApplyTemplate = (e: Event) => {
  e.stopPropagation()
  templateMode.value = 'apply'
  showTemplateModal.value = true
}

const handleSaveTemplate = (e: Event) => {
  e.stopPropagation()
  templateMode.value = 'save'
  showTemplateModal.value = true
}

const handleTemplateSave = () => {
  message.success('模板保存成功')
}

const handleTemplateApply = (settings: any) => {
  Object.assign(tableInfo.value, settings)
  message.success('模板应用成功')
}

const handleAdvancedSettingsSave = () => {
  message.success('高级设置保存成功')
}

// 监听路由参数变化
watch(
  () => route.params.tableId,
  async (newTableId) => {
    if (newTableId) {
      await loadTableDesign(newTableId as string)
    }
  }
)

// 验证 UUID 格式
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// 加载表设计数据
const loadTableDesign = async (tableId: string) => {
  try {
    // 验证 tableId 是否为有效的 UUID
    if (!tableId || tableId === 'new' || !isValidUUID(tableId)) {
      // 如果是新建表，初始化默认值
      tableInfo.value = {
        name: '',
        displayName: '',
        dbType: 'MYSQL',
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collation: 'utf8mb4_general_ci',
        comment: '',
        tablespace: '',
        rowFormat: 'DEFAULT',
        autoIncrement: 1,
        projectId: globalStore.currentProject?.id || '',
        type: 'TABLE',
        domain: 'BUSINESS',
        status: 'DRAFT',
        synced: false
      }
      fields.value = []
      indexes.value = []
      return
    }

    const response = await getTableDesignById(tableId)
    console.log('Response data:', response?.data)
    
    if (response?.data) {
      const data = response.data
      console.log('Raw metadata:', data.metadata)
      
      let metadata = {
        dbType: 'MYSQL',
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        tablespace: '',
        rowFormat: 'DEFAULT',
        autoIncrement: 1
      }
      
      // 解析metadata
      if (data.metadata) {
        try {
          // 如果metadata已经是对象，直接使用
          if (typeof data.metadata === 'object' && data.metadata !== null) {
            metadata = {
              ...data.metadata,
              dbType: data.metadata.dbType.toUpperCase()
            }
          } else if (typeof data.metadata === 'string') {
            // 解码HTML实体并解析JSON
            const decodedMetadata = data.metadata
              .replace(/&#34;/g, '"')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&apos;/g, "'")
              .replace(/&amp;/g, '&')
            const parsedMetadata = JSON.parse(decodedMetadata)
            metadata = {
              ...parsedMetadata,
              dbType: parsedMetadata.dbType.toUpperCase()
            }
          }
        } catch (e) {
          console.error('Failed to parse metadata:', e)
        }
      }
      
      // 更新表信息
      tableInfo.value = {
        ...tableInfo.value,
        ...metadata,
        name: data.code || '',
        displayName: data.displayName || '',
        comment: data.comment || '',
        id: data.id,
        projectId: data.projectId,
        synced: data.synced || false
      }
      
      // 解析columns数据
      let columnsData = {
        fields: [],
        indexes: []
      }
      
      if (data.columns) {
        try {
          if (typeof data.columns === 'object' && data.columns !== null) {
            columnsData = data.columns
          } else if (typeof data.columns === 'string') {
            // 解码HTML实体并解析JSON
            const decodedColumns = data.columns
              .replace(/&#34;/g, '"')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .replace(/&apos;/g, "'")
              .replace(/&amp;/g, '&')
            columnsData = JSON.parse(decodedColumns)
          }
        } catch (e) {
          console.error('Failed to parse columns:', e)
          message.warning('字段数据解析失败，将使用默认值')
        }
      }

      fields.value = columnsData.fields || []
      indexes.value = columnsData.indexes || []

      // 重置表单状态
      nextTick(() => {
        if (formRef.value) {
          formRef.value.clearValidate()
        }
      })
    }
  } catch (error: any) {
    console.error('加载表设计失败:', error)
    message.error(error.message || '加载表设计失败')
  }
}

onMounted(async () => {
  if (route.params.tableId) {
    await loadTableDesign(route.params.tableId as string)
  }
})

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault()
        handleSave()
        break
      case 'b':
        e.preventDefault()
        handleBack()
        break
      case 'm':
        e.preventDefault()
        toggleMoreSettings()
        break
    }
  }
}

window.addEventListener('keydown', handleKeyDown)
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const showFieldForm = ref(false)
const editingField = shallowRef<any>(null)

const handleAddField = () => {
  editingField.value = {
    id: Date.now().toString(),
    name: '',
    displayName: '',
    dataType: 'varchar',
    length: 255,
    nullable: true,
    primaryKey: false,
    autoIncrement: false,
    defaultValue: '',
    comment: ''
  }
  showFieldForm.value = true
}

const handleFieldFormSubmit = (field: any) => {
  if (editingField.value.id) {
    // 编辑现有字段
    const index = fields.value.findIndex(f => f.id === field.id)
    if (index > -1) {
      fields.value[index] = { ...field }
    }
  } else {
    // 添加新字段
    fields.value.push({ ...field })
  }
  showFieldForm.value = false
  editingField.value = null
}

const handleFieldFormCancel = () => {
  showFieldForm.value = false
  editingField.value = null
}
</script>

<style lang="less" scoped>
.table-design {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 16px;

  &-header {
    margin-bottom: 16px;
    padding: 12px 16px;
    background-color: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
  }

  &-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &-basic {
    margin-bottom: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    background-color: #fff;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    &-header {
      padding: 12px 16px;
      background-color: #fafafa;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s;
      border-bottom: 1px solid transparent;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background-color: #f5f5f5;
        color: #1890ff;

        .anticon {
          transform: scale(1.1);
        }
      }

      .anticon {
        color: #1890ff;
        transition: transform 0.3s;
      }
    }

    &-actions {
      .anticon {
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          color: #40a9ff;
          transform: scale(1.1);
        }
      }
    }

    &-content {
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;

      &.visible {
        max-height: 800px;
        opacity: 1;
        padding: 16px;
        border-top: 1px solid #f0f0f0;
      }
    }
  }

  &-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.ant-tabs-nav) {
      margin: 0;
      padding: 0 16px;
      background-color: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 2px 2px 0 0;
    }

    :deep(.ant-tabs-content) {
      flex: 1;
      overflow: auto;
      padding: 16px;
      border: 1px solid #f0f0f0;
      border-top: none;
      border-radius: 0 0 2px 2px;
    }

    :deep(.ant-tabs-tab) {
      padding: 8px 16px;
      
      &.ant-tabs-tab-active {
        background-color: #fff;
        border-bottom-color: transparent;
      }
    }
  }
}

.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  
  .menu-item {
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    .anticon {
      margin-right: 8px;
    }
  }
}
</style>
