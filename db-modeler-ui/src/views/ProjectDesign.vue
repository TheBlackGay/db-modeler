<template>
  <div class="project-design">
    <div class="header">
      <div class="left">
        <div class="title">
          <a class="app-name link" @click="handleBreadcrumbClick('home')">DB Modeler</a>
          <span class="divider">/</span>
          <a class="project-name link" @click="handleBreadcrumbClick('project')">{{ globalStore.currentProject?.name }}</a>
          <span class="divider">/</span>
          <a-breadcrumb>
            <a-breadcrumb-item>
              <span>{{ getMenuTitle(currentMenu) }}</span>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-if="route.name && route.name !== 'model-home'">
              <span>{{ getSubMenuTitle(route.name as string) }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
      </div>
      <div class="right">
        <a-space>
          <a-button type="text" @click="handleMenuClick('settings')">
            <template #icon><SettingOutlined /></template>
            设置
          </a-button>
          <a-button type="text">
            <template #icon><QuestionCircleOutlined /></template>
            帮助
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="tool-bar">
      <div class="tool-bar-right">
        <div class="tool-group">
          <a-button type="text">
            <template #icon><SaveOutlined /></template>
            保存
          </a-button>
          <a-button type="text">
            <template #icon><ReloadOutlined /></template>
            刷新
          </a-button>
        </div>

        <div class="tool-group">
          <a-button type="text">
            <template #icon><TableOutlined /></template>
            新建实体
          </a-button>
          <a-button type="text">
            <template #icon><ApartmentOutlined /></template>
            理想实体
          </a-button>
        </div>

        <div class="tool-group">
          <a-button type="text">
            <template #icon><ShareAltOutlined /></template>
            分组
          </a-button>
          <a-button type="text">
            <template #icon><FormOutlined /></template>
            形式
          </a-button>
          <a-button type="text">
            <template #icon><ClusterOutlined /></template>
            模型导航
          </a-button>
        </div>

        <div class="tool-group">
          <a-button type="text">
            <template #icon><ForkOutlined /></template>
            对齐
          </a-button>
          <a-button type="text">
            <template #icon><ToolOutlined /></template>
            保护工具
          </a-button>
        </div>

        <div class="tool-group">
          <a-button type="text">
            <template #icon><ImportOutlined /></template>
            导入
          </a-button>
          <a-button type="text">
            <template #icon><ExportOutlined /></template>
            导出
          </a-button>
        </div>

        <div class="tool-group">
          <a-button type="text">
            <template #icon><HistoryOutlined /></template>
            操作历史
          </a-button>
        </div>

        <div class="search-box">
          <a-input-search
            placeholder="数据表/逻辑实体/全表检索/数据字典/字段"
            style="width: 300px"
            @search="onSearch"
          />
        </div>
      </div>
    </div>
    <div class="main-layout">
      <div class="main-sider">
        <div class="menu-list">
          <div class="menu-item" :class="{ active: currentMenu === 'model' }" @click="handleMenuClick('model')">
            <div class="icon-box">
              <template v-if="currentMenu === 'model'">
                <database-filled />
              </template>
              <template v-else>
                <database-outlined />
              </template>
            </div>
            <div class="menu-title">
              <span>数据模型</span>
            </div>
          </div>
       
          <div class="menu-item" :class="{ active: currentMenu === 'type-design' }" @click="handleMenuClick('type-design')">
            <div class="icon-box">
              <GlobalOutlined />
            </div>
            <span data-text="类">类</span>
            <span data-text="型">型</span>
            <span data-text="设">设</span>
            <span data-text="置">置</span>
          </div>
          <div class="menu-item" :class="{ active: currentMenu === 'code-generator' }" @click="handleMenuClick('code-generator')">
            <div class="icon-box">
              <CodeOutlined />
            </div>
            <span data-text="代">代</span>
            <span data-text="码">码</span>
            <span data-text="生">生</span>
            <span data-text="成">成</span>
            <span data-text="器">器</span>
          </div>
          <div class="menu-item" :class="{ active: currentMenu === 'version-control' }" @click="handleMenuClick('version-control')">
            <div class="icon-box">
              <HistoryOutlined />
            </div>
            <span data-text="版">版</span>
            <span data-text="本">本</span>
            <span data-text="管">管</span>
            <span data-text="理">理</span>
          </div>
          <div class="menu-item" :class="{ active: currentMenu === 'standard-check' }" @click="handleMenuClick('standard-check')">
            <div class="icon-box">
              <AuditOutlined />
            </div>
            <span data-text="规">规</span>
            <span data-text="范">范</span>
            <span data-text="检">检</span>
            <span data-text="查">查</span>
          </div>
          <div class="menu-item" :class="{ active: currentMenu === 'settings' }" @click="handleMenuClick('settings')">
            <div class="icon-box">
              <template v-if="currentMenu === 'settings'">
                <setting-filled />
              </template>
              <template v-else>
                <setting-outlined />
              </template>
            </div>
            <div class="menu-title">
              <span>项目设置</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="content-container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  QuestionCircleOutlined, 
  SettingOutlined, 
  AppstoreOutlined,
  GlobalOutlined,
  CodeOutlined,
  HistoryOutlined,
  AuditOutlined,
  SaveOutlined,
  ReloadOutlined,
  TableOutlined,
  ApartmentOutlined,
  ShareAltOutlined,
  FormOutlined,
  ClusterOutlined,
  ForkOutlined,
  ToolOutlined,
  ImportOutlined,
  ExportOutlined,
  DatabaseFilled,
  DatabaseOutlined,
  SettingFilled,
} from '@ant-design/icons-vue'
import { useGlobalStore } from '@/stores/global'
import { getTableDesigns } from '@/api/tableDesign'
import { projectApi } from '@/api/project'
import { tenantApi } from '@/api/tenant'

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()
const currentMenu = ref('model')
const tableCount = ref(0)

