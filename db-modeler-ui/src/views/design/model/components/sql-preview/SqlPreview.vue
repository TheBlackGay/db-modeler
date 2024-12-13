# 创建新文件
<template>
  <div class="sql-preview">
    <div class="preview-header">
      <div class="left">
        <a-space>
          <a-select
            v-model:value="dbType"
            style="width: 120px"
            @change="handleDbTypeChange"
          >
            <a-select-option value="MYSQL">MySQL</a-select-option>
            <a-select-option value="ORACLE">Oracle</a-select-option>
            <a-select-option value="POSTGRESQL">PostgreSQL</a-select-option>
            <a-select-option value="SQLSERVER">SQL Server</a-select-option>
          </a-select>
          <a-select
            v-model:value="version"
            style="width: 120px"
            @change="handleVersionChange"
          >
            <a-select-option 
              v-for="ver in versionOptions" 
              :key="ver.value" 
              :value="ver.value"
            >
              {{ ver.label }}
            </a-select-option>
          </a-select>
        </a-space>
      </div>
      <div class="right">
        <a-space>
          <a-button @click="handleCopy">
            <template #icon><copy-outlined /></template>
            复制
          </a-button>
          <a-button @click="handleDownload">
            <template #icon><download-outlined /></template>
            下载
          </a-button>
          <a-button type="primary" @click="handleExecute">
            <template #icon><code-outlined /></template>
            执行
          </a-button>
        </a-space>
      </div>
    </div>

    <div class="preview-content">
      <a-spin :spinning="loading">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="create" tab="创建表">
            <pre class="sql-code">{{ createTableSql }}</pre>
          </a-tab-pane>
          <a-tab-pane key="alter" tab="修改表">
            <pre class="sql-code">{{ alterTableSql }}</pre>
          </a-tab-pane>
          <a-tab-pane key="drop" tab="删除表">
            <pre class="sql-code">{{ dropTableSql }}</pre>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </div>

    <!-- 执行确认对话框 -->
    <a-modal
      v-model:visible="executeVisible"
      title="执行 SQL"
      @ok="confirmExecute"
      okText="确认执行"
      cancelText="取消"
    >
      <p>确定要在数据库中执行这些 SQL 语句吗？</p>
      <p class="warning">注意：此操作可能会修改数据库结构，请谨慎操作！</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { 
  CopyOutlined,
  DownloadOutlined,
  CodeOutlined
} from '@ant-design/icons-vue'
import { saveAs } from 'file-saver'
import type { Table, Field, Index } from '../../types'

interface Props {
  table: Table
  originalTable?: Table
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'execute', sql: string): void
}>()

// 状态
const dbType = ref('MYSQL')
const version = ref('8.0')
const activeTab = ref('create')
const executeVisible = ref(false)

// 数据库版本选项
const versionOptions = computed(() => {
  switch (dbType.value) {
    case 'MYSQL':
      return [
        { label: '8.0', value: '8.0' },
        { label: '5.7', value: '5.7' },
        { label: '5.6', value: '5.6' }
      ]
    case 'ORACLE':
      return [
        { label: '19c', value: '19' },
        { label: '18c', value: '18' },
        { label: '12c', value: '12' }
      ]
    case 'POSTGRESQL':
      return [
        { label: '14', value: '14' },
        { label: '13', value: '13' },
        { label: '12', value: '12' }
      ]
    case 'SQLSERVER':
      return [
        { label: '2019', value: '2019' },
        { label: '2017', value: '2017' },
        { label: '2016', value: '2016' }
      ]
    default:
      return []
  }
})

// 生成建表 SQL
const createTableSql = computed(() => {
  return generateCreateTableSql(props.table)
})

// 生成修改表 SQL
const alterTableSql = computed(() => {
  if (!props.originalTable) return '-- 无修改内容'
  return generateAlterTableSql(props.table, props.originalTable)
})

// 生成删除表 SQL
const dropTableSql = computed(() => {
  return generateDropTableSql(props.table)
})

