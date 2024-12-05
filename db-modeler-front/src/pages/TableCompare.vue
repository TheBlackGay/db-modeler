<template>
  <div class="table-compare">
    <el-card class="comparison-config">
      <template #header>
        <div class="card-header">
          <span>数据库表结构比较</span>
        </div>
      </template>

      <el-form :inline="true" :model="compareForm" class="demo-form-inline">
        <el-form-item label="源数据库">
          <el-select 
            v-model="compareForm.sourceId" 
            placeholder="选择源数据库"
            @change="fetchSourceTables"
          >
            <el-option 
              v-for="db in databases" 
              :key="db.id" 
              :label="db.name" 
              :value="db.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="目标数据库">
          <el-select 
            v-model="compareForm.targetId" 
            placeholder="选择目标数据库"
            @change="fetchTargetTables"
          >
            <el-option 
              v-for="db in databases" 
              :key="db.id" 
              :label="db.name" 
              :value="db.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="compareTableSchemas"
            :disabled="!compareForm.sourceId || !compareForm.targetId"
          >
            开始比较
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="comparisonResults.length" class="comparison-results">
      <template #header>
        <div class="card-header">
          <span>比较结果</span>
          <el-button 
            type="success" 
            @click="generateSyncSQL"
            :disabled="!canGenerateSyncSQL"
          >
            生成同步 SQL
          </el-button>
        </div>
      </template>

      <el-table 
        :data="comparisonResults" 
        stripe 
        style="width: 100%"
      >
        <el-table-column prop="tableName" label="表名" width="200" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag 
              :type="getStatusTagType(scope.row.status)"
            >
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="列差异" width="200">
          <template #default="scope">
            <template v-if="scope.row.columns">
              <el-tag type="warning" v-if="scope.row.columns.missingColumns.length">
                缺失列: {{ scope.row.columns.missingColumns.length }}
              </el-tag>
              <el-tag type="warning" v-if="scope.row.columns.extraColumns.length">
                额外列: {{ scope.row.columns.extraColumns.length }}
              </el-tag>
              <el-tag type="warning" v-if="scope.row.columns.modifiedColumns.length">
                修改列: {{ scope.row.columns.modifiedColumns.length }}
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="索引差异" width="200">
          <template #default="scope">
            <template v-if="scope.row.indexes">
              <el-tag type="warning" v-if="scope.row.indexes.missingIndexes.length">
                缺失索引: {{ scope.row.indexes.missingIndexes.length }}
              </el-tag>
              <el-tag type="warning" v-if="scope.row.indexes.extraIndexes.length">
                额外索引: {{ scope.row.indexes.extraIndexes.length }}
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button-group>
              <el-button 
                type="primary" 
                icon="View" 
                @click="showTableDetails(scope.row)"
              >
                详情
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog 
      v-model="tableDetailsDialogVisible" 
      :title="currentTableDetails.tableName + ' 表结构比较'"
      width="80%"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="列比较">
          <el-table :data="currentTableDetails.columns?.missingColumns" v-if="currentTableDetails.columns?.missingColumns?.length">
            <el-table-column prop="column_name" label="列名" />
            <el-table-column prop="data_type" label="数据类型" />
            <el-table-column prop="length" label="长度" />
          </el-table>
          <el-table :data="currentTableDetails.columns?.extraColumns" v-if="currentTableDetails.columns?.extraColumns?.length">
            <el-table-column prop="column_name" label="列名" />
            <el-table-column prop="data_type" label="数据类型" />
            <el-table-column prop="length" label="长度" />
          </el-table>
          <el-table :data="currentTableDetails.columns?.modifiedColumns" v-if="currentTableDetails.columns?.modifiedColumns?.length">
            <el-table-column prop="column_name" label="列名" />
            <el-table-column prop="data_type" label="数据类型" />
            <el-table-column prop="length" label="长度" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="索引比较">
          <el-table :data="currentTableDetails.indexes?.missingIndexes" v-if="currentTableDetails.indexes?.missingIndexes?.length">
            <el-table-column prop="Key_name" label="索引名" />
            <el-table-column prop="Column_name" label="列名" />
          </el-table>
          <el-table :data="currentTableDetails.indexes?.extraIndexes" v-if="currentTableDetails.indexes?.extraIndexes?.length">
            <el-table-column prop="Key_name" label="索引名" />
            <el-table-column prop="Column_name" label="列名" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog 
      v-model="syncSQLDialogVisible" 
      title="同步 SQL 脚本"
      width="80%"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="创建表">
          <pre>{{ syncSQL.createTables.join('\n\n') }}</pre>
        </el-tab-pane>
        <el-tab-pane label="修改表">
          <pre>{{ syncSQL.alterTables.join('\n\n') }}</pre>
        </el-tab-pane>
        <el-tab-pane label="创建索引">
          <pre>{{ syncSQL.createIndexes.join('\n\n') }}</pre>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="copySyncSQL">复制 SQL</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  fetchDatabases 
} from '@/api/database'
import { 
  compareTableSchemas,
  generateSyncSQL
} from '@/api/tableCompare'

const databases = ref([])
const compareForm = ref({
  sourceId: null,
  targetId: null
})

const comparisonResults = ref([])
const tableDetailsDialogVisible = ref(false)
const currentTableDetails = ref({})

const syncSQLDialogVisible = ref(false)
const syncSQL = ref({
  createTables: [],
  alterTables: [],
  createIndexes: []
})

const canGenerateSyncSQL = computed(() => 
  comparisonResults.value.some(result => result.status !== 'IDENTICAL')
)

const fetchSourceTables = () => {
  // 可以在这里获取源数据库的表列表
}

const fetchTargetTables = () => {
  // 可以在这里获取目标数据库的表列表
}

const compareTableSchemas = async () => {
  try {
    const response = await compareTableSchemas(
      compareForm.value.sourceId, 
      compareForm.value.targetId
    )
    comparisonResults.value = response.comparisonResults
  } catch (error) {
    ElMessage.error('表结构比较失败')
  }
}

const generateSyncSQL = async () => {
  try {
    const response = await generateSyncSQL(
      compareForm.value.sourceId, 
      compareForm.value.targetId,
      { comparisonResults: comparisonResults.value }
    )
    syncSQL.value = response
    syncSQLDialogVisible.value = true
  } catch (error) {
    ElMessage.error('生成同步 SQL 失败')
  }
}

const showTableDetails = (row) => {
  currentTableDetails.value = row
  tableDetailsDialogVisible.value = true
}

const copySyncSQL = () => {
  const allSQL = [
    ...syncSQL.value.createTables,
    ...syncSQL.value.alterTables,
    ...syncSQL.value.createIndexes
  ].join('\n\n')

  navigator.clipboard.writeText(allSQL).then(() => {
    ElMessage.success('SQL 已复制到剪贴板')
  }).catch(err => {
    ElMessage.error('复制失败')
  })
}

const getStatusTagType = (status) => {
  const statusMap = {
    'IDENTICAL': 'success',
    'DIFFERENT': 'warning',
    'MISSING': 'danger',
    'EXTRA': 'info'
  }
  return statusMap[status] || 'info'
}

const getStatusLabel = (status) => {
  const statusMap = {
    'IDENTICAL': '完全相同',
    'DIFFERENT': '存在差异',
    'MISSING': '缺失表',
    'EXTRA': '额外表'
  }
  return statusMap[status] || status
}

onMounted(async () => {
  try {
    const response = await fetchDatabases()
    databases.value = response.databases
  } catch (error) {
    ElMessage.error('获取数据库列表失败')
  }
})
</script>

<style scoped>
.table-compare {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 4px;
}
</style>
