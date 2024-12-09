<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useGlobalStore } from './stores/global'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const globalStore = useGlobalStore()

onMounted(async () => {
  await globalStore.initializeState()
})

// App level configuration
</script>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>
