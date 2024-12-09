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
    <div class="model-sidebar__content">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        mode="inline"
        :inline-collapsed="false"
      >
        <a-menu-item key="home" @click="handleMenuClick('home')">
          <template #icon>
            <home-outlined />
          </template>
          <span>首页封面</span>
        </a-menu-item>

        <a-sub-menu key="tables">
          <template #title>
            <div class="group-title">
              <span class="title-content">
                <table-outlined />
                <span>数据表({{ tableList.length }})</span>
              </span>
              <div class="title-actions">
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <a class="action-trigger" @click.prevent>
                    <plus-outlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="create" @click="handleCreateTable">
                        <plus-outlined />
                        <span>创建表</span>
                      </a-menu-item>
                      <a-menu-item key="import">
                        <import-outlined />
                        <span>导入表</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </template>
          <template v-if="tableList.length > 0">
            <a-menu-item
              v-for="table in tableList"
              :key="'table-' + table.id"
              @click="handleMenuClick('table-' + table.id)"
            >
              <template #icon>
                <table-outlined />
              </template>
              <span>{{ table.displayName }}</span>
            </a-menu-item>
          </template>
        </a-sub-menu>

        <a-sub-menu key="entities">
          <template #title>
            <div class="group-title">
              <span class="title-content">
                <appstore-outlined />
                <span>实体</span>
              </span>
            </div>
          </template>
          <a-menu-item key="no-entities">
            <template #icon>
              <appstore-outlined />
            </template>
            <a-empty description="暂无实体" />
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="views">
          <template #title>
            <div class="group-title">
              <span class="title-content">
                <eye-outlined />
                <span>视图</span>
              </span>
            </div>
          </template>
          <a-menu-item key="no-views">
            <template #icon>
              <eye-outlined />
            </template>
            <a-empty description="暂无视图" />
          </a-menu-item>
        </a-sub-menu>

        <a-menu-item key="dictionary" @click="handleMenuClick('dictionary')">
          <template #icon>
            <book-outlined />
          </template>
          <span>数据字典</span>
        </a-menu-item>

        <a-menu-item key="relations" @click="handleMenuClick('relations')">
          <template #icon>
            <node-index-outlined />
          </template>
          <span>关系图</span>
        </a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/stores/global'
import { Empty } from 'ant-design-vue'
import {
  MenuOutlined,
  SettingOutlined,
  EyeOutlined,
  LeftOutlined,
  HomeOutlined,
  TableOutlined,
  AppstoreOutlined,
  BookOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  MoreOutlined,
  ImportOutlined
} from '@ant-design/icons-vue'

interface DataItem {
  id: string
  name: string
  displayName: string
}

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

const selectedKeys = ref<string[]>(['home'])
const openKeys = ref<string[]>(['tables'])
const tableList = computed(() => {
  console.log('Current project tables:', globalStore.projectTables)
  return globalStore.projectTables || []
})

// 处理菜单点击
const handleMenuClick = (key: string) => {
  console.log('Menu clicked:', key)
  if (key === 'home') {
    router.push({ name: 'model-home' })
  } else if (key === 'dictionary') {
    router.push({ name: 'model-dictionary' })
  } else if (key === 'relations') {
    router.push({ name: 'model-relations' })
  } else if (key.startsWith('table-')) {
    const tableId = key.replace('table-', '')
    const projectId = route.params.id
    console.log('Navigating to table design:', { tableId, projectId })
    
    // 从当前表列表中获取表的详细信息
    const selectedTable = tableList.value.find(table => table.id === tableId)
    console.log('Selected table:', selectedTable)
    
    router.push({ 
      name: 'table-design',
      params: { 
        id: projectId,
        tableId 
      }
    })
  }
}

// 处理创建表
const handleCreateTable = () => {
  const projectId = route.params.id
  router.push({ 
    name: 'table-design', 
    params: { 
      id: projectId,
      tableId: 'new' 
    } 
  })
}

// 在组件挂载时加载表列表
onMounted(async () => {
  const projectId = route.params.id
  if (projectId) {
    try {
      await globalStore.loadProjectTables(projectId)
    } catch (error) {
      console.error('Failed to load project tables:', error)
    }
  }
})

// 监听路由变化，确保在切换项目时重新加载表列表
watch(() => route.params.id, async (newProjectId) => {
  if (newProjectId) {
    try {
      await globalStore.loadProjectTables(newProjectId)
    } catch (error) {
      console.error('Failed to load project tables:', error)
    }
  }
}, { immediate: true })

// 监听路由变化
watch(() => route.name, () => {
  const routeName = route.name as string
  if (routeName === 'model-home') {
    selectedKeys.value = ['home']
  } else if (routeName === 'model-dictionary') {
    selectedKeys.value = ['dictionary']
  } else if (routeName === 'model-relations') {
    selectedKeys.value = ['relations']
  } else if (routeName === 'table-design') {
    const tableId = route.params.tableId as string
    selectedKeys.value = [`table-${tableId}`]
    openKeys.value = ['tables']
  }
})
</script>

<style lang="scss" scoped>
.model-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
  width: 240px;

  &__header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
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
    font-size: 16px;
    cursor: pointer;
    color: #595959;

    &:hover {
      color: #1890ff;
    }
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;

    :deep(.ant-menu) {
      border-right: none;
      width: 100%;
    }

    :deep(.ant-menu-item) {
      height: auto;
      line-height: 1.5715;
      padding: 8px 12px;
      margin: 4px 0;

      .anticon {
        margin-right: 8px;
      }
    }

    :deep(.ant-menu-item-group) {
      .ant-menu-item-group-title {
        padding: 8px 12px;
        margin: 4px 0;
        color: rgba(0, 0, 0, 0.88);
      }
    }
  }
}

.group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .title-actions {
    display: flex;
    gap: 8px;
  }

  .action-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: #595959;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
      color: #1890ff;
    }
  }
}

:deep(.ant-dropdown-menu-item) {
  padding: 8px 12px;

  .anticon {
    margin-right: 8px;
  }
}
</style>
