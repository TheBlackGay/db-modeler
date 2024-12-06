<template>
  <div class="collaboration">
    <div class="section">
      <h2>团队成员</h2>
      <a-card>
        <template #extra>
          <a-button type="primary" @click="showInviteModal">
            <template #icon><user-add-outlined /></template>
            邀请成员
          </a-button>
        </template>
        <a-table
          :columns="memberColumns"
          :dataSource="members"
          :pagination="false"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="link" @click="changeRole(record)">修改角色</a-button>
                <a-button type="link" danger @click="removeMember(record)">移除</a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
    </div>

    <div class="section">
      <h2>操作历史</h2>
      <a-card>
        <a-timeline>
          <a-timeline-item v-for="activity in activities" :key="activity.id">
            <template #dot>
              <template v-if="activity.type === 'create'">
                <plus-circle-outlined style="color: #52c41a" />
              </template>
              <template v-else-if="activity.type === 'update'">
                <edit-outlined style="color: #1890ff" />
              </template>
              <template v-else>
                <delete-outlined style="color: #ff4d4f" />
              </template>
            </template>
            <div class="activity-content">
              <div class="activity-user">{{ activity.user }}</div>
              <div class="activity-action">{{ activity.action }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </a-card>
    </div>

    <!-- 邀请成员弹窗 -->
    <a-modal
      v-model:visible="inviteModalVisible"
      title="邀请成员"
      @ok="handleInvite"
    >
      <a-form :model="inviteForm" layout="vertical">
        <a-form-item label="邮箱">
          <a-input v-model:value="inviteForm.email" placeholder="请输入邮箱地址" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="inviteForm.role" placeholder="请选择角色">
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="editor">编辑者</a-select-option>
            <a-select-option value="viewer">查看者</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  UserAddOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 成员列表
const memberColumns = [
  {
    title: '成员',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: '加入时间',
    dataIndex: 'joinTime',
    key: 'joinTime',
  },
  {
    title: '操作',
    key: 'action',
  }
]

// 模拟数据
const members = ref([
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    joinTime: '2023-01-01'
  }
])

const activities = ref([
  {
    id: '1',
    type: 'create',
    user: '张三',
    action: '创建了表 users',
    time: '2023-05-20 14:30'
  },
  {
    id: '2',
    type: 'update',
    user: '李四',
    action: '修改了表 orders 的结构',
    time: '2023-05-20 15:45'
  }
])

const inviteModalVisible = ref(false)
const inviteForm = ref({
  email: '',
  role: ''
})

const showInviteModal = () => {
  inviteModalVisible.value = true
}

const handleInvite = async () => {
  try {
    // TODO: 实现邀请成员逻辑
    message.success('邀请已发送')
    inviteModalVisible.value = false
  } catch (error) {
    message.error('邀请失败')
  }
}

const changeRole = (record: any) => {
  // TODO: 实现修改角色功能
}

const removeMember = (record: any) => {
  // TODO: 实现移除成员功能
}
</script>

<style scoped>
.collaboration {
  max-width: 1000px;
  margin: 0 auto;
}

.section {
  margin-bottom: 24px;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.activity-user {
  font-weight: 500;
}

.activity-time {
  color: #999;
}
</style>
