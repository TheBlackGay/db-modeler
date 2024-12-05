<template>
  <div class="reverse-engineering-container">
    <el-card class="reverse-engineering-card">
      <template #header>
        <div class="card-header">
          <span>数据库反向工程</span>
        </div>
      </template>

      <el-form 
        ref="reverseEngineeringFormRef"
        :model="reverseEngineeringForm" 
        label-width="120px"
      >
        <el-form-item label="数据库连接" prop="connectionId">
          <el-select 
            v-model="reverseEngineeringForm.connectionId" 
            placeholder="选择数据库连接"
            @change="loadProjectConnections"
          >
            <el-option 
              v-for="connection in databaseConnections" 
              :key="connection.id" 
              :value="connection.id"
            >
              {{ connection.name }} ({{ connection.type }})
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="目标项目" prop="projectId">
          <el-select 
            v-model="reverseEngineeringForm.projectId" 
            placeholder="选择目标项目"
          >
            <el-option 
              v-for="project in projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ project.name }}
            </el-option>
          </el-select>
        </el-form-item>

        <div class="reverse-engineering-actions">
          <el-button 
            type="primary" 
            @click="extractDatabaseSchema"
            :loading="extracting"
          >
            提取数据库表结构
          </el-button>
        </div>
      </el-form>

      <el-divider />

      <el-table 
        :data="extractedTables" 
        style="width: 100%" 
        border
        v-if="extractedTables.length"
      >
        <el-table-column label="表名" prop="name" width="200" />
        <el-table-column label="类型" prop="type" width="100" />
        <el-table-column label="列数" width="100">
          <template #default="{ row }">
            {{ row.columns.length }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small"
                @click="viewTableDetails(row)"
              >
                查看详情
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-card v-if="selectedTable" class="table-details-card">
        <template #header>
          <div class="card-header">
            <span>{{ selectedTable.name }} 表结构详情</span>
            <el-button 
              type="success" 
              @click="synchronizeTableSchema(selectedTable)"
            >
              同步到目标数据库
            </el-button>
          </div>
        </template>

        <el-table 
          :data="selectedTable.columns" 
          style="width: 100%" 
          border
        >
          <el-table-column label="列名" prop="name" width="200" />
          <el-table-column label="数据类型" prop="type" width="150" />
          <el-table-column label="是否主键" width="100">
            <template #default="{ row }">
              <el-tag :type="row.primaryKey ? 'success' : 'info'">
                {{ row.primaryKey ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否非空" width="100">
            <template #default="{ row }">
              <el-tag :type="row.notNull ? 'warning' : 'info'">
                {{ row.notNull ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="默认值" prop="defaultValue" width="150" />
        </el-table>
      </el-card>
    </el-card>

    <el-dialog 
      v-model="schemaCompareDialogVisible" 
      title="表结构比较" 
      width="80%"
    >
      <el-table 
        :data="schemaComparisons" 
        style="width: 100%" 
        border
      >
        <el-table-column label="表名" prop="tableName" width="200" />
        <el-table-column label="差异详情" width="500">
          <template #default="{ row }">
            <el-tag 
              v-for="(diff, index) in row.differences" 
              :key="index"
              :type="getDiffType(diff.type)"
              class="diff-tag"
            >
              {{ diff.description }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small"
                @click="generateSyncScript(row)"
              >
                生成同步脚本
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  extractDatabaseSchema, 
  synchronizeTableSchema,
  compareTableSchemas,
  generateSchemaSyncScript
} from '@/api/reverseEngineering'
import { listDatabaseConnections } from '@/api/databaseConnection'
import { listProjects } from '@/api/project'

const reverseEngineeringFormRef = ref(null)
const extracting = ref(false)
const databaseConnections = ref([])
const projects = ref([])

const reverseEngineeringForm = reactive({
  connectionId: null,
  projectId: null
})

const extractedTables = ref([])
const selectedTable = ref(null)

const schemaCompareDialogVisible = ref(false)
const schemaComparisons = ref([])

const loadProjectConnections = async () => {
  try {
    const connectionsResponse = await listDatabaseConnections()
    databaseConnections.value = connectionsResponse.connections

    const projectsResponse = await listProjects()
    projects.value = projectsResponse.projects
  } catch (error) {
    ElMessage.error('加载数据库连接和项目失败')
  }
}

const extractDatabaseSchema = async () => {
  try {
    extracting.value = true
    const response = await extractDatabaseSchema(
      reverseEngineeringForm.connectionId, 
      { projectId: reverseEngineeringForm.projectId }
    )
    extractedTables.value = response.tableDesigns
    ElMessage.success('数据库表结构提取成功')
  } catch (error) {
    ElMessage.error('提取数据库表结构失败')
  } finally {
    extracting.value = false
  }
}

const viewTableDetails = (table) => {
  selectedTable.value = table
}

const synchronizeTableSchema = async (table) => {
  try {
    const { value } = await ElMessageBox.prompt('请选择目标数据库类型', '同步表结构', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^(mysql|postgresql|sqlite|sqlserver|oracle)$/,
      inputErrorMessage: '请输入有效的数据库类型'
    })

    const response = await synchronizeTableSchema(
      reverseEngineeringForm.connectionId, 
      { 
        tableDesignIds: [table.id],
        targetDatabaseType: value
      }
    )

    if (response.syncResults[0].success) {
      ElMessage.success(`表 ${table.name} 同步成功`)
    } else {
      ElMessage.error(`表 ${table.name} 同步失败：${response.syncResults[0].message}`)
    }
  } catch (error) {
    ElMessage.error('表结构同步失败')
  }
}

const compareSchemas = async () => {
  try {
    const response = await compareTableSchemas(
      reverseEngineeringForm.connectionId, 
      { tableDesignIds: extractedTables.value.map(table => table.id) }
    )
    schemaComparisons.value = response.comparisons
    schemaCompareDialogVisible.value = true
  } catch (error) {
    ElMessage.error('表结构比较失败')
  }
}

const generateSyncScript = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请选择目标数据库类型', '生成同步脚本', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^(mysql|postgresql|sqlite|sqlserver|oracle)$/,
      inputErrorMessage: '请输入有效的数据库类型'
    })

    const response = await generateSchemaSyncScript(
      reverseEngineeringForm.connectionId, 
      { 
        tableDesignIds: [row.tableId],
        targetDatabaseType: value
      }
    )

    const syncScript = response.syncScripts[0]
    await ElMessageBox.alert(
      `<pre>${syncScript.createTableSQL}\n\n${syncScript.alterTableSQL}</pre>`, 
      `${row.tableName} 同步脚本`, 
      { 
        dangerouslyUseHTMLString: true,
        confirmButtonText: '复制脚本'
      }
    )

    navigator.clipboard.writeText(
      `-- 创建表脚本\n${syncScript.createTableSQL}\n\n-- 修改表脚本\n${syncScript.alterTableSQL}`
    )
  } catch (error) {
    ElMessage.error('生成同步脚本失败')
  }
}

const getDiffType = (type) => {
  switch (type) {
    case 'ADD': return 'success'
    case 'MODIFY': return 'warning'
    case 'DELETE': return 'danger'
    default: return 'info'
  }
}

onMounted(loadProjectConnections)
</script>

<style scoped>
.reverse-engineering-container {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reverse-engineering-actions {
  text-align: center;
  margin-top: 20px;
}

.table-details-card {
  margin-top: 20px;
}

.diff-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

pre {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
