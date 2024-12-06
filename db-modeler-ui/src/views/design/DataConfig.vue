<template>
  <div class="data-config">
    <a-card title="数据库连接配置" :bordered="false">
      <a-form
        :model="formState"
        layout="vertical"
        :rules="rules"
        ref="formRef"
      >
        <a-form-item label="数据库类型" name="dbType">
          <a-select
            v-model:value="formState.dbType"
            placeholder="请选择数据库类型"
            style="width: 200px"
          >
            <a-select-option value="mysql">MySQL</a-select-option>
            <a-select-option value="postgresql">PostgreSQL</a-select-option>
            <a-select-option value="oracle">Oracle</a-select-option>
            <a-select-option value="sqlserver">SQL Server</a-select-option>
          </a-select>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="主机地址" name="host">
              <a-input
                v-model:value="formState.host"
                placeholder="例如：localhost 或 IP地址"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="端口" name="port">
              <a-input
                v-model:value="formState.port"
                placeholder="例如：3306"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数据库名" name="database">
              <a-input
                v-model:value="formState.database"
                placeholder="请输入数据库名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="字符集" name="charset">
              <a-select
                v-model:value="formState.charset"
                placeholder="请选择字符集"
              >
                <a-select-option value="utf8mb4">UTF-8</a-select-option>
                <a-select-option value="latin1">Latin1</a-select-option>
                <a-select-option value="gbk">GBK</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="用户名" name="username">
              <a-input
                v-model:value="formState.username"
                placeholder="请输入数据库用户名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码" name="password">
              <a-input-password
                v-model:value="formState.password"
                placeholder="请输入数据库密码"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-space>
            <a-button type="primary" @click="testConnection" :loading="testing">
              测试连接
            </a-button>
            <a-button type="primary" @click="saveConfig" :loading="saving">
              保存配置
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card title="连接历史" :bordered="false" style="margin-top: 24px">
      <a-table
        :columns="historyColumns"
        :data-source="connectionHistory"
        :pagination="false"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" @click="loadConfig(record)">加载</a-button>
              <a-popconfirm
                title="确定要删除这条连接记录吗？"
                @confirm="deleteHistory(record)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === 'success' ? 'success' : 'error'">
              {{ record.status === 'success' ? '成功' : '失败' }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useGlobalStore } from '../../stores/global'
import { storeToRefs } from 'pinia'

const globalStore = useGlobalStore()
const { currentProject } = storeToRefs(globalStore)

const formRef = ref<FormInstance>()
const testing = ref(false)
const saving = ref(false)

interface FormState {
  dbType: string
  host: string
  port: string
  database: string
  charset: string
  username: string
  password: string
}

const formState = reactive<FormState>({
  dbType: '',
  host: '',
  port: '',
  database: '',
  charset: 'utf8mb4',
  username: '',
  password: ''
})

const rules = {
  dbType: [{ required: true, message: '请选择数据库类型' }],
  host: [{ required: true, message: '请输入主机地址' }],
  port: [{ required: true, message: '请输入端口号' }],
  database: [{ required: true, message: '请输入数据库名' }],
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
}

const historyColumns = [
  { title: '数据库类型', dataIndex: 'dbType', key: 'dbType' },
  { title: '主机地址', dataIndex: 'host', key: 'host' },
  { title: '数据库名', dataIndex: 'database', key: 'database' },
  { title: '最后连接时间', dataIndex: 'lastConnected', key: 'lastConnected' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作', key: 'action' }
]

const connectionHistory = ref([
  {
    key: '1',
    dbType: 'MySQL',
    host: 'localhost',
    database: 'test_db',
    lastConnected: '2024-01-01 12:00:00',
    status: 'success'
  }
])

const testConnection = async () => {
  try {
    await formRef.value?.validate()
    testing.value = true
    // TODO: 实现实际的连接测试逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('连接成功')
  } catch (error) {
    console.error('连接测试失败:', error)
    message.error('连接失败，请检查配置')
  } finally {
    testing.value = false
  }
}

const saveConfig = async () => {
  try {
    await formRef.value?.validate()
    saving.value = true
    // TODO: 实现实际的保存配置逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('保存成功')
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存失败，请检查输入')
  } finally {
    saving.value = false
  }
}

const loadConfig = (record: any) => {
  Object.assign(formState, {
    dbType: record.dbType.toLowerCase(),
    host: record.host,
    database: record.database
  })
  message.success('配置已加载')
}

const deleteHistory = (record: any) => {
  connectionHistory.value = connectionHistory.value.filter(item => item.key !== record.key)
  message.success('删除成功')
}

onMounted(() => {
  console.log('DataConfig mounted, current project:', currentProject.value)
  // TODO: 加载已保存的配置
})
</script>

<style scoped>
.data-config {
  padding: 24px;
  background: #f0f2f5;
  min-height: 100%;
}

:deep(.ant-card) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

:deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}
</style>
