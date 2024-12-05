<template>
  <div class="table-schema-detail" v-loading="loading">
    <el-card class="table-info-card">
      <template #header>
        <div class="card-header">
          <span>{{ tableSchema.name }}</span>
          <el-button-group>
            <el-button 
              type="warning" 
              icon="Edit" 
              @click="editTableSchema"
            >
              编辑
            </el-button>
            <el-button 
              type="primary" 
              icon="View" 
              @click="showSQLDialog"
            >
              SQL 脚本
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="表名">
          {{ tableSchema.name }}
        </el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tag :type="getTableTypeTagType(tableSchema.type)">
            {{ getTableTypeLabel(tableSchema.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="数据库">
          {{ tableSchema.database?.name }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="3">
          {{ tableSchema.description || '暂无描述' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="columns-card">
      <template #header>
        <span>列定义</span>
      </template>

      <el-table 
        :data="tableSchema.columns" 
        stripe 
        style="width: 100%"
      >
        <el-table-column prop="name" label="列名" />
        <el-table-column prop="type" label="数据类型" />
        <el-table-column label="是否可空">
          <template #default="scope">
            <el-tag :type="scope.row.nullable ? 'info' : 'danger'">
              {{ scope.row.nullable ? '可空' : '不可空' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="主键">
          <template #default="scope">
            <el-tag :type="scope.row.primaryKey ? 'success' : ''">
              {{ scope.row.primaryKey ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="unique" label="唯一">
          <template #default="scope">
            <el-tag :type="scope.row.unique ? 'warning' : ''">
              {{ scope.row.unique ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="defaultValue" label="默认值" />
      </el-table>
    </el-card>

    <el-card class="indexes-card" v-if="tableSchema.indexes?.length">
      <template #header>
        <span>索引</span>
      </template>

      <el-table 
        :data="tableSchema.indexes" 
        stripe 
        style="width: 100%"
      >
        <el-table-column label="索引名称">
          <template #default="scope">
            idx_{{ tableSchema.name }}_{{ scope.row.columns.join('_') }}
          </template>
        </el-table-column>
        <el-table-column prop="columns" label="索引列" />
        <el-table-column label="唯一索引">
          <template #default="scope">
            <el-tag :type="scope.row.unique ? 'warning' : ''">
              {{ scope.row.unique ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  getTableSchemaDetail, 
  generateTableSchemaSQL 
} from '@/api/tableSchema'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const tableSchema = ref({})
const sqlDialogVisible = ref(false)
const sqlScript = ref('')
const sqlDialect = ref('mysql')

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

const fetchTableSchemaDetail = async () => {
  try {
    const response = await getTableSchemaDetail(route.params.id)
    tableSchema.value = response
  } catch (error) {
    ElMessage.error('获取表结构详情失败')
    router.push('/table-schemas')
  } finally {
    loading.value = false
  }
}

const editTableSchema = () => {
  router.push(`/table-schemas/edit/${route.params.id}`)
}

const showSQLDialog = () => {
  sqlDialogVisible.value = true
  generateSQL()
}

const generateSQL = async () => {
  try {
    const response = await generateTableSchemaSQL(
      route.params.id, 
      sqlDialect.value
    )
    sqlScript.value = response.sqlScript
  } catch (error) {
    ElMessage.error('生成 SQL 脚本失败')
  }
}

onMounted(() => {
  fetchTableSchemaDetail()
})
</script>

<style scoped>
.table-schema-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-descriptions {
  margin-top: 10px;
}
</style>
