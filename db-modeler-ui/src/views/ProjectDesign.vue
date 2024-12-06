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
          </a-breadcrumb>
        </div>
      </div>
      <div class="right">
        <a-space>
          <a-button type="text">
            <template #icon><QuestionCircleOutlined /></template>
            帮助
          </a-button>
          <a-button type="text">
            <template #icon><SettingOutlined /></template>
            设置
          </a-button>
        </a-space>
      </div>
    </div>
    <div class="main-layout">
      <div class="main-sider">
        <div class="menu-list">
          <div class="menu-item" :class="{ active: currentMenu === 'model' }" @click="handleMenuClick('model')">
            <div class="icon-box">
              <AppstoreOutlined />
            </div>
            <span data-text="模">模</span>
            <span data-text="型">型</span>
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
  AuditOutlined
} from '@ant-design/icons-vue'
import { useGlobalStore } from '@/stores/global'

const router = useRouter()
const route = useRoute()
const globalStore = useGlobalStore()
const currentMenu = ref('model')

// 处理面包屑点击
const handleBreadcrumbClick = (type: string) => {
  switch (type) {
    case 'home':
      router.push('/')
      break
    case 'project':
      router.push('/project/list')
      break
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
  }
}

const getMenuTitle = (menu: string) => {
  const menuTitles: Record<string, string> = {
    'model': '模型',
    'type-design': '类型设置',
    'code-generator': '代码生成器',
    'version-control': '版本管理',
    'standard-check': '规范检查'
  }
  return menuTitles[menu] || ''
}

// 根据当前路由设置选中的菜单项
const updateSelectedKeysFromRoute = () => {
  const routeName = route.name as string
  if (routeName) {
    currentMenu.value = routeName.split('-').pop() || 'model'
  }
}

onMounted(() => {
  updateSelectedKeysFromRoute()
})

watch(
  () => route.name,
  () => {
    updateSelectedKeysFromRoute()
  }
)
</script>

<style lang="less" scoped>
.project-design {
  height: 100vh;
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
