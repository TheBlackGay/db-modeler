<template>
  <div class="database-detail">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="database-info">
          <template #header>
            <div class="card-header">
              <span>数据库连接信息</span>
              <el-button 
                type="primary" 
                icon="Edit" 
                size="small"
                @click="$router.push(`/databases/edit/${databaseId}`)"
              >
                编辑
              </el-button>
            </div>
          </template>
          
          <el-descriptions :column="1" border>
            <el-descriptions-item label="连接名称">
              {{ database.name }}
            </el-descriptions-item>
            <el-descriptions-item label="数据库类型">
              <el-tag :type="getDatabaseTypeTagType(database.type)">
                {{ getDatabaseTypeLabel(database.type) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="主机地址">
              {{ database.host || 'N/A' }}
            </el-descriptions-item>
            <el-descriptions-item label="端口">
              {{ database.port || 'N/A' }}
            </el-descriptions-item>
            <el-descriptions-item label="数据库名">
              {{ database.database || database.filePath || 'N/A' }}
            </el-descriptions-item>
            <el-descriptions-item label="连接状态">
              <el-tag :type="database.isConnected ? 'success' : 'danger'">
                {{ database.isConnected ? '已连接' : '未连接' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="database-tables">
          <template #header>
            <div class="card-header">
              <span>数据库表列表</span>
              <el-input 
                v-model="tableSearch" 
                placeholder="搜索表名" 
                clearable 
                style="width: 200px;"
                @input="filterTables"
              />
            </div>
          </template>

          <el-table 
            :data="filteredTables" 
            v-loading="tablesLoading"
            stripe 
            style="width: 100%"
            @row-dblclick="openTableDetail"
          >
            <el-table-column prop="name" label="表名" width="200" />
            <el-table-column prop="type" label="表类型" width="120">
              <template #default="scope">
                <el-tag>{{ scope.row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="rowCount" label="记录数" width="120" />
            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <el-button-group>
                  <el-button 
                    type="primary" 
                    icon="View" 
                    @click="openTableDetail(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button 
                    type="warning" 
                    icon="Edit" 
                    @click="editTableSchema(scope.row)"
                  >
                    编辑
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="tablePagination.page"
            v-model:page-size="tablePagination.pageSize"
            :total="tablePagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="fetchDatabaseTables"
            @current-change="fetchDatabaseTables"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  getDatabaseDetail, 
  getDatabaseTables 
} from '@/api/database'

const route = useRoute()
const router = useRouter()

const databaseId = route.params.id
const database = ref({})
const tables = ref([])
const tableSearch = ref('')
const tablesLoading = ref(false)

const tablePagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const filteredTables = computed(() => {
  return tables.value.filter(table => 
    table.name.toLowerCase().includes(tableSearch.value.toLowerCase())
  )
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

const fetchDatabaseDetail = async () => {
  try {
    database.value = await getDatabaseDetail(databaseId)
  } catch (error) {
    ElMessage.error('获取数据库详情失败')
    router.push('/databases')
  }
}

const fetchDatabaseTables = async () => {
  tablesLoading.value = true
  try {
    const response = await getDatabaseTables(databaseId, {
      page: tablePagination.value.page,
      pageSize: tablePagination.value.pageSize
    })
    
    tables.value = response.tables
    tablePagination.value.total = response.total
  } catch (error) {
    ElMessage.error('获取数据库表列表失败')
  } finally {
    tablesLoading.value = false
  }
}

const filterTables = () => {
  // 过滤逻辑在 computed 中实现
}

const openTableDetail = (table) => {
  router.push(`/databases/${databaseId}/tables/${table.name}`)
}

const editTableSchema = (table) => {
  router.push(`/databases/${databaseId}/tables/${table.name}/edit`)
}

onMounted(() => {
  fetchDatabaseDetail()
  fetchDatabaseTables()
})
</script>

<style scoped>
.database-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-pagination {
  margin-top: 16px;
  justify-content: center;
}
</style>
