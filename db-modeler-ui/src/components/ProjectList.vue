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
            <a-button type="link" @click="handleDesign(record)">设计</a-button>
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
import { ref, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import type { Project } from '../api/project'
import { projectApi } from '../api/project'
import { useGlobalStore } from '../stores/global'
import { storeToRefs } from 'pinia'

const router = useRouter()
console.log('Router:', router)
const globalStore = useGlobalStore()
const { projects, currentTenant } = storeToRefs(globalStore)

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

const loading = ref(false)
const modalVisible = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const currentProjectId = ref<string>('')
const formState = ref({
  name: '',
  description: '',
  tenantId: currentTenant.value?.id
})

const rules = {
  name: [{ required: true, message: '请输入项目名称' }],
}

const loadProjects = async () => {
  if (!currentTenant.value?.id) {
    message.error('请先选择租户');
    return;
  }
  loading.value = true;
  try {
    await globalStore.loadProjectsForTenant(currentTenant.value.id);
    console.log('加载的项目:', projects.value);
  } catch (error) {
    message.error('加载项目列表失败');
  } finally {
    loading.value = false;
  }
};

const showCreateModal = () => {
  if (!currentTenant.value?.id) {
    message.error('请先选择租户')
    return
  }
  modalMode.value = 'create'
  formState.value = {
    name: '',
    description: '',
    tenantId: currentTenant.value.id
  }
  modalVisible.value = true
}

const handleEdit = (record: Project) => {
  modalMode.value = 'edit'
  currentProjectId.value = record.id
  formState.value = {
    name: record.name,
    description: record.description,
    tenantId: record.tenantId,
  }
  modalVisible.value = true
}

const handleDesign = (record: Project) => {
  globalStore.$patch((state) => {
    state.currentProject = record;
  });
  router.push({
    name: 'model',
    params: { id: record.id }
  });
};

const handleDelete = async (id: string) => {
  try {
    await projectApi.deleteProject(id);
    message.success('删除成功');
    // 重新加载项目列表
    await globalStore.loadProjectsForTenant(currentTenant.value?.id || '');
  } catch (error) {
    message.error('删除失败');
  }
}

const handleModalOk = async () => {
  try {
    if (modalMode.value === 'create') {
      // 获取当前租户 ID
      const tenantId = currentTenant.value?.id;
      if (!tenantId) {
        message.error('请先选择租户');
        return;
      }
      // 将租户 ID 添加到 formState
      const projectData = { ...formState.value, tenantId };
      await projectApi.createProject(projectData);
      message.success('创建成功');
    } else {
      if (!currentProjectId.value) {
        message.error('项目ID不存在');
        return;
      }
      await projectApi.updateProject(currentProjectId.value, formState.value);
      message.success('更新成功');
    }
    modalVisible.value = false;
    // 重新加载项目列表
    await globalStore.loadProjectsForTenant(currentTenant.value?.id || '');
  } catch (error) {
    message.error(modalMode.value === 'create' ? '创建失败' : '更新失败');
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
