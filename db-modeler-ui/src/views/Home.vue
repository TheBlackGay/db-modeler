<template>
  <div class="home">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">DB Modeler</div>
        <div class="header-right">
          <TenantSelector @tenant-changed="onTenantChanged" />
        </div>
      </a-layout-header>
      
      <a-layout>
        <a-layout-sider width="200" style="background: #fff">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            style="height: 100%"
          >
            <a-menu-item key="projects">
              <DatabaseOutlined />
              <span>项目管理</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        
        <a-layout-content class="content">
          <div class="content-wrapper">
            <template v-if="globalStore.currentTenant">
              <ProjectList v-if="selectedKeys[0] === 'projects'" />
            </template>
            <template v-else>
              <div class="placeholder">
                <a-empty description="请先选择租户" />
              </div>
            </template>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DatabaseOutlined } from '@ant-design/icons-vue'
import TenantSelector from '@/components/TenantSelector.vue'
import ProjectList from '@/components/ProjectList.vue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()
const selectedKeys = ref<string[]>(['projects'])

// 组件挂载时的处理
onMounted(() => {
  console.log('Home component mounted')
  // 在这里添加初始化逻辑
  if (globalStore.currentTenant) {
    // 如果已有租户，执行相关初始化
    console.log('Current tenant:', globalStore.currentTenant)
  }
})

// 处理租户切换事件
const onTenantChanged = () => {
  // 租户切换的逻辑已经在 globalStore 中处理
  console.log('租户已切换')
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
}

.content {
  padding: 24px;
  background: #fff;
  min-height: 280px;
}

.content-wrapper {
  background: #fff;
  padding: 24px;
  min-height: 360px;
}

.placeholder {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
}

:deep(.ant-layout) {
  background: #fff;
}

:deep(.ant-layout-sider) {
  background: #fff;
  border-right: 1px solid #f0f0f0;
}

:deep(.ant-menu) {
  border-right: none;
}

:deep(.ant-layout-header) {
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
}
</style>