// 处理面包屑点击
const handleBreadcrumbClick = async (type: string) => {
  try {
    switch (type) {
      case 'home':
        await router.push('/')
        break
      case 'project':
        // 保存当前项目信息到 store
        if (globalStore.currentProject) {
          const currentProjectId = globalStore.currentProject.id
          await router.push({
            name: 'project-list',
            query: { 
              selectedId: currentProjectId,
              from: 'design'
            }
          })
        } else {
          await router.push('/project/list')
        }
        break
    }
  } catch (error) {
    console.error('导航失败:', error)
    // 如果导航失败，确保清理状态
    if (type === 'project') {
      globalStore.clearState()
    }
  }
}

// 处理菜单点击
const handleMenuClick = (menu: string) => {
  currentMenu.value = menu
  const projectId = route.params.id
  switch (menu) {
    case 'model':
      router.push(`/project/${projectId}/design/model`)
      break
    case 'type-design':
      router.push(`/project/${projectId}/design/type-design`)
      break
    case 'code-generator':
      router.push(`/project/${projectId}/design/code-generator`)
      break
    case 'version-control':
      router.push(`/project/${projectId}/design/version-control`)
      break
    case 'standard-check':
      router.push(`/project/${projectId}/design/standard-check`)
      break
    case 'settings':
      router.push(`/project/${projectId}/settings`)
      break
  }
}

const handleSubMenuClick = (submenu: string) => {
  const projectId = route.params.id
  switch (submenu) {
    case 'model-home':
      router.push(`/project/${projectId}/design/model/home`)
      break
    case 'model-tables':
      router.push(`/project/${projectId}/design/model/tables`)
      break
    case 'model-entities':
      router.push(`/project/${projectId}/design/model/entities`)
      break
    case 'model-views':
      router.push(`/project/${projectId}/design/model/views`)
      break
    case 'model-relations':
      router.push(`/project/${projectId}/design/model/relations`)
      break
  }
}

const getMenuTitle = (menu: string) => {
  const menuTitles: Record<string, string> = {
    'model': '数据模型',
    'type-design': '类型设置',
    'code-generator': '代码生成器',
    'version-control': '版本管理',
    'standard-check': '规范检查',
    'settings': '项目设置'
  }
  return menuTitles[menu] || ''
}

const getSubMenuTitle = (routeName: string) => {
  const subMenuTitles: Record<string, string> = {
    'model-home': '首页',
    'model-tables': '数据表',
    'model-entities': '实体',
    'model-views': '视图',
    'model-relations': '关系图'
  }
  return subMenuTitles[routeName] || ''
}

const onSearch = (value: string) => {
  console.log('search:', value);
};

// 获取表数量
const fetchTableCount = async () => {
  const projectId = route.params.id
  if (!projectId) return

  try {
    const response = await getTableDesigns()
    if (response?.data) {
      tableCount.value = response.data.filter(table => table.projectId === projectId).length
    } else {
      tableCount.value = 0
    }
  } catch (error) {
    console.error('获取表数量失败:', error)
    tableCount.value = 0
  }
}

