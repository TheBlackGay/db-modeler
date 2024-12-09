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
        <a-divider type="vertical" />
        <a-button @click="handleBack">
          <template #icon><arrow-left-outlined /></template>
          返回
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
import { ref, provide, watch, computed, onMounted, onUnmounted, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { saveTableDesign } from '@/api/project'
import { getTableDesignById as fetchTableDesign } from '@/api/project'
import { 
  SaveOutlined, 
  SyncOutlined, 
  ArrowLeftOutlined,
  ExportOutlined,
  ImportOutlined,
  RightOutlined,
  DownOutlined,
  FolderOutlined,
  SettingOutlined,
  PartitionOutlined
} from '@ant-design/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import TableBasicInfo from './components/TableBasicInfo.vue'
import FieldList from './components/FieldList.vue'
import IndexList from './components/IndexList.vue'
import PartitionSettingsModal from './components/PartitionSettingsModal.vue'
import TableTemplateModal from './components/TableTemplateModal.vue'
import { useGlobalStore } from '@/stores/global'

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

const tableInfo = ref<TableInfo>({
  name: '',
  displayName: '',
  dbType: 'MySQL',
  engine: 'InnoDB',
  charset: 'utf8mb4',
  collation: 'utf8mb4_general_ci',
  tablespace: '',
  comment: '',
  rowFormat: 'DEFAULT',
  projectId: route.params.id as string // 从路由参数中获取项目 ID
})

const fields = ref<Field[]>([])
const indexes = ref<any[]>([])
const activeTab = ref('fields')

const currentDbType = ref('MySQL')
provide('dbType', currentDbType)

const moreSettingsVisible = shallowRef(false)
const showPartitionSettings = shallowRef(false)
const showImportModal = shallowRef(false)
const showTemplateModal = shallowRef(false)
const templateMode = ref<'save' | 'apply'>('apply')
const showAdvancedSettings = shallowRef(false)

// 数据库引擎选项
const engineOptions = [
  { label: 'InnoDB', value: 'InnoDB' },
  { label: 'MyISAM', value: 'MyISAM' },
  { label: 'MEMORY', value: 'MEMORY' },
  { label: 'CSV', value: 'CSV' },
  { label: 'ARCHIVE', value: 'ARCHIVE' }
]

// 字符集选项
const charsetOptions = [
  { label: 'utf8mb4', value: 'utf8mb4' },
  { label: 'utf8', value: 'utf8' },
  { label: 'latin1', value: 'latin1' },
  { label: 'gbk', value: 'gbk' },
  { label: 'gb2312', value: 'gb2312' }
]

// 排序规则选项
const collationOptions = computed(() => {
  const collations: Record<string, string[]> = {
    utf8mb4: ['utf8mb4_general_ci', 'utf8mb4_unicode_ci', 'utf8mb4_bin'],
    utf8: ['utf8_general_ci', 'utf8_unicode_ci', 'utf8_bin'],
    latin1: ['latin1_swedish_ci', 'latin1_general_ci', 'latin1_bin'],
    gbk: ['gbk_chinese_ci', 'gbk_bin'],
    gb2312: ['gb2312_chinese_ci', 'gb2312_bin']
  }
  
  return (collations[tableInfo.value.charset] || []).map(value => ({
    label: value,
    value
  }))
})

// 监听字符集变化，自动选择默认排序规则
watch(() => tableInfo.value.charset, (charset) => {
  const defaultCollations: Record<string, string> = {
    utf8mb4: 'utf8mb4_general_ci',
    utf8: 'utf8_general_ci',
    latin1: 'latin1_swedish_ci',
    gbk: 'gbk_chinese_ci',
    gb2312: 'gb2312_chinese_ci'
  }
  tableInfo.value.collation = defaultCollations[charset] || ''
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
    currentDbType.value = value
  } else {
    Object.assign(tableInfo.value, value)
    if (value.dbType !== currentDbType.value) {
      currentDbType.value = value.dbType
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

    const tableData = {
      ...tableInfo.value,
      code: tableInfo.value.name, // 使用 name 作为 code
      projectId: tableInfo.value.projectId
    }
    console.log('Saving table data:', tableData) // 添加日志
    const result = await saveTableDesign(tableData)
    message.success('保存成功')
    if (!tableInfo.value.id) {
      // 如果是新建，保存成功后更新 ID
      tableInfo.value.id = result.id
      tableInfo.value.code = result.code
    }
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败: ' + (error.response?.data?.message || error.message))
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

const handleBack = () => {
  router.back()
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

onMounted(async () => {
  // 初始化表信息
  const tableId = route.params.tableId as string
  const projectId = route.params.id as string
  console.log('TableDesign mounted, params:', {
    tableId,
    projectId,
    allParams: route.params
  })

  if (tableId === 'new') {
    console.log('Creating new table')
    // 如果是新建表，初始化默认值
    tableInfo.value = {
      name: '',
      displayName: '',
      dbType: 'MySQL',
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collation: 'utf8mb4_general_ci',
      tablespace: '',
      comment: '',
      rowFormat: 'DEFAULT',
      projectId
    }
    fields.value = []
    indexes.value = []
  } else {
    console.log('Fetching table design for id:', tableId)
    try {
      // 首先尝试从 store 中获取表数据
      const storedTable = globalStore.projectTables.find(table => table.id === tableId)
      console.log('Found table in store:', storedTable)

      if (!storedTable) {
        // 如果 store 中没有数据，从后端获取
        console.log('Table not found in store, fetching from backend')
        const response = await fetchTableDesign(tableId)
        console.log('Received table design response:', response)
        
        if (!response?.data) {
          console.error('No data received from server')
          message.error('未获取到表数据')
          return
        }
        
        const data = response.data
        console.log('Processing table data:', data)
        
        // 初始化表信息
        tableInfo.value = {
          id: data.id,
          name: data.code || '',
          displayName: data.displayName || '',
          dbType: 'MySQL',
          engine: 'InnoDB',
          charset: 'utf8mb4',
          collation: 'utf8mb4_general_ci',
          tablespace: '',
          comment: data.comment || '',
          rowFormat: 'DEFAULT',
          projectId
        }

        // 如果有 metadata，解析并应用
        if (data.metadata) {
          console.log('Processing metadata:', data.metadata)
          try {
            const metadata = JSON.parse(data.metadata)
            if (metadata.dbType) tableInfo.value.dbType = metadata.dbType
            if (metadata.engine) tableInfo.value.engine = metadata.engine
            if (metadata.charset) tableInfo.value.charset = metadata.charset
            if (metadata.collation) tableInfo.value.collation = metadata.collation
            if (metadata.tablespace) tableInfo.value.tablespace = metadata.tablespace
            if (metadata.rowFormat) tableInfo.value.rowFormat = metadata.rowFormat
          } catch (e) {
            console.warn('Failed to parse metadata:', e)
          }
        }

        // 解析 columns 字段
        console.log('Processing columns:', data.columns)
        if (data.columns) {
          try {
            const columnsData = JSON.parse(data.columns)
            console.log('Parsed columns data:', columnsData)
            fields.value = columnsData.fields || []
            indexes.value = columnsData.indexes || []
          } catch (e) {
            console.error('Failed to parse columns:', e)
            fields.value = []
            indexes.value = []
          }
        } else {
          console.log('No columns data found')
          fields.value = []
          indexes.value = []
        }
      } else {
        // 使用 store 中的数据
        console.log('Using table data from store')
        tableInfo.value = {
          id: storedTable.id,
          name: storedTable.code || '',
          displayName: storedTable.displayName || '',
          dbType: 'MySQL',
          engine: 'InnoDB',
          charset: 'utf8mb4',
          collation: 'utf8mb4_general_ci',
          tablespace: '',
          comment: storedTable.comment || '',
          rowFormat: 'DEFAULT',
          projectId
        }

        // 如果有 metadata，解析并应用
        if (storedTable.metadata) {
          try {
            const metadata = typeof storedTable.metadata === 'string' 
              ? JSON.parse(storedTable.metadata)
              : storedTable.metadata
            if (metadata.dbType) tableInfo.value.dbType = metadata.dbType
            if (metadata.engine) tableInfo.value.engine = metadata.engine
            if (metadata.charset) tableInfo.value.charset = metadata.charset
            if (metadata.collation) tableInfo.value.collation = metadata.collation
            if (metadata.tablespace) tableInfo.value.tablespace = metadata.tablespace
            if (metadata.rowFormat) tableInfo.value.rowFormat = metadata.rowFormat
          } catch (e) {
            console.warn('Failed to parse metadata:', e)
          }
        }

        // 解析 columns 字段
        if (storedTable.columns) {
          try {
            const columnsData = typeof storedTable.columns === 'string'
              ? JSON.parse(storedTable.columns)
              : storedTable.columns
            fields.value = columnsData.fields || []
            indexes.value = columnsData.indexes || []
          } catch (e) {
            console.error('Failed to parse columns:', e)
            fields.value = []
            indexes.value = []
          }
        } else {
          fields.value = []
          indexes.value = []
        }
      }
    } catch (error) {
      console.error('Error processing table design:', error)
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        })
      }
      if (error.response?.status === 404) {
        message.error('表不存在')
      } else {
        message.error('获取表信息失败：' + (error.response?.data?.message || error.message || '未知错误'))
      }
    }
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
</script>

<style lang="scss" scoped>
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