// 生成建表 SQL
function generateCreateTableSql(table: Table): string {
  const lines: string[] = []
  
  // 添加表头
  lines.push(`CREATE TABLE \`${table.name}\` (`)
  
  // 添加字段定义
  const fieldLines = table.fields.map(field => {
    const parts = [
      `  \`${field.name}\``,
      getFieldType(field),
      field.nullable ? 'NULL' : 'NOT NULL',
      field.autoIncrement ? 'AUTO_INCREMENT' : '',
      field.defaultValue ? `DEFAULT ${getDefaultValue(field)}` : '',
      field.comment ? `COMMENT '${field.comment}'` : ''
    ]
    return parts.filter(Boolean).join(' ')
  })
  
  // 添加主键
  const primaryKey = table.fields.find(f => f.primaryKey)
  if (primaryKey) {
    fieldLines.push(`  PRIMARY KEY (\`${primaryKey.name}\`)`)
  }
  
  // 添加索引
  if (table.indexes?.length) {
    table.indexes.forEach(index => {
      const indexType = index.type === 'UNIQUE' ? 'UNIQUE INDEX' : 'INDEX'
      const columns = index.fields.map(f => `\`${f.name}\` ${f.order}`).join(', ')
      fieldLines.push(`  ${indexType} \`${index.name}\` (${columns})`)
    })
  }
  
  lines.push(fieldLines.join(',\n'))
  lines.push(')')
  
  // 添加表选项
  const options: string[] = []
  if (table.engine) options.push(`ENGINE = ${table.engine}`)
  if (table.charset) options.push(`DEFAULT CHARSET = ${table.charset}`)
  if (table.collation) options.push(`COLLATE = ${table.collation}`)
  if (table.comment) options.push(`COMMENT = '${table.comment}'`)
  if (options.length) {
    lines.push(options.join(' '))
  }
  
  lines.push(';')
  return lines.join('\n')
}

// 生成修改表 SQL
function generateAlterTableSql(newTable: Table, oldTable: Table): string {
  const lines: string[] = []
  lines.push(`ALTER TABLE \`${newTable.name}\``)
  
  // 比较并生成修改语句
  const modifications: string[] = []
  
  // 检查删除的字段
  oldTable.fields.forEach(oldField => {
    if (!newTable.fields.find(f => f.name === oldField.name)) {
      modifications.push(`  DROP COLUMN \`${oldField.name}\``)
    }
  })
  
  // 检查新增和修改的字段
  newTable.fields.forEach(newField => {
    const oldField = oldTable.fields.find(f => f.name === newField.name)
    if (!oldField) {
      // 新增字段
      modifications.push(`  ADD COLUMN ${getFieldDefinition(newField)}`)
    } else if (isFieldModified(newField, oldField)) {
      // 修改字段
      modifications.push(`  MODIFY COLUMN ${getFieldDefinition(newField)}`)
    }
  })
  
  // 检查索引变化
  if (oldTable.indexes && newTable.indexes) {
    // 删除的索引
    oldTable.indexes.forEach(oldIndex => {
      if (!newTable.indexes?.find(i => i.name === oldIndex.name)) {
        modifications.push(`  DROP INDEX \`${oldIndex.name}\``)
      }
    })
    
    // 新增的索引
    newTable.indexes.forEach(newIndex => {
      if (!oldTable.indexes?.find(i => i.name === newIndex.name)) {
        const indexType = newIndex.type === 'UNIQUE' ? 'UNIQUE INDEX' : 'INDEX'
        const columns = newIndex.fields.map(f => `\`${f.name}\` ${f.order}`).join(', ')
        modifications.push(`  ADD ${indexType} \`${newIndex.name}\` (${columns})`)
      }
    })
  }
  
  // 表选项变化
  if (newTable.engine !== oldTable.engine) {
    modifications.push(`  ENGINE = ${newTable.engine}`)
  }
  if (newTable.charset !== oldTable.charset) {
    modifications.push(`  DEFAULT CHARSET = ${newTable.charset}`)
  }
  if (newTable.collation !== oldTable.collation) {
    modifications.push(`  COLLATE = ${newTable.collation}`)
  }
  if (newTable.comment !== oldTable.comment) {
    modifications.push(`  COMMENT = '${newTable.comment}'`)
  }
  
  if (modifications.length === 0) {
    return '-- 无修改内容'
  }
  
  lines.push(modifications.join(',\n'))
  lines.push(';')
  return lines.join('\n')
}

