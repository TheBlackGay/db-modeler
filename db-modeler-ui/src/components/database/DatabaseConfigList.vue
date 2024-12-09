&lt;template>
  &lt;div class="database-config-list">
    &lt;div class="header">
      &lt;h2>数据库配置&lt;/h2>
      &lt;el-button type="primary" @click="handleAdd">添加配置&lt;/el-button>
    &lt;/div>

    &lt;el-table :data="configs" v-loading="loading">
      &lt;el-table-column prop="name" label="名称" />
      &lt;el-table-column prop="type" label="类型">
        &lt;template #default="{ row }">
          &lt;el-tag>{{ row.type }}&lt;/el-tag>
        &lt;/template>
      &lt;/el-table-column>
      &lt;el-table-column prop="host" label="主机" />
      &lt;el-table-column prop="databaseName" label="数据库" />
      &lt;el-table-column prop="status" label="状态">
        &lt;template #default="{ row }">
          &lt;el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
            {{ row.status === 'ACTIVE' ? '活跃' : '禁用' }}
          &lt;/el-tag>
        &lt;/template>
      &lt;/el-table-column>
      &lt;el-table-column label="操作" width="200">
        &lt;template #default="{ row }">
          &lt;el-button-group>
            &lt;el-button size="small" @click="handleEdit(row)">编辑&lt;/el-button>
            &lt;el-button size="small" type="primary" @click="handleTest(row)">测试连接&lt;/el-button>
            &lt;el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.status === 'DELETED'"
            >删除&lt;/el-button>
          &lt;/el-button-group>
        &lt;/template>
      &lt;/el-table-column>
    &lt;/el-table>

    &lt;database-config-form
      v-model:visible="formVisible"
      :config="currentConfig"
      @submit="handleSubmit"
    />
  &lt;/div>
&lt;/template>

&lt;script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DatabaseConfig, DatabaseConfigListItem } from '@/types/database'
import { getDatabaseConfigs, deleteDatabaseConfig, testDatabaseConnection } from '@/api/database'
import DatabaseConfigForm from './DatabaseConfigForm.vue'

const props = defineProps<{
  projectId: string
}>()

const loading = ref(false)
const configs = ref<DatabaseConfigListItem[]>([])
const formVisible = ref(false)
const currentConfig = ref<DatabaseConfig | null>(null)

const loadConfigs = async () => {
  loading.value = true
  try {
    const response = await getDatabaseConfigs(props.projectId)
    configs.value = response.data
  } catch (error) {
    ElMessage.error('加载数据库配置失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentConfig.value = null
  formVisible.value = true
}

const handleEdit = (row: DatabaseConfigListItem) => {
  currentConfig.value = row as DatabaseConfig
  formVisible.value = true
}

const handleTest = async (row: DatabaseConfigListItem) => {
  try {
    const response = await testDatabaseConnection(props.projectId, row as DatabaseConfig)
    if (response.data) {
      ElMessage.success('连接成功')
    } else {
      ElMessage.error('连接失败')
    }
  } catch (error) {
    ElMessage.error('测试连接失败')
  }
}

const handleDelete = async (row: DatabaseConfigListItem) => {
  try {
    await ElMessageBox.confirm('确定要删除该配置吗？', '提示', {
      type: 'warning'
    })
    await deleteDatabaseConfig(props.projectId, row.id!)
    ElMessage.success('删除成功')
    loadConfigs()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = () => {
  loadConfigs()
  formVisible.value = false
}

onMounted(() => {
  loadConfigs()
})
&lt;/script>

&lt;style scoped>
.database-config-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}
&lt;/style>
