<template>
  <div class="data-mapping-collaboration-manager">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>协作成员管理</span>
          <el-button 
            type="primary" 
            size="small" 
            @click="showInviteDialog"
            :icon="Plus"
          >
            邀请成员
          </el-button>
        </div>
      </template>

      <el-table 
        :data="collaborators" 
        stripe 
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column 
          label="用户" 
          width="250"
        >
          <template #default="{ row }">
            <div class="user-info">
              <el-avatar 
                :size="32" 
                :src="row.user.avatar"
              />
              <div class="user-details">
                <span>{{ row.user.username }}</span>
                <small>{{ row.user.email }}</small>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          prop="role" 
          label="角色" 
          width="120"
        >
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          prop="status" 
          label="状态" 
          width="120"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          prop="permissions" 
          label="权限" 
          width="200"
        >
          <template #default="{ row }">
            <el-tag 
              v-for="(value, key) in row.permissions" 
              :key="key"
              :type="value ? 'success' : 'info'"
              size="small"
              class="permission-tag"
            >
              {{ getPermissionLabel(key) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column 
          label="操作" 
          width="250"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small" 
                @click="editPermissions(row)"
                :icon="Edit"
                :disabled="!canManagePermissions(row)"
              >
                编辑权限
              </el-button>
              <el-button 
                type="warning" 
                size="small" 
                @click="removeCollaborator(row)"
                :icon="Delete"
                :disabled="!canRemoveCollaborator(row)"
              >
                移除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="fetchCollaborators"
        @current-change="fetchCollaborators"
      />
    </el-card>

    <!-- 邀请成员对话框 -->
    <el-dialog 
      v-model="inviteDialogVisible" 
      title="邀请协作成员" 
      width="500px"
    >
      <el-form 
        ref="inviteFormRef"
        :model="inviteForm" 
        :rules="inviteFormRules"
        label-width="100px"
      >
        <el-form-item 
          label="邮箱" 
          prop="email"
        >
          <el-input 
            v-model="inviteForm.email" 
            placeholder="请输入协作者邮箱"
          />
        </el-form-item>

        <el-form-item 
          label="用户名" 
          prop="username"
        >
          <el-input 
            v-model="inviteForm.username" 
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item 
          label="角色" 
          prop="role"
        >
          <el-select 
            v-model="inviteForm.role" 
            placeholder="选择角色"
          >
            <el-option 
              v-for="role in roleOptions" 
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="inviteDialogVisible = false">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="submitInvite"
          :loading="inviteLoading"
        >
          发送邀请
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑权限对话框 -->
    <el-dialog 
      v-model="permissionDialogVisible" 
      title="编辑协作成员权限" 
      width="500px"
    >
      <el-form 
        ref="permissionFormRef"
        :model="permissionForm" 
        label-width="120px"
      >
        <el-form-item label="权限设置">
          <el-checkbox-group v-model="permissionForm.permissions">
            <el-checkbox 
              v-for="(label, key) in permissionOptions" 
              :key="key"
              :label="key"
            >
              {{ label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="permissionDialogVisible = false">
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="savePermissions"
          :loading="permissionLoading"
        >
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
  ElMessage, 
  ElMessageBox 
} from 'element-plus'
import { 
  Plus, 
  Edit, 
  Delete 
} from '@element-plus/icons-vue'
import dataMappingCollaborationApi from '@/api/dataMappingCollaborationApi'

const props = defineProps({
  mappingConfigId: {
    type: String,
    required: true
  }
})

const collaborators = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const inviteDialogVisible = ref(false)
const inviteForm = ref({
  email: '',
  username: '',
  role: 'viewer'
})
const inviteFormRef = ref(null)
const inviteLoading = ref(false)

const permissionDialogVisible = ref(false)
const permissionForm = ref({
  collaborationId: null,
  permissions: []
})
const permissionFormRef = ref(null)
const permissionLoading = ref(false)

const roleOptions = [
  { label: '查看者', value: 'viewer' },
  { label: '编辑者', value: 'editor' },
  { label: '所有者', value: 'owner' }
]

const permissionOptions = {
  edit: '编辑',
  comment: '评论',
  view: '查看'
}

const inviteFormRules = {
  email: [
    { 
      required: true, 
      message: '请输入邮箱', 
      trigger: 'blur' 
    },
    { 
      type: 'email', 
      message: '请输入正确的邮箱地址', 
      trigger: 'blur' 
    }
  ],
  username: [
    { 
      required: true, 
      message: '请输入用户名', 
      trigger: 'blur' 
    }
  ],
  role: [
    { 
      required: true, 
      message: '请选择角色', 
      trigger: 'change' 
    }
  ]
}

const fetchCollaborators = async () => {
  loading.value = true
  try {
    const response = await dataMappingCollaborationApi.getCollaborators(
      props.mappingConfigId, 
      { 
        page: currentPage.value, 
        pageSize: pageSize.value 
      }
    )
    collaborators.value = response.data.collaborators
    total.value = response.data.total
  } catch (error) {
    ElMessage.error('获取协作成员失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const showInviteDialog = () => {
  inviteDialogVisible.value = true
  inviteForm.value = {
    email: '',
    username: '',
    role: 'viewer'
  }
}

const submitInvite = async () => {
  const formRef = inviteFormRef.value
  if (!formRef) return

  try {
    await formRef.validate()
    inviteLoading.value = true

    await dataMappingCollaborationApi.inviteCollaborator(
      props.mappingConfigId, 
      inviteForm.value
    )

    ElMessage.success('邀请发送成功')
    inviteDialogVisible.value = false
    fetchCollaborators()
  } catch (error) {
    ElMessage.error('邀请发送失败：' + error.message)
  } finally {
    inviteLoading.value = false
  }
}

const editPermissions = (row) => {
  permissionForm.value = {
    collaborationId: row.id,
    permissions: Object.keys(row.permissions).filter(
      key => row.permissions[key]
    )
  }
  permissionDialogVisible.value = true
}

const savePermissions = async () => {
  try {
    permissionLoading.value = true
    await dataMappingCollaborationApi.updateCollaboratorPermissions(
      permissionForm.value.collaborationId,
      {
        edit: permissionForm.value.permissions.includes('edit'),
        comment: permissionForm.value.permissions.includes('comment'),
        view: permissionForm.value.permissions.includes('view')
      }
    )

    ElMessage.success('权限更新成功')
    permissionDialogVisible.value = false
    fetchCollaborators()
  } catch (error) {
    ElMessage.error('权限更新失败：' + error.message)
  } finally {
    permissionLoading.value = false
  }
}

const removeCollaborator = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要移除 ${row.user.username} 吗？`, 
      '移除协作成员', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await dataMappingCollaborationApi.removeCollaborator(row.id)
    ElMessage.success('移除成员成功')
    fetchCollaborators()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('移除成员失败：' + error.message)
    }
  }
}

const getRoleType = (role) => {
  const roleTypeMap = {
    'owner': 'danger',
    'editor': 'warning',
    'viewer': 'info'
  }
  return roleTypeMap[role] || 'info'
}

const getRoleLabel = (role) => {
  const roleLabelMap = {
    'owner': '所有者',
    'editor': '编辑者',
    'viewer': '查看者'
  }
  return roleLabelMap[role] || role
}

const getStatusType = (status) => {
  const statusTypeMap = {
    'active': 'success',
    'pending': 'warning',
    'invited': 'info',
    'declined': 'danger'
  }
  return statusTypeMap[status] || 'info'
}

const getStatusLabel = (status) => {
  const statusLabelMap = {
    'active': '活跃',
    'pending': '待定',
    'invited': '已邀请',
    'declined': '已拒绝'
  }
  return statusLabelMap[status] || status
}

const getPermissionLabel = (key) => {
  return permissionOptions[key] || key
}

const canManagePermissions = (row) => {
  return row.role !== 'owner'
}

const canRemoveCollaborator = (row) => {
  return row.role !== 'owner'
}

onMounted(() => {
  fetchCollaborators()
})
</script>

<style scoped>
.data-mapping-collaboration-manager {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .user-details {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.user-details small {
  color: #999;
  font-size: 12px;
}

.permission-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
