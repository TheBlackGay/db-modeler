<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo">DB Modeler</div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item key="projects">项目列表</a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content :style="{ padding: '24px', minHeight: '280px' }">
        <div class="content">
          <ProjectList />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ProjectList from '../components/ProjectList.vue'

const selectedKeys = ref<string[]>(['projects'])
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.content {
  background: #fff;
  padding: 24px;
  margin: 0;
  min-height: 280px;
}
</style>
