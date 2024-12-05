<template>
  <div class="database-connection-test">
    <el-form 
      ref="connectionFormRef" 
      :model="connectionForm" 
      :rules="connectionRules" 
      label-width="120px"
    >
      <el-form-item label="数据库类型" prop="type">
        <el-select 
          v-model="connectionForm.type" 
          placeholder="选择数据库类型"
          @change="handleDatabaseTypeChange"
        >
          <el-option 
            v-for="dbType in databaseTypes" 
            :key="dbType.type" 
            :label="dbType.name" 
            :value="dbType.type"
          >
            <div class="database-type-option">
              <i :class="`icon-${dbType.type}`"></i>
              <span>{{ dbType.name }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>

      <template v-if="connectionForm.type !== 'sqlite'">
        <el-form-item label="主机地址" prop="host">
          <el-input 
            v-model="connectionForm.host" 
            placeholder="请输入数据库主机地址"
          />
        </el-form-item>

        <el-form-item label="端口号" prop="port">
          <el-input-number 
            v-model="connectionForm.port" 
            :min="1" 
            :max="65535"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="connectionForm.username" 
            placeholder="请输入数据库用户名"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="connectionForm.password" 
            type="password" 
            show-password
            placeholder="请输入数据库密码"
          />
        </el-form-item>
      </template>

      <el-form-item 
        :label="connectionForm.type === 'sqlite' ? 'SQLite 文件' : '数据库名'" 
        prop="database"
      >
        <el-input 
          v-model="connectionForm.database" 
          :placeholder="connectionForm.type === 'sqlite' ? '选择 SQLite 数据库文件' : '请输入数据库名称'"
        >
          <template v-if="connectionForm.type === 'sqlite'" #append>
            <el-button @click="selectSqliteFile">
              <el-icon><Folder /></el-icon>
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="testConnection" 
          :loading="testLoading"
        >
          测试连接
        </el-button>
      </el-form-item>
    </el-form>

    <el-alert 
      v-if="connectionResult" 
      :type="connectionResult.success ? 'success' : 'error'"
      :closable="false"
      show-icon
    >
      {{ connectionResult.message }}
      <template v-if="connectionResult.details" #description>
        <div v-if="connectionResult.success">
          <p>数据库类型: {{ connectionForm.type }}</p>
          <p>主机地址: {{ connectionForm.host }}</p>
          <p>端口号: {{ connectionForm.port }}</p>
          <p>版本信息: {{ connectionResult.details.version }}</p>
        </div>
        <div v-else>
          <p>错误详情: {{ connectionResult.details.errorMessage }}</p>
        </div>
      </template>
    </el-alert>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { testDatabaseConnection, getSupportedDatabaseTypes } from '@/api/databaseTest'
import { encrypt } from '@/utils/crypto'

const connectionFormRef = ref(null)
const databaseTypes = ref([])
const testLoading = ref(false)
const connectionResult = ref(null)

const connectionForm = reactive({
  type: null,
  host: '',
  port: null,
  username: '',
  password: '',
  database: ''
})

const connectionRules = {
  type: [{ required: true, message: '请选择数据库类型', trigger: 'change' }],
  host: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  database: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }]
}

const handleDatabaseTypeChange = (type) => {
  // 重置端口为默认值
  const selectedType = databaseTypes.value.find(t => t.type === type)
  connectionForm.port = selectedType?.defaultPort || null

  // SQLite 特殊处理
  if (type === 'sqlite') {
    delete connectionRules.host
    delete connectionRules.port
    delete connectionRules.username
    delete connectionRules.password
  } else {
    connectionRules.host = [{ required: true, message: '请输入主机地址', trigger: 'blur' }]
    connectionRules.port = [{ required: true, message: '请输入端口号', trigger: 'blur' }]
    connectionRules.username = [{ required: true, message: '请输入用户名', trigger: 'blur' }]
    connectionRules.password = [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }
}

const selectSqliteFile = () => {
  // 实现文件选择逻辑
  console.log('选择 SQLite 文件')
}

const testConnection = async () => {
  try {
    await connectionFormRef.value.validate()
    testLoading.value = true

    const formData = { ...connectionForm }
    formData.password = encrypt(formData.password)

    const result = await testDatabaseConnection(formData)
    connectionResult.value = result
    
    if (result.success) {
      ElMessage.success('数据库连接测试成功')
    } else {
      ElMessage.error('数据库连接测试失败')
    }
  } catch (error) {
    ElMessage.error('连接测试验证失败')
  } finally {
    testLoading.value = false
  }
}

onMounted(async () => {
  try {
    const response = await getSupportedDatabaseTypes()
    databaseTypes.value = response.databaseTypes
  } catch (error) {
    ElMessage.error('获取数据库类型失败')
  }
})
</script>

<style scoped>
.database-connection-test {
  max-width: 600px;
}

.database-type-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.database-type-option i {
  font-size: 20px;
}
</style>
