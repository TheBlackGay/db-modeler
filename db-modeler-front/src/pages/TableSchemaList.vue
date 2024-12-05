<template>
  <div class="table-schema-list">
    <el-card class="search-container">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="数据库">
          <el-select 
            v-model="searchForm.databaseId" 
            placeholder="选择数据库"
            @change="fetchTableSchemas"
          >
            <el-option 
              v-for="db in databases" 
              :key="db.id" 
              :label="db.name" 
              :value="db.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="表类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="选择表类型"
            @change="fetchTableSchemas"
          >
            <el-option label="表" value="table" />
            <el-option label="视图" value="view" />
            <el-option label="物化视图" value="materialized_view" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="搜索">
          <el-input 
            v-model="searchForm.search" 
            placeholder="表名/描述" 
            @keyup.enter="fetchTableSchemas"
          >
            <template #append>
              <el-button icon="Search" @click="fetchTableSchemas" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-table 
        v-loading="loading"
        :data="tableSchemas" 
        stripe 
        style="width: 100%"
        @row-dblclick="openTableSchemaDetail"
      >
        <el-table-column prop="name" label="表名" width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTableTypeTagType(scope.row.type)">
              {{ getTableTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button-group>
              <el-button 
                type="primary" 
                icon="View" 
                @click="openTableSchemaDetail(scope.row)"
              >
                详情
              </el-button>
              <el-button 
                type="warning" 
                icon="Edit" 
                @click="editTableSchema(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                icon="Delete" 
                @click="deleteTableSchema(scope.row)"
              >
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchTableSchemas"
        @current-change="fetchTableSchemas"
      />
    </el-card>

    <el-dialog 
      v-model="sqlDialogVisible" 
      title="SQL 脚本" 
      width="800px"
    >
      <el-select 
        v-model="sqlDialect" 
        placeholder="选择数据库类型" 
        style="margin-bottom: 10px"
        @change="generateSQL"
      >
        <el-option label="MySQL" value="mysql" />
        <el-option label="PostgreSQL" value="postgresql" />
        <el-option label="SQLite" value="sqlite" />
      </el-select>

      <el-input 
        v-model="sqlScript" 
        :rows="15" 
        type="textarea" 
        readonly 
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  fetchTableSchemas, 
  deleteTableSchema, 
  generateTableSchemaSQL 
} from '@/api/tableSchema'
import { fetchDatabases } from '@/api/database'

const loading = ref(false)
const tableSchemas = ref([])
const databases = ref([])
const sqlDialogVisible = ref(false)
const sqlScript = ref('')
const sqlDialect = ref('mysql')
const currentTableSchema = ref(null)

const searchForm = ref({
  databaseId: null,
  type: null,
  search: '',
  page: 1,
  pageSize: 10
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const getTableTypeLabel = (type) => {
  const typeMap = {
    'table': '表',
    'view': '视图',
    'materialized_view': '物化视图'
  }
  return typeMap[type] || type
}

const getTableTypeTagType = (type) => {
  const typeMap = {
    'table': 'success',
    'view': 'warning',
    'materialized_view': 'info'
  }
  return typeMap[type] || 'info'
}

const fetchDatabaseList = async () => {
  try {
    const response = await fetchDatabases()
    databases.value = response.data
  } catch (error) {
    ElMessage.error('获取数据库列表失败')
  }
}

const fetchTableSchemaList = async () => {
  if (!searchForm.value.databaseId) {
    ElMessage.warning('请先选择数据库')
    return
  }

  loading.value = true
  try {
    const response = await fetchTableSchemas({
      ...searchForm.value,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    
    tableSchemas.value = response.tableSchemas
    pagination.value.total = response.total
  } catch (error) {
    ElMessage.error('获取表结构列表失败')
  } finally {
    loading.value = false
  }
}

const openTableSchemaDetail = (row) => {
  // TODO: 实现表结构详情页面跳转
}

const editTableSchema = (row) => {
  // TODO: 实现表结构编辑页面跳转
}

const deleteTableSchema = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定删除表结构 "${row.name}"？`, 
      '删除确认', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteTableSchema(row.id)
    ElMessage.success('删除成功')
    fetchTableSchemaList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const showSQLDialog = async (row) => {
  currentTableSchema.value = row
  sqlDialogVisible.value = true
  await generateSQL()
}

const generateSQL = async () => {
  if (!currentTableSchema.value) return

  try {
    const response = await generateTableSchemaSQL(
      currentTableSchema.value.id, 
      sqlDialect.value
    )
    sqlScript.value = response.sqlScript
  } catch (error) {
    ElMessage.error('生成 SQL 脚本失败')
  }
}

onMounted(() => {
  fetchDatabaseList()
})
</script>

<style scoped>
.table-schema-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-container, .table-container {
  background-color: #f5f7fa;
}

.el-pagination {
  margin-top: 16px;
  justify-content: center;
}
</style>
