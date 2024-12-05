<template>
  <div class="data-mapping-rule-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据映射规则管理</span>
          <el-button-group>
            <el-button 
              type="primary" 
              @click="handleCreate"
              :icon="Plus"
            >
              创建映射规则
            </el-button>
            <el-button 
              type="success" 
              @click="refreshList"
              :icon="Refresh"
              :loading="loading"
            >
              刷新
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-form 
        :inline="true" 
        class="filter-container"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="源数据库">
          <el-select 
            v-model="filters.sourceDatabase" 
            clearable 
            placeholder="选择源数据库"
          >
            <el-option 
              v-for="db in supportedDatabases" 
              :key="db" 
              :label="db" 
              :value="db"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="目标数据库">
          <el-select 
            v-model="filters.targetDatabase" 
            clearable 
            placeholder="选择目标数据库"
          >
            <el-option 
              v-for="db in supportedDatabases" 
              :key="db" 
              :label="db" 
              :value="db"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select 
            v-model="filters.status" 
            clearable 
            placeholder="选择状态"
          >
            <el-option 
              v-for="status in ['draft', 'active', 'archived']" 
              :key="status" 
              :label="statusLabels[status]" 
              :value="status"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            native-type="submit"
            :icon="Search"
          >
            搜索
          </el-button>
          <el-button 
            @click="resetFilters"
            :icon="RefreshRight"
          >
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-table 
        v-loading="loading"
        :data="mappingRules" 
        stripe 
        style="width: 100%"
        @sort-change="handleSortChange"
      >
        <el-table-column 
          prop="name" 
          label="规则名称" 
          width="200"
          sortable="custom"
        >
          <template #default="{ row }">
            <el-link 
              type="primary" 
              @click="handleDetail(row.id)"
            >
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column 
          prop="sourceDatabase" 
          label="源数据库" 
          width="150"
        />

        <el-table-column 
          prop="targetDatabase" 
          label="目标数据库" 
          width="150"
        />

        <el-table-column 
          prop="status" 
          label="状态" 
          width="120"
        >
          <template #default="{ row }">
            <el-tag 
              :type="getStatusType(row.status)"
            >
              {{ statusLabels[row.status] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          prop="createdAt" 
          label="创建时间" 
          width="180"
          sortable="custom"
        >
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column 
          label="操作" 
          width="200" 
          fixed="right"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small"
                @click="handleEdit(row.id)"
              >
                编辑
              </el-button>
              <el-button 
                type="danger" 
                size="small"
                @click="handleDelete(row.id)"
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
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="fetchMappingRules"
        @current-change="fetchMappingRules"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { 
  ElMessage, 
  ElMessageBox 
} from 'element-plus'
import { 
  Plus, 
  Refresh, 
  Search, 
  RefreshRight 
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import dataMappingApi from '@/api/dataMappingApi'
import { formatDate } from '@/utils/dateUtils'

const router = useRouter()

const supportedDatabases = [
  'MySQL', 
  'PostgreSQL', 
  'SQLite', 
  'SQL Server', 
  'Oracle', 
  'MariaDB'
]

const statusLabels = {
  'draft': '草稿',
  'active': '活跃',
  'archived': '已归档'
}

const loading = ref(false)
const mappingRules = ref([])

const filters = reactive({
  sourceDatabase: null,
  targetDatabase: null,
  status: null,
  page: 1,
  pageSize: 10,
  sortField: 'createdAt',
  sortOrder: 'descending'
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const fetchMappingRules = async () => {
  loading.value = true
  try {
    const response = await dataMappingApi.listMappingConfigs({
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize
    })

    mappingRules.value = response.data.configs
    pagination.total = response.data.total
  } catch (error) {
    ElMessage.error('获取映射规则列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchMappingRules()
}

const resetFilters = () => {
  filters.sourceDatabase = null
  filters.targetDatabase = null
  filters.status = null
  pagination.page = 1
  fetchMappingRules()
}

const handleSortChange = ({ prop, order }) => {
  filters.sortField = prop
  filters.sortOrder = order
  fetchMappingRules()
}

const handleCreate = () => {
  router.push('/data-mapping/rules/create')
}

const handleEdit = (id) => {
  router.push(`/data-mapping/rules/edit/${id}`)
}

const handleDetail = (id) => {
  router.push(`/data-mapping/rules/detail/${id}`)
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除此映射规则吗？删除后不可恢复。', 
      '删除确认', 
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await dataMappingApi.deleteMappingConfig(id)
    ElMessage.success('映射规则删除成功')
    fetchMappingRules()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除映射规则失败：' + error.message)
    }
  }
}

const refreshList = () => {
  fetchMappingRules()
}

const getStatusType = (status) => {
  const statusTypeMap = {
    'draft': 'info',
    'active': 'success',
    'archived': 'warning'
  }
  return statusTypeMap[status] || 'info'
}

onMounted(() => {
  fetchMappingRules()
})
</script>

<style scoped>
.data-mapping-rule-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-container {
  margin-bottom: 20px;
}
</style>
