<template>
  <div class="table-list-container">
    <el-card class="table-list-card">
      <template #header>
        <div class="card-header">
          <span>{{ databaseName }} 数据库表列表</span>
          <div class="table-actions">
            <el-input 
              v-model="searchTableName" 
              placeholder="搜索表名" 
              clearable 
              style="width: 200px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table 
        v-loading="loading"
        :data="filteredTables" 
        stripe 
        style="width: 100%"
        max-height="500px"
      >
        <el-table-column prop="name" label="表名" width="200">
          <template #default="scope">
            <el-link 
              type="primary" 
              @click="showTableDetails(scope.row)"
            >
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="表类型" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="rowCount" label="记录数" width="120">
          <template #default="scope">
            <el-tag type="info">{{ scope.row.rowCount }}</el-tag>
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
              <el-button 
                type="success" 
                icon="DataLine" 
                @click="showTableData(scope.row)"
              >
                预览
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-summary">
        <span>总表数: {{ tables.length }}</span>
      </div>
    </el-card>

    <el-dialog 
      v-model="tableStructureDialogVisible" 
      :title="`${currentTable.name} 表结构`"
      width="80%"
    >
      <el-table :data="tableStructure" stripe>
        <el-table-column prop="name" label="列名" width="200" />
        <el-table-column prop="type" label="数据类型" width="150" />
        <el-table-column prop="length" label="长度" width="100" />
        <el-table-column label="主键" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.primaryKey" type="success">是</el-tag>
            <el-tag v-else type="info">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="nullable" label="可空" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.nullable" type="warning">是</el-tag>
            <el-tag v-else type="success">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" width="150" />
        <el-table-column prop="comment" label="备注" />
      </el-table>
    </el-dialog>

    <el-dialog 
      v-model="tableDataDialogVisible" 
      :title="`${currentTable.name} 数据预览`"
      width="90%"
    >
      <el-table 
        :data="tableData" 
        stripe 
        :max-height="500"
      >
        <el-table-column 
          v-for="(column, index) in tableColumns" 
          :key="index" 
          :prop="column" 
          :label="column" 
        />
      </el-table>

      <template #footer>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalRecords"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchTableData"
          @current-change="fetchTableData"
        />
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  listTables, 
  getTableStructure, 
  getTableDataPreview 
} from '@/api/tableManage'

const props = defineProps({
  databaseId: {
    type: String,
    required: true
  },
  databaseName: {
    type: String,
    default: '未命名数据库'
  }
})

const loading = ref(false)
const tables = ref([])
const searchTableName = ref('')

const filteredTables = computed(() => {
  return tables.value.filter(table => 
    table.name.toLowerCase().includes(searchTableName.value.toLowerCase())
  )
})

const tableStructureDialogVisible = ref(false)
const currentTable = ref({})
const tableStructure = ref([])

const tableDataDialogVisible = ref(false)
const tableData = ref([])
const tableColumns = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalRecords = ref(0)

const fetchTables = async () => {
  try {
    loading.value = true
    const response = await listTables(props.databaseId)
    tables.value = response.tables
  } catch (error) {
    ElMessage.error('获取表列表失败')
  } finally {
    loading.value = false
  }
}

const showTableDetails = async (table) => {
  try {
    currentTable.value = table
    const response = await getTableStructure(props.databaseId, table.name)
    tableStructure.value = response.structure
    tableStructureDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取表结构失败')
  }
}

const showTableData = async (table) => {
  currentTable.value = table
  currentPage.value = 1
  await fetchTableData()
}

const fetchTableData = async () => {
  try {
    const response = await getTableDataPreview(
      props.databaseId, 
      currentTable.value.name,
      { page: currentPage.value, pageSize: pageSize.value }
    )
    
    tableData.value = response.data
    totalRecords.value = response.total
    
    // 动态生成表头
    if (tableData.value.length > 0) {
      tableColumns.value = Object.keys(tableData.value[0])
    }
    
    tableDataDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取表数据失败')
  }
}

onMounted(fetchTables)
</script>

<style scoped>
.table-list-container {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-summary {
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  color: #666;
}
</style>
