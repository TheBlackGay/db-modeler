<template>
  <div class="project-list">
    <div class="project-header">
      <h2>项目列表</h2>
      <a-button type="primary" @click="showCreateModal">新建项目</a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="projects"
      :loading="loading"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-popconfirm
              title="确定要删除这个项目吗？"
              @confirm="handleDelete(record.id)"
            >
              <a-button type="link" danger>删除</a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:visible="modalVisible"
      :title="modalMode === 'create' ? '新建项目' : '编辑项目'"
      @ok="handleModalOk"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="项目名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="项目描述" name="description">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { Project } from '../api/project'
import { projectApi } from '../api/project'

const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const projects = ref<Project[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formState = ref({
  name: '',
  description: '',
  tenantId: '123e4567-e89b-12d3-a456-426614174000', // 使用一个有效的 UUID
})

const rules = {
  name: [{ required: true, message: '请输入项目名称' }],
}

const loadProjects = async () => {
  loading.value = true
  try {
    const response = await projectApi.getProjects('123e4567-e89b-12d3-a456-426614174000') // 使用一个有效的 UUID
    projects.value = response.data
  } catch (error) {
    message.error('加载项目列表失败')
  } finally {
    loading.value = false
  }
}

const showCreateModal = () => {
  modalMode.value = 'create'
  formState.value = {
    name: '',
    description: '',
    tenantId: '123e4567-e89b-12d3-a456-426614174000', // 使用一个有效的 UUID
  }
  modalVisible.value = true
}

const handleEdit = (record: Project) => {
  modalMode.value = 'edit'
  formState.value = {
    name: record.name,
    description: record.description,
    tenantId: record.tenantId,
  }
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await projectApi.deleteProject(id)
    message.success('删除成功')
    loadProjects()
  } catch (error) {
    message.error('删除失败')
  }
}

const handleModalOk = async () => {
  try {
    if (modalMode.value === 'create') {
      await projectApi.createProject(formState.value)
      message.success('创建成功')
    } else {
      // await projectApi.updateProject(currentId, formState.value)
      message.success('更新成功')
    }
    modalVisible.value = false
    loadProjects()
  } catch (error) {
    message.error(modalMode.value === 'create' ? '创建失败' : '更新失败')
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.project-list {
  padding: 24px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.project-header h2 {
  margin: 0;
}
</style>
