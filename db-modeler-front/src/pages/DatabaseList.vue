<template>
  <div class="database-list">
    <el-card class="search-container">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="连接类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="选择数据库类型"
            @change="fetchDatabases"
          >
            <el-option label="MySQL" value="mysql" />
            <el-option label="PostgreSQL" value="postgresql" />
            <el-option label="SQLite" value="sqlite" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="搜索">
          <el-input 
            v-model="searchForm.search" 
            placeholder="数据库名称/主机" 
            @keyup.enter="fetchDatabases"
          >
            <template #append>
              <el-button icon="Search" @click="fetchDatabases" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            icon="Plus" 
            @click="$router.push('/databases/create')"
          >
            创建连接
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-container">
      <el-table 
        v-loading="loading"
        :data="databases" 
        stripe 
        style="width: 100%"
        @row-dblclick="openDatabaseDetail"
      >
        <el-table-column prop="name" label="连接名称" width="200" />
        <el-table-column prop="type" label="数据库类型" width="120">
          <template #default="scope">
            <el-tag :type="getDatabaseTypeTagType(scope.row.type)">
              {{ getDatabaseTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="host" label="主机" width="200" />
        <el-table-column prop="port" label="端口" width="100" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag 
              :type="scope.row.isConnected ? 'success' : 'danger'"
            >
              {{ scope.row.isConnected ? '已连接' : '未连接' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button-group>
              <el-button 
                type="primary" 
                icon="Connection" 
                @click="testDatabaseConnection(scope.row)"
                :loading="scope.row.testing"
              >
                测试连接
              </el-button>
              <el-button 
                type="warning" 
                icon="Edit" 
                @click="editDatabase(scope.row)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                icon="Delete" 
                @click="deleteDatabase(scope.row)"
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
        @size-change="fetchDatabases"
        @current-change="fetchDatabases"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  fetchDatabases, 
  deleteDatabase, 
  testDatabaseConnection 
} from '@/api/database'

const router = useRouter()
const loading = ref(false)
const databases = ref([])

const searchForm = ref({
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

const getDatabaseTypeLabel = (type) => {
  const typeMap = {
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'sqlite': 'SQLite'
  }
  return typeMap[type] || type
}

const getDatabaseTypeTagType = (type) => {
  const typeMap = {
    'mysql': 'success',
    'postgresql': 'warning',
    'sqlite': 'info'
  }
  return typeMap[type] || 'info'
}

const fetchDatabaseList = async () => {
  loading.value = true
  try {
    const response = await fetchDatabases({
      ...searchForm.value,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    })
    
    databases.value = response.databases
    pagination.value.total = response.total
  } catch (error) {
    ElMessage.error('获取数据库列表失败')
  } finally {
    loading.value = false
  }
}

const testConnection = async (database) => {
  database.testing = true
  try {
    const response = await testDatabaseConnection(database.id)
    if (response.connected) {
      ElMessage.success('连接成功')
      database.isConnected = true
    } else {
      ElMessage.error('连接失败：' + response.message)
      database.isConnected = false
    }
  } catch (error) {
    ElMessage.error('连接测试失败')
  } finally {
    database.testing = false
  }
}

const openDatabaseDetail = (row) => {
  router.push(`/databases/detail/${row.id}`)
}

const editDatabase = (row) => {
  router.push(`/databases/edit/${row.id}`)
}

const deleteDatabase = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定删除数据库连接 "${row.name}"？`, 
      '删除确认', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteDatabase(row.id)
    ElMessage.success('删除成功')
    fetchDatabaseList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchDatabaseList()
})
</script>

<style scoped>
.database-list {
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
