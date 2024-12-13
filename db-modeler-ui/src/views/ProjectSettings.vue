<template>
  <div class="project-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>项目设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 基本信息设置 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="basicFormRef"
            :model="basicForm"
            :rules="basicRules"
            label-width="100px"
          >
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="basicForm.name" placeholder="请输入项目名称" />
            </el-form-item>

            <el-form-item label="项目描述" prop="description">
              <el-input
                v-model="basicForm.description"
                type="textarea"
                :rows="3"
                placeholder="请输入项目描述"
              />
            </el-form-item>

            <el-form-item label="项目状态" prop="status">
              <el-select v-model="basicForm.status" placeholder="请选择项目状态">
                <el-option label="活跃" value="ACTIVE" />
                <el-option label="归档" value="ARCHIVED" />
                <el-option label="已删除" value="DELETED" />
              </el-select>
            </el-form-item>

            <el-form-item label="项目图标" prop="icon">
              <el-upload
                class="avatar-uploader"
                action="/api/files/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="basicForm.icon" :src="basicForm.icon" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <div class="el-upload__tip">
                支持 jpg、png 格式，大小不超过 2MB
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitBasicForm">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 数据库配置 -->
        <el-tab-pane label="数据库配置" name="database">
          <el-form
            ref="dbFormRef"
            :model="dbForm"
            :rules="dbRules"
            label-width="100px"
          >
            <el-form-item label="数据库类型" prop="type">
              <el-select v-model="dbForm.type" placeholder="请选择数据库类型">
                <el-option label="MySQL" value="mysql" />
                <el-option label="PostgreSQL" value="postgresql" />
              </el-select>
            </el-form-item>

            <el-form-item label="主机地址" prop="host">
              <el-input v-model="dbForm.host" placeholder="请输入主机地址" />
            </el-form-item>

            <el-form-item label="端口" prop="port">
              <el-input-number v-model="dbForm.port" :min="1" :max="65535" />
            </el-form-item>

            <el-form-item label="数据库名" prop="databaseName">
              <el-input v-model="dbForm.databaseName" placeholder="请输入数据库名" />
            </el-form-item>

            <el-form-item label="用户名" prop="username">
              <el-input v-model="dbForm.username" placeholder="请输入用户名" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="dbForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitDbForm">保存配置</el-button>
              <el-button @click="testConnection">测试连接</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getProjectById, updateProject } from '@/api/project'
import { getDatabaseConfig, createDatabaseConfig, updateDatabaseConfig, testDatabaseConnection } from '@/api/database'
import type { Project } from '@/types/project'
import type { DatabaseConfig } from '@/types/database'
import type { UploadProps } from 'element-plus'

const route = useRoute()
const projectId = route.params.id as string

// 当前激活的标签页
const activeTab = ref('basic')

// 基本信息表单
const basicFormRef = ref()
const basicForm = ref({
  name: '',
  description: '',
  status: 'ACTIVE',
  icon: ''
})

const basicRules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 500, message: '不能超过 500 个字符', trigger: 'blur' }
  ]
}

// 数据库配置表单
const dbFormRef = ref()
const dbForm = ref({
  type: 'mysql',
  host: '',
  port: 3306,
  databaseName: '',
  username: '',
  password: ''
})

const dbRules = {
  type: [{ required: true, message: '请选择数据库类型', trigger: 'change' }],
  host: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  databaseName: [{ required: true, message: '请输入数据库名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 获取项目信息
const fetchProjectInfo = async () => {
  try {
    const { data: response } = await getProjectById(projectId)
    if (response.code === 0 && response.data) {
      const project = response.data
      basicForm.value = {
        name: project.name,
        description: project.description || '',
        status: project.status,
        icon: project.icon || ''
      }
    } else {
      throw new Error(response.message || '获取项目信息失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取项目信息失败')
  }
}

// 获取数据库配置
const fetchDatabaseConfig = async () => {
  try {
    const config = await getDatabaseConfig(projectId)
    if (config) {
      dbForm.value = {
        type: config.type,
        host: config.host,
        port: config.port,
        databaseName: config.databaseName,
        username: config.username,
        password: '' // 出于安全考虑，不显示密码
      }
    }
  } catch (error) {
    // 如果没有配置，不显示错误
    console.log('No database config found')
  }
}

// 处理图片上传
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  basicForm.value.icon = response.url
  ElMessage.success('上传成功')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('只能上传 JPG/PNG 格式的图片！')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
  }

  return isJPG && isLt2M
}

// 提交表单
const submitBasicForm = async () => {
  try {
    await basicFormRef.value.validate()
    const { data: response } = await updateProject(projectId, {
      name: basicForm.value.name,
      description: basicForm.value.description,
      status: basicForm.value.status,
      tenantId: currentTenant.value.id
    })
    
    if (response.code === 0) {
      ElMessage.success('保存成功')
    } else {
      throw new Error(response.message || '保存失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const submitDbForm = async () => {
  if (!dbFormRef.value) return
  await dbFormRef.value.validate((valid: boolean) => {
    if (valid) {
      createDatabaseConfig(dbForm.value)
        .then(() => {
          ElMessage.success('保存成功')
        })
        .catch((error) => {
          ElMessage.error(error.message || '保存失败')
        })
    }
  })
}

// 测试数据库连接
const testConnection = async () => {
  if (!dbFormRef.value) return
  await dbFormRef.value.validate((valid: boolean) => {
    if (valid) {
      testDatabaseConnection(dbForm.value)
        .then((response) => {
          if (response.success) {
            ElMessage.success('连接成功')
          } else {
            ElMessage.error('连接失败')
          }
        })
        .catch((error) => {
          ElMessage.error(error.message || '连接失败')
        })
    }
  })
}

// 组件挂载时获取数据
onMounted(() => {
  fetchProjectInfo()
  fetchDatabaseConfig()
})
</script>

<style scoped>
.project-settings {
  padding: 20px;
}

.settings-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.el-upload__tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>
