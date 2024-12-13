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
        <a-form-item label="租户代码" name="code">
          <a-input v-model:value="formState.code" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="formState.description" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import type { Tenant } from '../api/tenant'
import { tenantApi } from '../api/tenant'
import { useGlobalStore } from '../stores/global'
import { ApiResponseUtil } from '../types/api'

const globalStore = useGlobalStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const creating = ref(false)
const modalVisible = ref(false)
const tenants = ref<Tenant[]>([])
const selectedTenantId = ref<string>('')

const formState = ref({
  name: '',
  code: '',
  description: ''
})

const rules = {
  name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入租户代码', trigger: 'blur' }]
}

const loadTenants = async () => {
  loading.value = true
  try {
    const response = await tenantApi.getTenants()
    console.log('Tenant API response:', response)
    
    const tenantList = ApiResponseUtil.getListData(response)
    if (tenantList.length > 0) {
      tenants.value = tenantList
      console.log('Loaded tenants:', tenants.value)
    } else {
      console.warn('No tenants found')
      tenants.value = []
    }
  } catch (error) {
    console.error('Failed to load tenants:', error)
    message.error('加载租户列表失败：' + ApiResponseUtil.getErrorMessage(error))
    tenants.value = []
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['tenant-changed'])

const handleTenantSelect = async (tenantId: string) => {
  const selectedTenant = tenants.value.find(tenant => tenant.id === tenantId)
  if (selectedTenant) {
    try {
      await globalStore.setCurrentTenant(selectedTenant)
      emit('tenant-changed', selectedTenant)
    } catch (error) {
      console.error('设置当前租户失败:', error)
      message.error('设置当前租户失败')
    }
  }
}

const showCreateModal = () => {
  formState.value = {
    name: '',
    code: '',
    description: ''
  }
  modalVisible.value = true
}

const handleCancel = () => {
  modalVisible.value = false
  formState.value = {
    name: '',
    code: '',
    description: ''
  }
}

const handleCreateTenant = async () => {
  try {
    await formRef.value?.validate()
    creating.value = true
    
    const response = await tenantApi.createTenant({
      name: formState.value.name,
      code: formState.value.code,
      description: formState.value.description
    })

    const newTenant = ApiResponseUtil.getData(response)
    if (newTenant) {
      message.success('创建租户成功')
      modalVisible.value = false
      await loadTenants()
      
      // 自动选择新创建的租户
      selectedTenantId.value = newTenant.id
      await handleTenantSelect(newTenant.id)
    } else {
      throw new Error('创建租户失败：返回数据格式错误')
    }
  } catch (error) {
    console.error('Failed to create tenant:', error)
    message.error('创建租户失败：' + ApiResponseUtil.getErrorMessage(error))
  } finally {
    creating.value = false
  }
}

onBeforeUnmount(() => {
  // 清理组件本地状态
  tenants.value = []
  selectedTenantId.value = ''
  modalVisible.value = false
  loading.value = false
  creating.value = false
  
  // 清理全局状态
  globalStore.clearState()
})

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
