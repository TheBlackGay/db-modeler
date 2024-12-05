<template>
  <div class="tenant-selector">
    <a-select
      v-model:value="selectedTenantId"
      :loading="loading"
      placeholder="请选择租户"
      style="width: 200px"
      @change="handleTenantSelect"
    >
      <a-select-option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
        {{ tenant.name }}
      </a-select-option>
    </a-select>
    <a-button type="primary" @click="showCreateModal" style="margin-left: 16px">
      创建租户
    </a-button>

    <a-modal
      v-model:visible="modalVisible"
      title="创建租户"
      @ok="handleCreateTenant"
      @cancel="handleCancel"
      :confirmLoading="creating"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
      >
        <a-form-item label="租户名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { Tenant } from '../api/tenant'
import { tenantApi } from '../api/tenant'
import { useGlobalStore } from '../stores/global'

const globalStore = useGlobalStore()
const tenants = ref<Tenant[]>([])
const loading = ref(false)
const creating = ref(false)
const modalVisible = ref(false)
const selectedTenantId = ref<string | null>(globalStore.currentTenant?.id || null)

const formRef = ref<FormInstance>()
const formState = ref({
  name: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入租户名称' }]
}

const loadTenants = async () => {
  loading.value = true
  try {
    const response = await tenantApi.getTenants()
    tenants.value = response.data
    // 如果有租户且没有选中的租户，自动选择第一个
    if (tenants.value.length > 0 && !selectedTenantId.value) {
      selectedTenantId.value = tenants.value[0].id
      globalStore.setCurrentTenant(tenants.value[0])
    }
  } catch (error) {
    message.error('加载租户列表失败')
  } finally {
    loading.value = false
  }
}

const handleTenantSelect = async (tenantId: string) => {
  const tenant = tenants.value.find(t => t.id === tenantId)
  if (tenant) {
    globalStore.setCurrentTenant(tenant)
    selectedTenantId.value = tenantId
  }
}

const showCreateModal = () => {
  modalVisible.value = true
  formState.value = {
    name: '',
    description: ''
  }
}

const handleCancel = () => {
  modalVisible.value = false
}

const handleCreateTenant = async () => {
  try {
    await formRef.value?.validate()
    creating.value = true
    const response = await tenantApi.createTenant(formState.value)
    message.success('创建成功')
    modalVisible.value = false
    await loadTenants()
    // 自动选择新创建的租户
    handleTenantSelect(response.data.id)
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    } else {
      message.error('创建失败')
    }
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  loadTenants()
})
</script>

<style scoped>
.tenant-selector {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
</style>
