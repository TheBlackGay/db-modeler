<template>
  <div class="model-design">
    <ModelSidebar
      :table-list="tableList"
      :entity-list="entityList"
      @select="handleMenuSelect"
    />
    <ModelContent
      :current-data="currentData"
      @edit="handleEdit"
      @delete="handleDelete"
      @edit-field="handleEditField"
      @delete-field="handleDeleteField"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import ModelSidebar from './ModelSidebar.vue'
import ModelContent from './ModelContent.vue'
import { tableDesignApi } from '@/api/table-design'
import type { DataItem, Field } from '@/types/model'

const route = useRoute()
const router = useRouter()

const tableList = ref<DataItem[]>([])
const entityList = ref<DataItem[]>([])
const currentData = ref<DataItem | undefined>()

const handleMenuSelect = (key: string) => {
  if (key === 'home') {
    router.push({ name: 'modelHome' })
    return
  }

  const [type, id] = key.split('-')
  if (type === 'table') {
    const table = tableList.value.find(t => t.id === id)
    if (table) {
      currentData.value = table
      router.push({ name: 'tableDetail', params: { id } })
    }
  } else if (type === 'entity') {
    const entity = entityList.value.find(e => e.id === id)
    if (entity) {
      currentData.value = entity
      router.push({ name: 'entityDetail', params: { id } })
    }
  }
}

const handleEdit = () => {
  if (!currentData.value) return
  router.push({ 
    name: 'editModel',
    params: { id: currentData.value.id }
  })
}

const handleDelete = async () => {
  if (!currentData.value) return
  try {
    await tableDesignApi.delete(currentData.value.id)
    message.success('删除成功')
    await fetchData()
    router.push({ name: 'modelHome' })
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

const handleEditField = (field: Field) => {
  if (!currentData.value) return
  router.push({ 
    name: 'editField',
    params: { 
      modelId: currentData.value.id,
      fieldId: field.id
    }
  })
}

const handleDeleteField = async (field: Field) => {
  if (!currentData.value) return
  try {
    // TODO: 实现删除字段的 API
    message.success('删除字段成功')
    await fetchData()
  } catch (error) {
    console.error('删除字段失败:', error)
    message.error('删除字段失败')
  }
}

const fetchData = async () => {
  try {
    const response = await tableDesignApi.getList()
    console.log('API Response:', response)
    
    // 确保数据格式正确
    tableList.value = response.filter(item => item.type === 'table').map(item => ({
      id: item.id,
      name: item.name || '未命名表',
      type: 'table',
      comment: item.comment
    }))
    
    entityList.value = response.filter(item => item.type === 'entity').map(item => ({
      id: item.id,
      name: item.name || '未命名实体',
      type: 'entity',
      comment: item.comment
    }))
    
    // 如果有当前选中的ID，获取详细信息
    const { id } = route.params
    if (id) {
      const detail = await tableDesignApi.getDetail(id as string)
      currentData.value = detail
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    message.error('获取数据失败')
  }
}

const initSelectedKey = () => {
  const { id } = route.params
  if (id) {
    const table = tableList.value.find(t => t.id === id)
    if (table) {
      currentData.value = table
    } else {
      const entity = entityList.value.find(e => e.id === id)
      if (entity) {
        currentData.value = entity
      }
    }
  }
}

onMounted(() => {
  initSelectedKey()
  fetchData()
})
</script>

<style lang="scss" scoped>
.model-design {
  display: flex;
  height: 100%;
  background-color: #fff;
  
  :deep(.ant-table-wrapper) {
    height: 100%;
    
    .ant-spin-nested-loading {
      height: 100%;
      
      .ant-spin-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
