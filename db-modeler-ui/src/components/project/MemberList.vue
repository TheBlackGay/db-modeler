<template>
  <div class="member-list">
    <div class="member-header">
      <h3>项目成员</h3>
      <el-button type="primary" @click="showAddMemberDialog">
        添加成员
      </el-button>
    </div>
    
    <el-table :data="members" style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-tag :type="getRoleTagType(row.role)">
            {{ getRoleName(row.role) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            v-if="canManageMembers"
            type="primary"
            link
            @click="showEditMemberDialog(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="canManageMembers"
            type="danger"
            link
            @click="confirmRemoveMember(row)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 成员管理对话框 -->
    <el-dialog
      :title="selectedMember ? '编辑成员' : '添加成员'"
      v-model="memberDialog"
      width="500px"
    >
      <el-form
        ref="memberFormRef"
        :model="memberForm"
        :rules="memberRules"
        label-width="80px"
      >
        <el-form-item label="用户" prop="userId" v-if="!selectedMember">
          <el-select
            v-model="memberForm.userId"
            filterable
            remote
            :remote-method="searchUsers"
            :loading="loading"
            placeholder="请输入用户名搜索"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.username"
              :value="user.id"
            >
              <span>{{ user.username }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">
                {{ user.email }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="memberForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="ADMIN" />
            <el-option label="成员" value="MEMBER" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="memberDialog = false">取消</el-button>
          <el-button type="primary" @click="submitMemberForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ProjectMemberDTO, UserDTO } from '@/types/member'
import {
  getProjectMembers,
  addProjectMember,
  updateMemberRole,
  removeProjectMember,
  searchUsers as searchUsersApi
} from '@/api/member'

const props = defineProps<{
  projectId: string
}>()

// 成员列表数据
const members = ref<ProjectMemberDTO[]>([])
const memberDialog = ref(false)
const memberFormRef = ref()
const memberForm = ref({
  userId: '',
  role: 'MEMBER'
})
const memberRules = {
  userId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}
const selectedMember = ref<ProjectMemberDTO | null>(null)
const userOptions = ref<UserDTO[]>([])
const loading = ref(false)

// 获取成员列表
const fetchMembers = async () => {
  try {
    const response = await getProjectMembers(props.projectId)
    members.value = response.data
  } catch (error) {
    ElMessage.error('获取成员列表失败')
  }
}

// 搜索用户
const searchUsers = async (query: string) => {
  if (query) {
    loading.value = true
    try {
      const response = await searchUsersApi(query)
      userOptions.value = response.data
    } catch (error) {
      ElMessage.error('搜索用户失败')
    } finally {
      loading.value = false
    }
  } else {
    userOptions.value = []
  }
}

// 显示添加成员对话框
const showAddMemberDialog = () => {
  selectedMember.value = null
  memberForm.value = {
    userId: '',
    role: 'MEMBER'
  }
  memberDialog.value = true
}

// 显示编辑成员对话框
const showEditMemberDialog = (member: ProjectMemberDTO) => {
  selectedMember.value = member
  memberForm.value = {
    userId: member.userId,
    role: member.role
  }
  memberDialog.value = true
}

// 确认移除成员
const confirmRemoveMember = (member: ProjectMemberDTO) => {
  ElMessageBox.confirm(
    `确定要移除成员 ${member.username} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    removeMember(member)
  })
}

// 移除成员
const removeMember = async (member: ProjectMemberDTO) => {
  try {
    await removeProjectMember(props.projectId, member.userId)
    ElMessage.success('移除成员成功')
    fetchMembers()
  } catch (error) {
    ElMessage.error('移除成员失败')
  }
}

// 提交成员表单
const submitMemberForm = async () => {
  if (!memberFormRef.value) return
  
  await memberFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (selectedMember.value) {
          // 更新成员
          await updateMemberRole(
            props.projectId,
            selectedMember.value.userId,
            { role: memberForm.value.role }
          )
          ElMessage.success('更新成员成功')
        } else {
          // 添加成员
          await addProjectMember(props.projectId, {
            userId: memberForm.value.userId,
            role: memberForm.value.role
          })
          ElMessage.success('添加成员成功')
        }
        memberDialog.value = false
        fetchMembers()
      } catch (error) {
        ElMessage.error(selectedMember.value ? '更新成员失败' : '添加成员失败')
      }
    }
  })
}

// 获取角色标签类型
const getRoleTagType = (role: string) => {
  const types: Record<string, string> = {
    OWNER: 'danger',
    ADMIN: 'warning',
    MEMBER: 'success'
  }
  return types[role] || 'info'
}

// 获取角色名称
const getRoleName = (role: string) => {
  const names: Record<string, string> = {
    OWNER: '拥有者',
    ADMIN: '管理员',
    MEMBER: '成员'
  }
  return names[role] || role
}

// 判断是否可以管理成员
const canManageMembers = computed(() => {
  // TODO: 根据当前用户权限判断是否可以管理成员
  return true
})

onMounted(() => {
  fetchMembers()
})
</script>

<style scoped>
.member-list {
  padding: 20px;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.member-header h3 {
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
