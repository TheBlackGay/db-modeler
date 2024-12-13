<template>
  <div class="model-sidebar">
    <div class="model-sidebar__header">
      <div class="model-sidebar__title">
        <span>数据模型</span>
        <div class="model-sidebar__actions">
          <eye-outlined class="model-sidebar__icon" />
          <setting-outlined class="model-sidebar__icon" />
          <menu-outlined class="model-sidebar__icon" />
          <left-outlined class="model-sidebar__icon" />
        </div>
      </div>
    </div>

    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      mode="inline"
      :inline-collapsed="false"
      class="model-sidebar-menu"
    >
      <a-menu-item key="home">
        <template #icon>
          <home-outlined />
        </template>
        <span>首页封面</span>
      </a-menu-item>

      <a-sub-menu key="tables">
        <template #icon>
          <table-outlined />
        </template>
        <template #title>数据表</template>
        <a-menu-item
          v-for="table in tables"
          :key="'table-' + table.id"
          @click="handleTableClick(table)"
        >
          {{ table.name || table.code }}
        </a-menu-item>
        <a-menu-item v-if="tables.length === 0" disabled>
          暂无数据表
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="models">
        <template #icon>
          <database-outlined />
        </template>
        <template #title>数据模型</template>
        <a-menu-item
          v-for="model in models"
          :key="'model-' + model.id"
          @click="handleModelClick(model)"
        >
          {{ model.name }}
        </a-menu-item>
        <a-menu-item v-if="models.length === 0" disabled>
          暂无数据模型
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { message } from 'ant-design-vue'
import * as pinyin from 'pinyin'
import {
  HomeOutlined,
  EyeOutlined,
  SettingOutlined,
  MenuOutlined,
  LeftOutlined,
  TableOutlined,
  DatabaseOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>(['tables', 'models'])

// 计算属性：表格列表
const tables = computed(() => {
  return globalStore.projectTables || []
})

// 计算属性：模型列表
const models = computed(() => {
  return globalStore.projectModels || []
})

// 确保 projectId 是字符串类型
const getProjectId = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value
}

// 处理表点击
const handleTableClick = (table: any) => {
  const projectId = route.params.id
  console.log('Current route params:', route.params)
  console.log('Project ID:', projectId)
  
  if (!projectId) {
    message.error('项目ID不存在')
    return
  }
  
  router.push(`/project/${projectId}/design/model/tables/${table.id}/design`)
}

// 处理模型点击
const handleModelClick = (model: any) => {
  const projectId = getProjectId(route.params.projectId)
  router.push({
    name: 'model-design',
    params: {
      projectId,
      modelId: model.id
    }
  })
}

// 加载项目数据
const loadProjectData = async (projectId: string) => {
  try {
    await Promise.all([
      globalStore.loadProjectTables(projectId),
      globalStore.loadProjectModels(projectId)
    ])
  } catch (error) {
    console.error('Failed to load project data:', error)
  }
}

// 监听路由变化并加载数据
watch(() => route.params.projectId, async (newProjectId) => {
  if (newProjectId) {
    await loadProjectData(getProjectId(newProjectId))
  }
}, { immediate: true })

// 组件挂载时加载数据
onMounted(async () => {
  const projectId = route.params.projectId
  if (projectId) {
    await loadProjectData(getProjectId(projectId))
  }
})

// 监听路由变化更新选中状态
watch(() => route.name, (routeName) => {
  if (routeName === 'table-design') {
    const tableId = route.params.tableId
    selectedKeys.value = [`table-${tableId}`]
    openKeys.value = ['tables']
  } else if (routeName === 'model-design') {
    const modelId = route.params.modelId
    selectedKeys.value = [`model-${modelId}`]
    openKeys.value = ['models']
  } else if (routeName === 'model-home') {
    selectedKeys.value = ['home']
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.model-sidebar {
  width: 260px;
  border-right: 1px solid #f0f0f0;
  background: #fff;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }

  &__icon {
    cursor: pointer;
    color: #666;
    font-size: 16px;

    &:hover {
      color: #1890ff;
    }
  }

  .model-sidebar-menu {
    flex: 1;
    border-right: none;
  }

  :deep(.ant-menu) {
    border-right: none;
  }

  :deep(.ant-menu-item) {
    margin: 0;
    height: 40px;
    line-height: 40px;
    padding-left: 24px !important;
    
    &.ant-menu-item-disabled {
      color: rgba(0, 0, 0, 0.25);
      font-style: italic;
    }
  }

  :deep(.ant-menu-submenu-title) {
    margin: 0;
    height: 40px;
    line-height: 40px;
  }

  :deep(.ant-menu-sub) {
    background: transparent;
  }
}
</style>
