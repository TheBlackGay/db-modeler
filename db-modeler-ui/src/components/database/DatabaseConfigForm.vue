&lt;template>
  &lt;el-dialog
    :title="config ? '编辑数据库配置' : '添加数据库配置'"
    v-model="visible"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    &lt;el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      @submit.prevent
    >
      &lt;el-form-item label="名称" prop="name">
        &lt;el-input v-model="form.name" placeholder="请输入配置名称" />
      &lt;/el-form-item>

      &lt;el-form-item label="描述" prop="description">
        &lt;el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入配置描述"
        />
      &lt;/el-form-item>

      &lt;el-form-item label="数据库类型" prop="type">
        &lt;el-select v-model="form.type" placeholder="请选择数据库类型">
          &lt;el-option label="MySQL" value="MYSQL" />
          &lt;el-option label="PostgreSQL" value="POSTGRESQL" />
        &lt;/el-select>
      &lt;/el-form-item>

      &lt;el-form-item label="主机" prop="host">
        &lt;el-input v-model="form.host" placeholder="请输入主机地址" />
      &lt;/el-form-item>

      &lt;el-form-item label="端口" prop="port">
        &lt;el-input-number
          v-model="form.port"
          :min="1"
          :max="65535"
          placeholder="请输入端口号"
        />
      &lt;/el-form-item>

      &lt;el-form-item label="数据库名" prop="databaseName">
        &lt;el-input v-model="form.databaseName" placeholder="请输入数据库名" />
      &lt;/el-form-item>

      &lt;el-form-item label="用户名" prop="username">
        &lt;el-input v-model="form.username" placeholder="请输入用户名" />
      &lt;/el-form-item>

      &lt;el-form-item label="密码" prop="password">
        &lt;el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      &lt;/el-form-item>
    &lt;/el-form>

    &lt;template #footer>
      &lt;el-button @click="visible = false">取消&lt;/el-button>
      &lt;el-button type="primary" @click="handleSubmit" :loading="loading">
        确定
      &lt;/el-button>
    &lt;/template>
  &lt;/el-dialog>
&lt;/template>

&lt;script setup lang="ts">
import { ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { DatabaseConfig, DatabaseConfigForm } from '@/types/database'
import { createDatabaseConfig, updateDatabaseConfig } from '@/api/database'
import { handleApiError } from '@/utils/error'

const props = defineProps<{
  visible: boolean
  config: DatabaseConfig | null
  projectId: string
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
}>()

const formRef = ref&lt;FormInstance>()
const loading = ref(false)
const visible = ref(props.visible)

const defaultForm: DatabaseConfigForm = {
  projectId: props.projectId,
  name: '',
  description: '',
  type: 'MYSQL',
  host: '',
  port: 3306,
  databaseName: '',
  username: '',
  password: ''
}

const form = ref&lt;DatabaseConfigForm>({ ...defaultForm })

const rules = {
  name: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    { max: 100, message: '配置名称不能超过100个字符', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '描述不能超过500个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择数据库类型', trigger: 'change' }
  ],
  host: [
    { required: true, message: '请输入主机地址', trigger: 'blur' },
    { max: 255, message: '主机地址不能超过255个字符', trigger: 'blur' }
  ],
  port: [
    { required: true, message: '请输入端口号', trigger: 'blur' },
    { type: 'number', min: 1, max: 65535, message: '端口号必须在1-65535之间', trigger: 'blur' }
  ],
  databaseName: [
    { required: true, message: '请输入数据库名', trigger: 'blur' },
    { max: 100, message: '数据库名不能超过100个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 100, message: '用户名不能超过100个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { max: 255, message: '密码不能超过255个字符', trigger: 'blur' }
  ]
}

watch(
  () => props.visible,
  (val) => {
    visible.value = val
  }
)

watch(
  () => visible.value,
  (val) => {
    emit('update:visible', val)
  }
)

watch(
  () => props.config,
  (val) => {
    if (val) {
      form.value = { ...val }
    } else {
      form.value = { ...defaultForm }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (props.config) {
      await updateDatabaseConfig(props.projectId, props.config.id!, form.value)
      ElMessage.success('更新成功')
    } else {
      await createDatabaseConfig(props.projectId, form.value)
      ElMessage.success('创建成功')
    }
    emit('submit')
    visible.value = false
  } catch (error: any) {
    handleApiError(error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  formRef.value?.resetFields()
}
&lt;/script>