// 加载项目信息
const loadProjectInfo = async () => {
  const projectId = route.params.id as string
  console.log('开始加载项目信息，projectId:', projectId)
  if (!projectId) return

  try {
    // 加载项目信息
    const project = await projectApi.getProjectById(projectId)
    console.log('获取到的项目信息:', project)
    if (!project) {
      console.error('找不到项目信息')
      return
    }

    // 如果没有租户或租户不匹配，加载并设置租户
    if (!globalStore.currentTenant || globalStore.currentTenant.id !== project.tenantId) {
      try {
        const tenant = await tenantApi.getTenantById(project.tenantId)
        console.log('获取到的租户信息:', tenant)
        if (tenant) {
          await globalStore.setCurrentTenant(tenant)
          console.log('已设置当前租户:', globalStore.currentTenant)
        } else {
          console.error('找不到项目对应的租户')
          return
        }
      } catch (error) {
        console.error('加载租户信息失败:', error)
        return
      }
    }

    // 设置当前项目
    globalStore.setCurrentProject(project)
    console.log('已设置当前项目:', globalStore.currentProject)

    // 加载项目的数据表列表
    try {
      console.log('开始加载项目数据表，projectId:', projectId)
      const tables = await projectApi.getProjectTables(projectId)
      console.log('获取到的数据表列表:', tables)
      if (tables && Array.isArray(tables)) {
        globalStore.setProjectTables(tables)
        console.log('已设置数据表到全局状态，当前数据表列表:', globalStore.projectTables)
      } else {
        console.warn('获取到的数据表不是数组:', tables)
      }
    } catch (error) {
      console.error('加载数据表列表失败:', error)
    }
  } catch (error) {
    console.error('加载项目信息失败:', error)
  }
}

// 根据当前路由设置选中的菜单项
const updateSelectedKeysFromRoute = () => {
  const routeName = route.name as string
  if (routeName) {
    // 如果路由名称以 model- 开头，说明是在数据模型模块下
    if (routeName.startsWith('model-')) {
      currentMenu.value = 'model'
    } else {
      // 其他模块直接使用路由名称
      currentMenu.value = routeName
    }
  }
}

// 组件挂载时初始化菜单状态
onMounted(async () => {
  await loadProjectInfo()
  updateSelectedKeysFromRoute()
  if (route.params.id) {
    fetchTableCount()
  }
})

// 监听路由参数变化
watch(
  () => route.params.id,
  async (newId) => {
    if (newId) {
      await loadProjectInfo()
    }
  }
)

// 监听路由名称变化
watch(
  () => route.name,
  (newName) => {
    updateSelectedKeysFromRoute()
    if (route.params.id && newName?.startsWith('model-')) {
      fetchTableCount()
    }
  }
)
</script>

<style lang="scss" scoped>
.project-design {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 48px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background-color: #fff;

    .left {
      .title {
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;

        .link {
          cursor: pointer;
          transition: color 0.3s;
          text-decoration: none;
          color: inherit;

          &:hover {
            color: #1890ff;
          }
        }

        .app-name {
          font-weight: 600;
        }

        .divider {
          margin: 0 8px;
          color: #d9d9d9;
        }

        .project-name {
          color: #666;
        }

        :deep(.ant-breadcrumb) {
          font-size: 14px;
          font-weight: normal;
          
          .ant-breadcrumb-link {
            color: #666;
            
            span {
              cursor: default;
            }
          }
        }
      }
    }

    .right {
      :deep(.ant-btn) {
        color: #666;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  .tool-bar {
    height: 40px;
    padding: 0 12px;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .tool-bar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tool-group {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 0 6px;
      border-right: 1px solid #f0f0f0;
      height: 100%;

      &:last-child {
        border-right: none;
      }

      .ant-btn {
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 32px;
        font-size: 13px;
        
        .anticon {
          font-size: 14px;
          margin-right: 4px;
        }
        
        &:hover {
          color: #1890ff;
          background-color: #e6f7ff;
        }
      }
    }

    .search-box {
      margin-left: 8px;
      padding-left: 8px;

      .ant-input-search {
        .ant-input {
          font-size: 13px;
        }
      }
    }
  }

  .main-layout {
    flex: 1;
    display: flex;
    overflow: hidden;

    .main-sider {
      width: 48px;
      background-color: #fff;
      border-right: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;

      .menu-list {
        padding: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .menu-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          padding: 4px 0;
          transition: all 0.3s;
          
          .icon-box {
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #666;
          }

          span {
            writing-mode: vertical-lr;
            letter-spacing: 2px;
            color: #666;
            font-size: 12px;
            line-height: 1.2;
            margin: 1px 0;
          }

          &:hover {
            background-color: #f5f5f5;
          }

          &.active {
            background-color: #e6f7ff;
            color: #1890ff;

            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 3px;
              background-color: #1890ff;
            }

            .icon-box {
              color: #1890ff;
            }

            span {
              color: #1890ff;
            }
          }
        }

        .sub-menu-list {
          padding: 8px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;

          .sub-menu-item {
            padding: 4px 0;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background-color: #f5f5f5;
            }

            &.active {
              background-color: #e6f7ff;
              color: #1890ff;

              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background-color: #1890ff;
              }
            }
          }
        }
      }
    }

    .main-content {
      flex: 1;
      background-color: #f0f2f5;
      padding: 16px;
      overflow: auto;

      .content-container {
        background: #fff;
        padding: 24px;
        min-height: 100%;
      }
    }
  }
}
</style>
