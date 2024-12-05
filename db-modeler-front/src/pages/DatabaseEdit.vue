<template>
  <div class="database-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEditMode ? '编辑数据库连接' : '创建数据库连接' }}</span>
        </div>
      </template>

      <el-form 
        ref="databaseFormRef" 
        :model="databaseForm" 
        :rules="rules" 
        label-width="120px"
      >
        <el-form-item label="连接名称" prop="name">
          <el-input 
            v-model="databaseForm.name" 
            placeholder="请输入连接名称"
          />
        </el-form-item>

        <el-form-item label="数据库类型" prop="type">
          <el-select 
            v-model="databaseForm.type" 
            placeholder="选择数据库类型"
            @change="onDatabaseTypeChange"
          >
            <el-option 
              v-for="type in databaseTypes" 
              :key="type.value" 
              :label="type.label" 
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <template v-if="databaseForm.type !== 'sqlite'">
          <el-form-item label="主机地址" prop="host">
            <el-input 
              v-model="databaseForm.host" 
              placeholder="请输入主机地址"
            />
          </el-form-item>

          <el-form-item label="端口" prop="port">
            <el-input-number 
              v-model="databaseForm.port" 
              :min="1" 
              :max="65535"
            />
          </el-form-item>
        </template>

        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="databaseForm.username" 
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="databaseForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <template v-if="databaseForm.type !== 'sqlite'">
          <el-form-item label="数据库名" prop="database">
            <el-input 
              v-model="databaseForm.database" 
              placeholder="请输入数据库名"
            />
          </el-form-item>
        </template>

        <template v-if="databaseForm.type === 'sqlite'">
          <el-form-item label="数据库文件" prop="filePath">
            <el-input 
              v-model="databaseForm.filePath" 
              placeholder="请选择SQLite数据库文件"
            >
              <template #append>
                <el-button @click="selectSqliteFile">选择文件</el-button>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitForm"
            :loading="submitting"
          >
            {{ isEditMode ? '更新连接' : '创建连接' }}
          </el-button>
          <el-button @click="testConnection" :loading="testing">
            测试连接
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  createDatabase, 
  updateDatabase, 
  getDatabaseDetail,
  testDatabaseConnection,
  getDatabaseTypes
} from '@/api/database'

const route = useRoute()
const router = useRouter()

const databaseFormRef = ref(null)
const databaseForm = ref({
  name: '',
  type: null,
  host: '',
  port: null,
  username: '',
  password: '',
  database: '',
  filePath: ''
})

const databaseTypes = ref([
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' }
])

const isEditMode = computed(() => !!route.params.id)
const submitting = ref(false)
const testing = ref(false)

const rules = {
  name: [
    { required: true, message: '请输入连接名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择数据库类型', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  database: [
    { required: true, message: '请输入数据库名', trigger: 'blur' }
  ],
  filePath: [
    { required: true, message: '请选择SQLite数据库文件', trigger: 'blur' }
  ]
}

const onDatabaseTypeChange = (type) => {
  if (type === 'sqlite') {
    databaseForm.value.host = ''
    databaseForm.value.port = null
    databaseForm.value.database = ''
  }
}

const selectSqliteFile = () => {
  // TODO: 实现文件选择逻辑
  ElMessage.warning('文件选择功能待实现')
}

const submitForm = async () => {
  const formRef = databaseFormRef.value
  if (!formRef) return

  await formRef.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = { ...databaseForm.value }
        if (isEditMode.value) {
          await updateDatabase(route.params.id, data)
          ElMessage.success('更新成功')
        } else {
          await createDatabase(data)
          ElMessage.success('创建成功')
        }
        router.push('/databases')
      } catch (error) {
        ElMessage.error(error.message || '操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const testConnection = async () => {
  const formRef = databaseFormRef.value
  if (!formRef) return

  await formRef.validate(async (valid) => {
    if (valid) {
      testing.value = true
      try {
        const data = { ...databaseForm.value }
        const response = await testDatabaseConnection(data)
        if (response.connected) {
          ElMessage.success('连接成功')
        } else {
          ElMessage.error('连接失败：' + response.message)
        }
      } catch (error) {
        ElMessage.error('连接测试失败')
      } finally {
        testing.value = false
      }
    }
  })
}

const resetForm = () => {
  const formRef = databaseFormRef.value
  if (formRef) {
    formRef.resetFields()
  }
}

const fetchDatabaseDetail = async () => {
  if (isEditMode.value) {
    try {
      const response = await getDatabaseDetail(route.params.id)
      databaseForm.value = response
    } catch (error) {
      ElMessage.error('获取数据库详情失败')
      router.push('/databases')
    }
  }
}

onMounted(() => {
  fetchDatabaseDetail()
})
</script>

<style scoped>
.database-edit {
  max-width: 600px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