// 生成删除表 SQL
function generateDropTableSql(table: Table): string {
  return `DROP TABLE IF EXISTS \`${table.name}\`;`
}

// 获取字段类型定义
function getFieldType(field: Field): string {
  let type = field.dataType.toUpperCase()
  if (field.length) {
    if (field.precision) {
      type += `(${field.length},${field.precision})`
    } else {
      type += `(${field.length})`
    }
  }
  return type
}

// 获取默认值
function getDefaultValue(field: Field): string {
  if (field.defaultValue === null || field.defaultValue === undefined) return ''
  if (field.defaultValue === '') return "''"
  
  const numericTypes = ['INT', 'BIGINT', 'FLOAT', 'DOUBLE', 'DECIMAL']
  if (numericTypes.some(t => field.dataType.toUpperCase().includes(t))) {
    return field.defaultValue
  }
  return `'${field.defaultValue}'`
}

// 获取完整的字段定义
function getFieldDefinition(field: Field): string {
  const parts = [
    `\`${field.name}\``,
    getFieldType(field),
    field.nullable ? 'NULL' : 'NOT NULL',
    field.autoIncrement ? 'AUTO_INCREMENT' : '',
    field.defaultValue ? `DEFAULT ${getDefaultValue(field)}` : '',
    field.comment ? `COMMENT '${field.comment}'` : ''
  ]
  return parts.filter(Boolean).join(' ')
}

// 判断字段是否被修改
function isFieldModified(newField: Field, oldField: Field): boolean {
  return (
    newField.dataType !== oldField.dataType ||
    newField.length !== oldField.length ||
    newField.precision !== oldField.precision ||
    newField.nullable !== oldField.nullable ||
    newField.autoIncrement !== oldField.autoIncrement ||
    newField.defaultValue !== oldField.defaultValue ||
    newField.comment !== oldField.comment
  )
}

// 事件处理
const handleDbTypeChange = () => {
  // 切换数据库类型时，重置版本为第一个选项
  version.value = versionOptions.value[0]?.value || ''
}

const handleVersionChange = () => {
  // 版本变化时重新生成 SQL
}

const handleCopy = async () => {
  try {
    const sql = activeTab.value === 'create' 
      ? createTableSql.value 
      : activeTab.value === 'alter'
        ? alterTableSql.value
        : dropTableSql.value
        
    await navigator.clipboard.writeText(sql)
    message.success('已复制到剪贴板')
  } catch (error) {
    message.error('复制失败')
  }
}

const handleDownload = () => {
  const sql = activeTab.value === 'create' 
    ? createTableSql.value 
    : activeTab.value === 'alter'
      ? alterTableSql.value
      : dropTableSql.value
      
  const blob = new Blob([sql], { type: 'text/plain;charset=utf-8' })
  saveAs(blob, `${props.table.name}_${activeTab.value}.sql`)
}

const handleExecute = () => {
  executeVisible.value = true
}

const confirmExecute = () => {
  const sql = activeTab.value === 'create' 
    ? createTableSql.value 
    : activeTab.value === 'alter'
      ? alterTableSql.value
      : dropTableSql.value
      
  emit('execute', sql)
  executeVisible.value = false
}
</script>

<style lang="scss" scoped>
.sql-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .preview-header {
    padding: 16px;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .preview-content {
    flex: 1;
    padding: 16px;
    overflow: auto;
    
    .sql-code {
      margin: 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
      font-family: 'Courier New', Courier, monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  
  .warning {
    color: #ff4d4f;
    margin-top: 8px;
  }
}
</style> 